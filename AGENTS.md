# AGENTS.md

本文件适用于整个仓库，供 AI 编码 Agent 在一次读取后获得最小、可执行的工作约束。
完整说明见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 事实来源

开始任何修改前读取：

1. 当前 issue、维护者评论和验收条件；
2. `package.json`、`pnpm-workspace.yaml`、`eslint.config.ts`、`tsconfig.json`；
3. 与任务相关的源文件、测试和 `.github/` 工作流；
4. `CONTRIBUTING.md` 和 `README.md`。

配置与旧文档冲突时，以当前分支的可执行配置和维护者最新说明为准，并在 PR 中说明。
不要编造不存在的命令。

## 仓库速览

- 包管理器：pnpm
- 默认分支：`main`
- 应用：Next.js + React + TypeScript
- UI：React Bootstrap、Less/CSS Module
- 状态：MobX
- 国际化：`translation/zh-CN.ts`、`translation/zh-TW.ts`、
  `translation/en-US.ts`

主要路径：

```text
pages/         页面、MDX 和 API 路由
components/    React 组件
models/        MobX 模型和客户端
translation/   三种语言文案
styles/        全局及模块样式
lib/           领域工具
.github/       CI 和仓库自动化
```

## 常用命令

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm dev
corepack pnpm exec prettier --check <changed-files>
corepack pnpm exec eslint <changed-code-files>
corepack pnpm exec tsc --noEmit
corepack pnpm build
```

如果 pnpm 已安装，可省略 `corepack` 前缀。从 fork 开始工作时，先 fetch 正确的
`upstream` 并从 `upstream/main` 创建分支。

仅修改本指南时：

```bash
corepack pnpm exec prettier --check CONTRIBUTING.md AGENTS.md \
  .github/copilot-instructions.md
```

注意：当前 `pnpm test` 会执行 `git add .`。在有无关修改的工作区运行前先读
`package.json`，运行后检查暂存区。

## 实现规则

- 先搜索已有代码，以及修改相同功能或文件的开放和关闭 PR，避免重复实现。
- 只修改任务需要的文件，不做顺手重构。
- 跟随相邻代码模式；优先复用现有组件、模型、客户端和依赖。
- TypeScript 保持 strict 兼容，遵循 ESLint 和 Prettier。
- 用户可见文案使用 `I18nContext` / `t()`，同步三份翻译。
- 不因方便而更新 lockfile、格式化全仓库或降低检查级别。
- 不向已跟踪的 `.env` 添加 secret；本地 secret 使用被忽略的 `.env.local`。
- 不提交 token、cookie、密码、私钥、vault 内容或真实用户数据。

## 奖励任务

1. 检查 issue 的状态、assignee、评论、Development 和已有 PR。
2. 留言声明范围；不要假设外部镜像的 claim 命令在这里有效。
3. 开始前确认币种、结算方式和验收规则。
4. 从最新 `main` 建分支。
5. PR 中列出真实验证结果并使用 `Closes #<issue>`。
6. 奖励自动化只记录分配元数据，不验证价值、escrow 或实际付款。
7. 只有合并并完成结算后，才把奖励记录为已获得。

## 完成条件

- diff 只包含相关修改；
- 格式、类型、构建或范围对应的检查已运行；
- 未运行的检查被明确说明；
- PR 描述包含 Summary、Changes、Validation、Scope/Risks；
- 已认识到外部 fork 的 CI 不一定执行 lint、类型检查或 build；
- 没有凭据、调试残留、虚假结果或未授权副作用。
