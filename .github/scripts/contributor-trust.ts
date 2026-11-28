import { $, argv } from 'npm:zx';

$.verbose = true;

/** 与 `share-reward.ts` 中的同名判断保持一致，后续可抽成公共模块 */
function isBotUser(login: string) {
  const lowerLogin = login.toLowerCase();

  return (
    lowerLogin.includes('copilot') ||
    lowerLogin.includes('[bot]') ||
    lowerLogin === 'github-actions[bot]' ||
    lowerLogin.endsWith('[bot]')
  );
}

const [repositoryOwner, repositoryName, pullRequestNumber] = argv._;

if (!repositoryOwner || !repositoryName || !pullRequestNumber)
  throw new ReferenceError(
    'Usage: contributor-trust.ts <owner> <repo> <pull-request-number>',
  );

const repoPath = `repos/${repositoryOwner}/${repositoryName}`;
const prNumber = Number(pullRequestNumber);

/** 用于定位本工作流自己留下的评论，保证重跑时只更新、不刷屏 */
const COMMENT_MARKER = '<!-- contributor-trust -->';

const DAY = 86_400_000;

async function api<T>(path: string, jq: string): Promise<T> {
  const { stdout } = await $`gh api ${path} --jq ${jq}`;

  return JSON.parse(stdout.trim()) as T;
}

const daysSince = (ISO_Date: string) =>
  Math.floor((Date.now() - new Date(ISO_Date).getTime()) / DAY);

// ---------- 1. PR 基础信息 ----------

interface PullRequest {
  author: string;
  authorType: string;
  body: string;
  labels: string[];
  url: string;
}

const { author, authorType, body, labels, url: PR_URL } =
  await api<PullRequest>(
    `${repoPath}/pulls/${prNumber}`,
    '{author: .user.login, authorType: .user.type, body: (.body // ""), labels: [.labels[].name], url: .html_url}',
  );

const bot = isBotUser(author) || authorType === 'Bot';

// ---------- 2. 作者历史 ----------

const { created: accountCreatedAt } = await api<{ created: string }>(
  `users/${author}`,
  '{created: .created_at}',
);

const accountAge = daysSince(accountCreatedAt);

const mergedCount = await api<number>(
  `search/issues?q=${encodeURIComponent(
    `repo:${repositoryOwner}/${repositoryName} is:pr is:merged author:${author}`,
  )}&per_page=1`,
  '.total_count',
);

// ---------- 3. 本次变更 ----------

interface ChangedFile {
  path: string;
  additions: number;
  deletions: number;
}

const files = await api<ChangedFile[]>(
  `${repoPath}/pulls/${prNumber}/files?per_page=100`,
  '[.[] | {path: .filename, additions: .additions, deletions: .deletions}]',
);

const changedLines = files.reduce(
  ({ additions, deletions }, file) => ({
    additions: additions + file.additions,
    deletions: deletions + file.deletions,
  }),
  { additions: 0, deletions: 0 },
);

const lineCount = changedLines.additions + changedLines.deletions;
const fileCount = files.length;
const touchesCI = files.some(({ path }) => path.startsWith('.github/'));
const touchesDependency = files.some(({ path }) =>
  /(^|\/)(package\.json|pnpm-lock\.yaml|package-lock\.json|yarn\.lock)$/.test(
    path,
  ),
);

// ---------- 4. 近期提交密度 ----------

const since = new Date(Date.now() - DAY).toISOString().slice(0, 10);

const burst = await api<number>(
  `search/issues?q=${encodeURIComponent(
    `repo:${repositoryOwner}/${repositoryName} is:pr author:${author} created:>=${since}`,
  )}&per_page=100`,
  '.total_count',
);

// ---------- 5. 打分 ----------

interface Signal {
  score: number;
  reason: string;
}

const signals: Signal[] = [];

if (bot) signals.push({ score: 5, reason: '账号类型为 Bot' });

if (accountAge < 7)
  signals.push({ score: 3, reason: `账号仅 ${accountAge} 天` });
else if (accountAge < 30)
  signals.push({ score: 2, reason: `账号 ${accountAge} 天，历史不足` });

if (!mergedCount)
  signals.push({ score: 1, reason: '本仓库无已合并 PR 记录' });

if (body.trim().length < 80)
  signals.push({ score: 2, reason: 'PR 描述过短，无法判断改动意图' });

if (lineCount > 800 || fileCount > 20)
  signals.push({
    score: 2,
    reason: `变更过大（${fileCount} 个文件 / ${lineCount} 行）`,
  });

if (touchesCI)
  signals.push({ score: 2, reason: '修改了 `.github/` 下的配置，需人工复核' });

if (touchesDependency)
  signals.push({ score: 1, reason: '修改了依赖或锁文件' });

if (burst >= 4)
  signals.push({ score: 2, reason: `24 小时内开了 ${burst} 个 PR` });

const score = signals.reduce((sum, { score }) => sum + score, 0);

// ---------- 6. 分级 ----------

const TRUST_LEVEL = [
  {
    name: 'trusted-contributor',
    color: '0e8a16',
    description: 'Contributor with clean history',
  },
  {
    name: 'first-time-contributor',
    color: 'fbca04',
    description: 'First-time contributor, review as usual',
  },
  {
    name: 'needs-human-review',
    color: 'd93f0b',
    description: 'Needs priority human review',
  },
  {
    name: 'bot-pr',
    color: '5319e7',
    description: 'Pull request opened by a Bot account',
  },
] as const;

const trustLevel = bot
  ? TRUST_LEVEL[3]
  : score >= 4
    ? TRUST_LEVEL[2]
    : score >= 1
      ? TRUST_LEVEL[1]
      : TRUST_LEVEL[0];

// ---------- 7. 同步标签 ----------

for (const { name, color, description } of TRUST_LEVEL)
  await $`gh label create ${name} --color ${color} --description ${description} --force`;

const managedLabels: string[] = TRUST_LEVEL.map(({ name }) => name);

for (const name of labels.filter(label => managedLabels.includes(label)))
  if (name !== trustLevel.name)
    await $`gh pr edit ${prNumber} --remove-label ${name}`;

if (!labels.includes(trustLevel.name))
  await $`gh pr edit ${prNumber} --add-label ${trustLevel.name}`;

// ---------- 8. 幂等评论 ----------

const commentBody = `${
  COMMENT_MARKER
}
### 贡献者可信度：**${trustLevel.name}**（${score} 分）

| 信号 | 值 |
| --- | --- |
| 作者 | @${author}${bot ? '（Bot）' : ''} |
| 账号年龄 | ${accountAge} 天 |
| 本仓库已合并 PR | ${mergedCount} |
| 本次变更 | ${fileCount} 个文件 / ${lineCount} 行 |
| 24 小时内 PR 数 | ${burst} |

**触发项**

${signals.length ? signals.map(({ reason }) => `- ${reason}`).join('\n') : '- 无'}

> 本检查只做分级，不会关闭任何 PR。维护者可按需复核。`;

const [existingComment] = await api<number[]>(
  `${repoPath}/issues/${prNumber}/comments?per_page=100`,
  `[.[] | select(.body | contains("${COMMENT_MARKER}")) | .id]`,
);

if (existingComment)
  await $`gh api --method PATCH ${repoPath}/issues/comments/${existingComment} --field body=${commentBody}`;
else
  await $`gh api --method POST ${repoPath}/issues/${prNumber}/comments --field body=${commentBody}`;

console.table({
  'PR': PR_URL,
  Author: author,
  Trust: trustLevel.name,
  Score: score,
});
