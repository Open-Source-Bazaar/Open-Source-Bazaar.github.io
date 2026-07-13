import assert from 'node:assert/strict';
import test from 'node:test';

import { evaluatePullRequest, linkedIssueNumbers } from './rules.mjs';

const completeBody = `## 变更说明

修复奖励任务页面的状态同步问题，并补充回归覆盖以避免同类问题再次出现。

## 关联任务

Closes #89

## 验证方式

运行 pnpm test，全部测试通过；随后执行 pnpm build，构建成功。

## 贡献声明

- [x] 我已阅读并理解本次改动，能够回答维护者的问题
- [x] 我已实际运行上方验证步骤，并如实记录结果

AI 使用情况：使用了代码补全，已逐行复核并运行测试。`;

test('passes a complete external contribution', () => {
  const result = evaluatePullRequest({ body: completeBody });
  assert.equal(result.passed, true);
  assert.deepEqual(result.missing, []);
});

test('lists every missing proof for an empty template', () => {
  const result = evaluatePullRequest({ body: 'Closes #XXXXX' });
  assert.equal(result.passed, false);
  assert.equal(result.missing.length, 6);
});

test('trusted maintainers bypass contributor proof fields', () => {
  const result = evaluatePullRequest({ body: '', authorAssociation: 'MEMBER' });
  assert.equal(result.passed, true);
  assert.equal(result.trusted, true);
});

test('draft pull requests are skipped until ready', () => {
  const result = evaluatePullRequest({ body: '', draft: true });
  assert.equal(result.passed, true);
  assert.equal(result.skipped, true);
});

test('flags bots and unusually large changes for manual review', () => {
  const result = evaluatePullRequest({
    body: completeBody,
    authorType: 'Bot',
    changedFiles: 51,
    additions: 1501,
  });
  assert.equal(result.passed, true);
  assert.equal(result.reviewReasons.length, 3);
});

test('requires maintainer authorization for reward work', () => {
  const result = evaluatePullRequest({
    body: completeBody,
    rewardAuthorization: {
      required: true,
      authorized: false,
      issueNumbers: [89],
    },
  });
  assert.equal(result.passed, false);
  assert.match(result.missing.join('\n'), /implementation-approved/);
});

test('accepts reward work assigned or approved by a maintainer', () => {
  const result = evaluatePullRequest({
    body: completeBody,
    rewardAuthorization: {
      required: true,
      authorized: true,
      issueNumbers: [89],
    },
  });
  assert.equal(result.passed, true);
});

test('extracts unique closing issue references', () => {
  assert.deepEqual(linkedIssueNumbers('Closes #89, fixes #90 and resolves #89'), [89, 90]);
});
