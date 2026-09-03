# 贡献指南 / Contributing Guide

感谢你对开源市集（Open Source Bazaar）的关注！本文档说明如何参与项目贡献。

---

## 快速开始 / Quick Start

### 环境要求 / Requirements

- **Node.js >= 20**（必须，构建在 20+ 上验证）
- **pnpm**（包管理器，不要用 npm/yarn）
- Git

### 安装依赖

```bash
pnpm install
```

> 首次安装需要 1–3 分钟，请勿中断。

### 本地开发

```bash
pnpm dev
```

启动后访问 http://localhost:3000。

---

## 代码规范 / Code Standards

### 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router + webpack) |
| 语言 | TypeScript ~6.0 |
| UI | React Bootstrap 2.10 |
| 状态管理 | MobX 6 |
| 国际化 | mobx-i18n |
| 样式 | LESS + CSS Modules |
| 格式化 | Prettier + ESLint |
| Git Hooks | Husky + lint-staged |

### 编码规范

1. **使用 React Bootstrap 组件**，不要用原生 HTML 元素加 className：

   ```tsx
   // ✅ 正确
   import { Button, Badge } from 'react-bootstrap';
   <Button variant="outline-primary">点击</Button>
   <Badge bg="secondary">标签</Badge>

   // ❌ 错误
   <a className="btn btn-outline-primary">点击</a>
   ```

2. **所有用户可见文本必须走 i18n**，禁止硬编码：

   ```tsx
   import { useI18n } from 'mobx-i18n';
   const { t } = useI18n();
   <span>{t('some_key')}</span>
   ```

   新增翻译 key 时，同步更新 `translation/zh-CN.ts`、`translation/en-US.ts`、`translation/zh-TW.ts`。

3. **组件文件命名**：`ComponentName.tsx`（PascalCase），样式文件 `ComponentName.module.less`。

4. **分页路由**遵循 Next.js App Router 约定：`pages/finance/index.tsx`、`pages/project/[id]/index.tsx`。

5. **Prettier 配置**：单引号、trailingComma all、printWidth 100、tabWidth 4、avoid arrow parens。

---

## 提 PR 流程 / PR Workflow

### 1. Fork & 创建分支

```bash
git checkout -b feat/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

### 2. 开发 & 自测

```bash
# 启动开发服务器
pnpm dev

# 确保构建通过
pnpm build

# 运行类型检查和 lint
pnpm test
```

### 3. 提交规范

Commit message 遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

```
feat: add finance page filter
fix: resolve i18n key missing in zh-TW
docs: update contributing guide
chore: bump next to 16.3.0
```

### 4. 创建 Pull Request

填写 PR 描述，包含：

- **变更内容**（改了什么、为什么改）
- **测试方法**（如何验证）
- **关联 Issue**（如 `Closes #123`）

PR 模板已预置，请在 Checklist 中勾选：

- [ ] Labels 已添加
- [ ] Assignees 已指定
- [ ] Reviewers 已请求

### 5. CI 检查

PR 触发后会自动运行：

- `main.yml`：TypeScript 类型检查 + lint
- `self-scan.yml`：安全扫描

请确保所有检查通过后再请求 review。

---

##  Issue 类型

- **Bug**：描述复现步骤、预期行为、实际行为
- **Feature**：说明需求背景、目标用户、验收标准
- **Reward Task**：使用 [Reward Task 模板](.github/ISSUE_TEMPLATE/reward-task.yml) 创建，需标注赏金金额和货币

---

## 翻译贡献

1. 在对应语言的 `translation/xx-XX.ts` 文件中添加 key
2. 确保所有语言文件中的 key 集合一致（移除废弃 key）
3. 使用通用术语，如 `t('knowledge_base')` 而非 `t('policy_documents')`

---

## 赏金任务 / Bounty Tasks

项目设有赏金任务，参与方式：

1. 在目标 Issue 下评论 `I claim this bounty`（或中文「我来处理」）
2. Maintainer 确认后开始工作
3. 提交 PR 并关联 Issue（`Closes #XXX`）
4. PR 合并后赏金自动发放

> 详见各 Issue 中的认领说明。

---

## 行为准则 / Code of Conduct

请遵守项目 [Code of Conduct](pages/about/code-of-conduct.mdx)，尊重每一位贡献者。

---

## 常见问题 / FAQ

**Q: 可以用 npm/yarn 代替 pnpm 吗？**  
A: 不建议。项目配置了 pnpm workspace，混用可能导致依赖解析异常。

**Q: 本地开发时 build 报错怎么办？**  
A: 先确认 Node.js 版本 >= 20，再运行 `pnpm install` 重装依赖。

**Q: 如何测试移动端布局？**  
A: 在浏览器 DevTools 中切换设备模拟器，或访问 Vercel 预览链接。

---

感谢你的贡献！🎉
