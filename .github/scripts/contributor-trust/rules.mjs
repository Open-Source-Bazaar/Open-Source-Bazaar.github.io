const trustedAssociations = new Set(['OWNER', 'MEMBER', 'COLLABORATOR']);

function cleanText(value = '') {
  return value
    .replace(/<!--[^]*?-->/g, '')
    .replace(/```[^]*?```/g, match => match.replace(/```\w*/g, ''))
    .trim();
}

function section(body, names) {
  const lines = body.split(/\r?\n/);
  const heading = new RegExp(`^##\\s+(?:${names.join('|')})\\s*$`, 'i');
  const start = lines.findIndex(line => heading.test(line.trim()));
  if (start < 0) return '';

  const content = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    if (/^##\s+/.test(lines[index].trim())) break;
    content.push(lines[index]);
  }
  return cleanText(content.join('\n'));
}

function hasChecked(body, phrase) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`-\\s*\\[[xX]\\]\\s*${escaped}`, 'u').test(body);
}

export function evaluatePullRequest({
  body = '',
  draft = false,
  authorAssociation = 'NONE',
  authorType = 'User',
  changedFiles = 0,
  additions = 0,
}) {
  if (draft) {
    return { passed: true, skipped: true, missing: [], reviewReasons: [] };
  }

  const trusted = trustedAssociations.has(authorAssociation);
  const summary = section(body, ['变更说明', 'Summary']);
  const verification = section(body, ['验证方式', 'Verification']);
  const missing = [];

  if (!trusted) {
    if (summary.length < 20) missing.push('补充不少于 20 字的变更说明');
    if (
      verification.length < 12 ||
      /^(?:未运行|未测试|none|not run|n\/?a|无)[。.!\s]*$/iu.test(verification)
    ) {
      missing.push('填写实际运行的验证命令、场景和结果');
    }
    if (!/(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s+#\d+/iu.test(body)) {
      missing.push('使用 Closes/Fixes/Resolves #编号 关联任务');
    }
    if (!hasChecked(body, '我已阅读并理解本次改动，能够回答维护者的问题')) {
      missing.push('勾选“已阅读并理解本次改动”责任声明');
    }
    if (!hasChecked(body, '我已实际运行上方验证步骤，并如实记录结果')) {
      missing.push('勾选“已实际运行验证步骤”责任声明');
    }

    const disclosure = body.match(/^AI 使用情况：\s*(.+)$/imu)?.[1]?.trim() ?? '';
    if (!disclosure || /^(?:未填写|待填写|todo|n\/?a)$/iu.test(disclosure)) {
      missing.push('如实填写 AI 使用情况及人工复核内容');
    }
  }

  const reviewReasons = [];
  if (authorType === 'Bot') reviewReasons.push('机器人账号提交');
  if (changedFiles > 50) reviewReasons.push(`改动文件较多（${changedFiles}）`);
  if (additions > 1500) reviewReasons.push(`新增代码量较大（${additions} 行）`);

  return {
    passed: missing.length === 0,
    skipped: false,
    trusted,
    missing,
    reviewReasons,
  };
}
