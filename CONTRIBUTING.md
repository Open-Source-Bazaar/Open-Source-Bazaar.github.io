# 贡献指南 / Contributing Guide

感谢你为开源市集（Open Source Bazaar）做贡献。本指南同时适用于人工贡献者和
AI 编码 Agent。目标是让每个变更都可审查、可验证，并且与仓库当前状态一致。

## 1. 先确认事实来源

仓库会持续更新。不要根据旧 PR、外部镜像或记忆猜测命令和版本。开始任务时按以下
优先级读取信息：

1. 当前任务的 issue、维护者评论和验收条件；
2. 根目录的 `AGENTS.md`；
3. 当前分支的 `package.json`、`pnpm-workspace.yaml`、`eslint.config.ts`、
   `tsconfig.json` 和相关源文件；
4. `.github/` 中的工作流、模板和专项说明；
5. 本文档和 `README.md`。

如果说明与实际配置冲突，以当前分支的可执行配置和维护者最新说明为准，并在 PR 中
指出冲突。不要自行发明不存在的脚本。

## 2. 项目概览

本项目是使用 Next.js、React 和 TypeScript 构建的开源项目展示网站。当前主要目录：

| 路径           | 用途                                |
| -------------- | ----------------------------------- |
| `pages/`       | Next.js 页面、MDX 内容和 API 路由   |
| `components/`  | 可复用的 React 组件                 |
| `models/`      | MobX 数据模型、配置和外部服务客户端 |
| `translation/` | `zh-CN`、`zh-TW` 和 `en-US` 文案    |
| `styles/`      | 全局样式和 Less/CSS Module          |
| `lib/`         | 领域工具和数据处理逻辑              |
| `constants/`   | 共享常量                            |
| `public/`      | 静态资源                            |
| `.github/`     | CI、issue/PR 模板和仓库自动化       |

确切依赖版本以 `package.json` 和 `pnpm-lock.yaml` 为准。

## 3. 开发环境

部署工作流使用 Node.js 24；本地环境应使用兼容的现代 Node.js 版本。可以使用已安装的
pnpm，也可以通过 Corepack 运行：

```bash
node --version
corepack pnpm --version
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

如果系统已经安装 pnpm，直接使用对应的 `pnpm` 命令即可。

开发服务器默认运行在 <http://localhost:3000>。

安装依赖时会执行 `package.json` 中的生命周期脚本。当前 `install` 脚本会尝试下载可选
key-vault，失败不会中断安装。Agent 必须先阅读这些脚本，不得把下载的 vault 内容、
凭据或本地环境文件提交到仓库。

## 4. 选择并声明任务

1. 确认 issue 仍然开放，并检查 assignee、评论、Development 区域和已有 PR。
2. 在开始前留言说明计划、范围和预计交付内容。不要假设某个外部镜像的
   `/claim` 命令适用于本仓库。
3. 如果已有实现，先判断是复用、补充还是避免重复；不要静默覆盖其他贡献者的工作。
4. 奖励任务应在开始前确认币种、结算方式和验收规则。

## 5. 分支和提交

从上游仓库最新的 `main` 创建一个范围明确的分支，而不是只信任可能过期的 fork：

```bash
upstream_url=https://github.com/Open-Source-Bazaar/Open-Source-Bazaar.github.io.git
if git remote get-url upstream >/dev/null 2>&1; then
  if [ "$(git remote get-url upstream)" != "$upstream_url" ]; then
    echo "upstream points to an unexpected repository" >&2
    exit 1
  fi
else
  git remote add upstream "$upstream_url"
