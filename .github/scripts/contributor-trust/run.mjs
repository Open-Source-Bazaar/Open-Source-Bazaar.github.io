import { appendFile } from 'node:fs/promises';

import { evaluatePullRequest } from './rules.mjs';

const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const pullNumber = Number(process.env.TRUST_PR_NUMBER);
const token = process.env.GITHUB_TOKEN;
const marker = '<!-- contributor-trust-gate -->';

if (!owner || !repo || !Number.isInteger(pullNumber) || !token) {
  throw new Error('GITHUB_REPOSITORY, TRUST_PR_NUMBER and GITHUB_TOKEN are required');
}

async function api(path, options = {}, allowNotFound = false) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...options.headers,
    },
  });
  if (allowNotFound && response.status === 404) return null;
  if (!response.ok) throw new Error(`${options.method ?? 'GET'} ${path}: ${response.status}`);
  return response.status === 204 ? null : response.json();
}

async function ensureLabel(name, color, description) {
  const encoded = encodeURIComponent(name);
  const existing = await api(`/repos/${owner}/${repo}/labels/${encoded}`, {}, true);
  if (existing) return;
  await api(`/repos/${owner}/${repo}/labels`, {
    method: 'POST',
    body: JSON.stringify({ name, color, description }),
  });
}

async function setLabel(name, enabled) {
  const encoded = encodeURIComponent(name);
  if (enabled) {
    await api(`/repos/${owner}/${repo}/issues/${pullNumber}/labels`, {
      method: 'POST',
      body: JSON.stringify({ labels: [name] }),
    });
  } else {
    await api(
      `/repos/${owner}/${repo}/issues/${pullNumber}/labels/${encoded}`,
      {
        method: 'DELETE',
      },
      true,
    );
  }
}

async function syncComment(body, createWhenMissing) {
  const comments = await api(`/repos/${owner}/${repo}/issues/${pullNumber}/comments?per_page=100`);
  const existing = comments.find(comment => comment.body?.includes(marker));
  if (existing) {
    await api(`/repos/${owner}/${repo}/issues/comments/${existing.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ body }),
    });
  } else if (createWhenMissing) {
    await api(`/repos/${owner}/${repo}/issues/${pullNumber}/comments`, {
      method: 'POST',
      body: JSON.stringify({ body }),
    });
  }
}

const pull = await api(`/repos/${owner}/${repo}/pulls/${pullNumber}`);
const result = evaluatePullRequest({
  body: pull.body ?? '',
  draft: pull.draft,
  authorAssociation: pull.author_association,
  authorType: pull.user?.type,
  changedFiles: pull.changed_files,
  additions: pull.additions,
});

await ensureLabel('contributor-check:passed', '1f883d', '贡献信息门禁已通过');
await ensureLabel('needs-contributor-info', 'd1242f', '需要补充可验证的贡献信息');
await ensureLabel('needs-maintainer-review', 'bf8700', '需要维护者人工复核');

await setLabel('contributor-check:passed', result.passed && !result.skipped);
await setLabel('needs-contributor-info', !result.passed);
await setLabel('needs-maintainer-review', result.reviewReasons.length > 0);

const missingLines = result.missing.map(item => `- [ ] ${item}`).join('\n');
const reviewLines = result.reviewReasons.map(item => `- ${item}`).join('\n');
const comment = `${marker}
## 贡献信息检查

${result.passed ? '已通过自动检查。维护者仍会审阅实现质量和实际行为。' : `请补充以下信息后再次更新 PR：\n\n${missingLines}`}
${reviewLines ? `\n### 人工复核提示\n\n${reviewLines}` : ''}

本检查不禁止使用 AI，但提交者必须理解改动、披露使用情况并提供真实验证证据。`;

await syncComment(comment, !result.passed || result.reviewReasons.length > 0);

if (process.env.GITHUB_STEP_SUMMARY) {
  await appendFile(
    process.env.GITHUB_STEP_SUMMARY,
    `## Contributor trust gate\n\n- PR: #${pullNumber}\n- Result: ${result.skipped ? 'skipped (draft)' : result.passed ? 'passed' : 'failed'}\n- Missing: ${result.missing.length}\n- Manual review reasons: ${result.reviewReasons.length}\n`,
  );
}

if (!result.passed) {
  process.exitCode = 1;
  console.error(`Contributor information is incomplete: ${result.missing.join('; ')}`);
}
