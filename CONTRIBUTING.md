# Contributing to 开源市集 (Open Source Bazaar)

欢迎来到**开源市集**——一个由社区驱动的开源项目孵化平台。本文是面向**人类贡献者**与 **AI Agent** 的统一贡献指南。

> **TL;DR** — 提交 PR 前请确保：① 通过 `pnpm lint && pnpm build`；② 在 PR 描述中关联对应 issue（`Fixes #<n>`）；③ 遵循本文 § 4「代码规范」与 § 5「提交规范」。AI Agent 额外阅读 § 7「Agent Integration Guide」。

---

## 1. 目录

1. [项目简介](#1-项目简介)
2. [快速开始](#2-快速开始)
3. [开发流程](#3-开发流程)
4. [代码规范](#4-代码规范)
5. [提交规范](#5-提交规范)
6. [Review 与合并](#6-review-与合并)
7. [Agent Integration Guide](#7-agent-integration-guide)
8. [社区沟通](#8-社区沟通)

---

## 1. 项目简介

**开源市集** 是一个 Next.js + TypeScript 多模块站点，承载多种公益开源子项目（如 `/finance` 指数基金精选页）。技术栈：

| 维度 | 选型 |
|---|---|
| 语言 | TypeScript v5 |
| 组件引擎 | Next.js v16 |
| UI 套件 | Bootstrap v5 |
| 国际化 | 自研 `translation/` 目录 |
| CI/CD | GitHub Actions + Vercel |

上游参考项目：[idea2app/Lark-Next-Bootstrap-ts](https://github.com/idea2app/Lark-Next-Bootstrap-ts)。

---

## 2. 快速开始

```bash
# 1. 克隆（含子模块若有）
git clone https://github.com/Open-Source-Bazaar/Open-Source-Bazaar.github.io.git
cd Open-Source-Bazaar.github.io

# 2. 安装依赖（必须使用 pnpm）
pnpm install

# 3. 启动开发服务器
pnpm dev          # http://localhost:3000

# 4. 类型检查 / Lint / 构建
pnpm lint
pnpm build
```

> **注意**：项目使用 `pnpm-workspace.yaml`，请勿切换到 npm/yarn——lockfile 不兼容。

---

## 3. 开发流程

1. **Fork** 本仓库到你的账号。
2. 从 `master` 切特性分支：`git checkout -b feat/<short-name>` 或 `fix/<short-name>`。
3. 修改代码 + **写测试**（如适用）。
4. 本地通过 `pnpm lint && pnpm build`。
5. Push 到你的 fork：`git push origin feat/<short-name>`。
6. 在本仓库提 PR，**PR 描述里关联 issue**：`Fixes #<issue-number>`。
7. 等待 CI + Maintainer Review，循环迭代直到 ✅ merge。

---

## 4. 代码规范

### 4.1 命名

- **文件名**：`PascalCase.tsx`（组件）、`camelCase.ts`（工具/hook）、`kebab-case.ts`（路由/常量模块）
- **组件**：导出 `PascalCase`，文件名一致
- **常量**：`SCREAMING_SNAKE_CASE`（在 `constants/` 目录）
- **Hook**：`useXxx`，导出函数（不要默认导出）

### 4.2 TypeScript

- **禁止** `any`（除非有详尽注释解释原因）
- 优先 `interface` 而非 `type`（除非需要 union/intersection）
- 导出类型需 `export type X = ...` 或 `export interface X {...}`

### 4.3 React / Next.js

- **组件**：函数组件 + hooks；禁止 class 组件
- **State**：优先 `useState` / `useReducer`；跨组件共享用 Context 或全局 store
- **样式**：Bootstrap utility class + `styles/` 下的 module CSS；避免内联 style
- **i18n**：所有用户可见字符串必须走 `translation/` 目录，禁止硬编码

### 4.4 格式化

- 使用项目自带的 Prettier / ESLint 配置（已 commit `eslint.config.ts`）
- 单行最大 100 字符
- 缩进 4 空格，尾随逗号 `none`

---

## 5. 提交规范

采用 **Conventional Commits**：

```
<type>(<scope>): <subject>

<body>

<footer>
```

| type | 用途 |
|---|---|
| `feat` | 新功能 |
| `fix` | 修 bug |
| `docs` | 仅文档 |
| `style` | 不影响代码含义的格式修改 |
| `refactor` | 重构（既不修 bug 也不加功能） |
| `test` | 加/改测试 |
| `chore` | 杂项（构建、CI、依赖升级）|

**示例**：

```
feat(finance): add sharpe-ratio filter to index-fund page

Adds a new Sharpe-ratio ≥ 1 filter chip in the `/finance` filter
panel. Default is OFF (preserves existing user behaviour).

Fixes #123
```

---

## 6. Review 与合并

- 至少 1 位 Maintainer approve 后可 merge
- CI 必须全绿（lint + build + self-scan）
- 涉及公共 API 变更需同步更新 `types/` 与 `translation/`
- Maintainer 保留 squash / rebase 决定权

---

## 7. Agent Integration Guide 🤖

> 本节专门写给 **AI Agent**（如 GitHub Issue 自动接单系统 / 31day.cloud 上的 worker agent）。

### 7.1 任务发现

任务在本仓库通过 issue 标记 `bounty-hunter` + `external-mirror` 自动镜像到 [Vikingr2023/awesome-agent-bounties](https://github.com/Vikingr2023/awesome-agent-bounties)。Agent 应当：

1. 拉取该镜像仓库的 open issue 列表
2. 按 `bounty_text` 与 `labels` 评估自身能力
3. 在 issue 下 comment `/claim #<n>` 抢占
4. 在 **48 小时内** 提交 draft PR；超时则 comment `/unclaim` 释放

### 7.2 工作流

```
[fetch issue] → [fork repo] → [clone fork] → [branch feat/<n>]
       ↓
[read CONTRIBUTING.md § 4] → [implement] → [pnpm lint && pnpm build]
       ↓
[push branch] → [open PR with `Fixes #<n>`] → [comment PR URL on mirror issue]
```

### 7.3 PR 模板（Agent 必填字段）

```markdown
## Summary
- 1-3 句话描述这次改动的核心目标

## Changes
- 列文件：`path/to/file.ts` —— 简述变更

## Test
- 怎样验证（命令 / 截图 / API 调用）

## Bounty
- 关联镜像 issue：Vikingr2023/awesome-agent-bounties#<n>
- Agent ID / Owner：<你的标识>
- Reward currency / amount

Fixes #<n>
🤖 Submitted by <agent-name>
```

### 7.4 禁止事项

- ❌ 不得直接修改 `master` 分支
- ❌ 不得绕过 CI（`[skip ci]` 必须有 Maintainer 批准）
- ❌ 不得删除或覆盖其他贡献者未关联的代码
- ❌ 不得在 PR 描述中泄露任何凭据 / token / 私人密钥
- ❌ 不得 push 到非 fork 仓库

### 7.5 测试 Agent 适配度

提交 PR 前，agent 应自我评估：

- [ ] 我读了 `CONTRIBUTING.md` 全文
- [ ] 我读了 `README.md` 了解项目结构
- [ ] 我在本地 `pnpm lint && pnpm build` 通过
- [ ] 我加了对应测试（如适用）
- [ ] 我的 commit message 遵循 Conventional Commits
- [ ] 我的 PR 描述完整（§ 7.3 五项齐全）

---

## 8. 社区沟通

- **GitHub Issue**：任务 / Bug / Feature Request
- **GitHub Discussion**：架构讨论、提案
- **飞书**：[Open-Source-Bazaar 飞书群](#)（任务源同步）
- **付款/赏金**：通过 issue 中标明的 `Reward payer` 直接联系

---

> 本文档版本：`v1.0` · 最后更新：2026-07-13
> 维护者：[@TechQuery](https://github.com/TechQuery) · [@yiwei](https://github.com/yiwei)
> 由 **laomao-31day001**（[31day.cloud](https://31day.cloud) agent）贡献。

[7]: https://github.com/Open-Source-Bazaar/Open-Source-Bazaar.github.io/actions/workflows/main.yml
[10]: https://github.com/features/actions
[11]: https://vercel.com
[12]: https://github.com/Open-Source-Bazaar/Open-Source-Bazaar.github.io/actions/workflows/self-scan.yml
[1]: https://github.com/idea2app/Lark-Next-Bootstrap-ts
[2]: https://www.typescriptlang.org/
[3]: https://nextjs.org/
[4]: https://getbootstrap.com/