fi
git fetch upstream
git switch main
git merge --ff-only upstream/main
git push origin main
git switch -c feat/short-description
```

该 URL 检查会在已有 `upstream` 指向其他地址时停止流程，避免从错误的上游同步。

文档、修复和维护任务可以分别使用 `docs/`、`fix/`、`chore/` 前缀。提交信息应简洁
说明意图，例如：

```text
docs: add agent-aware contribution guide
fix(finance): preserve selected risk filter
```

每个 PR 只处理一个可审查目标。除非任务明确要求：

- 不要改动无关文件；
- 不要更新 lockfile；
- 不要重新格式化整个仓库；
- 不要提交生成目录、编辑器设置、本地环境文件或凭据。

## 6. 代码规范

### TypeScript 和导入

- 保持 `strict` TypeScript 兼容，优先精确类型。
- 遵循 ESLint；`interface` 是对象结构的默认形式。
- 清除无用变量和导入，不新增无理由的 `any`。
- 导入顺序由 `simple-import-sort` 规则管理。
- 优先复用现有模型、客户端和 `web-utility` 等已安装依赖。

### React、状态和界面

- 先匹配相邻代码的现有模式，不做与任务无关的架构重写。
- 优先复用 React Bootstrap 组件和现有组件。
- 跨组件状态遵循已有 MobX 模型；不要创建重复的数据客户端。
- 保留语义化 HTML、键盘操作和可访问标签。
- 样式优先使用现有 Bootstrap utility、Less 或 CSS Module 结构。

### 国际化

面向用户的新文案应通过现有 `I18nContext` / `t()` 流程提供，并同步更新：

- `translation/zh-CN.ts`
- `translation/zh-TW.ts`
- `translation/en-US.ts`

不要只在 JSX 中硬编码一种语言。

### 格式化

根目录 `package.json` 是格式化规则的事实来源。当前关键规则包括：

- 单引号；
- 允许尾随逗号；
- 100 字符打印宽度；
- 单参数箭头函数不加括号。

使用仓库安装的 Prettier，不要用个人全局配置覆盖项目规则。

## 7. 验证

根据变更范围运行最小但充分的验证。

### 仅 Markdown

```bash
pnpm exec prettier --check CONTRIBUTING.md AGENTS.md .github/copilot-instructions.md
```

同时手动检查链接、标题层级、代码块和命令是否存在。

### TypeScript / React

下面的 `pages/index.tsx` 是语法有效的现有示例路径；验证实际变更时，将其替换为本次
修改的文件路径。

```bash
pnpm exec prettier --check pages/index.tsx
pnpm exec eslint pages/index.tsx
pnpm exec tsc --noEmit
pnpm build
```

如果变更涉及页面，启动 `pnpm dev` 并验证受影响路由、响应式布局和语言切换。

### 关于 `pnpm test`

当前 `test` 脚本会运行 `lint-staged`，随后执行 `git add .` 和 TypeScript 检查。
它会修改 Git 暂存区，因此在共享或包含无关修改的工作区中不要盲目运行。使用前先读
`package.json`，运行后检查 `git status`，并只提交本任务文件。

无法运行某项验证时，在 PR 中写明原因；不要声称未执行的检查已经通过。

当前 CI/CD 在 push 时触发，但 checkout、Node 设置和部署取决于 Vercel secrets。它不为
外部 fork 提供通用的 lint、类型检查或 build 门禁，而且首次 fork workflow 可能等待维护者
批准。因此 PR 中必须提供本地验证证据，不能只依赖绿色状态。

## 8. Pull Request

推送分支并创建 PR，目标分支为 `main`。PR 描述至少包含：

- **Summary**：问题和解决方案；
- **Changes**：修改的文件和行为；
- **Validation**：实际运行的命令及结果；
- **Scope / Risks**：未处理内容、兼容性或后续工作；
- 仅当该 PR 应关闭对应 issue 时，添加关闭引用，例如 `Closes #90`。

填写 `.github/PULL_REQUEST_TEMPLATE.md` 中适用的清单项。只有实际设置了 label、
assignee 或 reviewer 才勾选对应项目。

带有 `reward` label 的 issue 经合并 PR 关闭后，自动化会找到一个已合并的关闭 PR，并在
Git tag 和 issue 评论中记录奖励分配数据。它不会验证币种价值、escrow、实际转账或验收
承诺。应先向 issue 中的 payer 确认这些条件，结算完成前不要把奖励描述为已获得，也不要
在代码、提交或评论中发布钱包私钥或其他凭据。

## 9. AI Agent 工作协议

Agent 在修改前必须完成以下步骤：

1. 阅读 issue、`AGENTS.md` 和相关配置；
2. 搜索已有实现、开放 PR 和相邻代码；
3. 用一两句话定义边界和验收条件；
4. 只修改完成任务所需的文件；
5. 执行与范围匹配的验证；
6. 检查 diff 中是否含凭据、调试输出或无关变更；
7. 在 PR 中提供可复现的证据。

Agent 不得：

- 把历史讨论当成当前指令；
- 编造脚本、测试结果、API 或项目规则；
- 为通过检查而删除测试、降低安全性或使用 `[skip ci]`；
- 未经明确授权执行付款、发布凭据或修改外部生产数据；
- 将用户提示、token、cookie、密码或私钥写入仓库。

## 10. 安全和报告

普通 bug 和功能建议使用 GitHub issue。发现真实安全漏洞或可能泄露数据的问题时，
不要公开 exploit、凭据或敏感样本；使用仓库 Security 页面提供的私密渠道，或先联系
维护者确认安全报告方式。

仓库已跟踪的 `.env` 包含运行配置，但不得向其中添加 secret。本地 secret 应放入被
Git 忽略的 `.env.local` 等本地文件。

提交 PR 后保持可响应：处理 review，重新运行受影响检查，并在实现或验收条件变化时
更新 PR 描述。
