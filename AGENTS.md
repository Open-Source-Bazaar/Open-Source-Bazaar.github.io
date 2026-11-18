# AGENTS.md — Open Source Bazaar Agent Quick Reference

> 配套 [CONTRIBUTING.md](./CONTRIBUTING.md) § 7。本文件是给 AI Agent 的**精简指令卡**——可被 `read` 工具一次性加载。

## 项目一句话

Next.js v16 + TypeScript v5 + Bootstrap v5 多模块站点（开源市集官网），承载 `/finance` 等公益开源子项目。

## 命令速查

```bash
pnpm install         # 装依赖（必须 pnpm）
pnpm dev             # 本地起 http://localhost:3000
pnpm lint            # ESLint
pnpm build           # Next.js build
```

## 文件结构

```
components/    # 可复用 React 组件（PascalCase.tsx）
constants/     # 全局常量（SCREAMING_SNAKE_CASE）
lib/           # 工具函数 / Hooks（camelCase.ts）
models/        # 数据模型 / 类型定义
pages/         # Next.js 路由（kebab-case.ts/tsx）
public/        # 静态资源
styles/        # CSS Module + 全局样式
translation/   # i18n 文案（禁止硬编码）
types/         # 全局 TypeScript 类型
```

## 修改优先级

1. **i18n 必走** `translation/` —— 任何用户可见字符串必须走 t(key)
2. **不破坏 `master`** —— PR 必须从 feat/fix 分支提
3. **类型严格** —— 禁 `any`，导出去必须显式 `export`
4. **CI 必过** —— lint + build 全绿才允许 merge

## 任务接单 SOP（接 bounties 适用）

1. 扫镜像：Vikingr2023/awesome-agent-bounties open issues
2. 评估能力：跳过 mobile/unity/bluetooth 类
3. `/claim #<n>` 在 issue 下评论
4. fork → branch → 改 → lint/build → push → 提 PR → comment 链接
5. 48h 内交付；超时 `/unclaim`

## 禁止

- ❌ 任何凭据写入代码
- ❌ 修改非关联文件
- ❌ `[skip ci]` 未经批准
- ❌ 直接 push master

## 资源链接

- 上游：[idea2app/Lark-Next-Bootstrap-ts](https://github.com/idea2app/Lark-Next-Bootstrap-ts)
- CI：[GitHub Actions](https://github.com/Open-Source-Bazaar/Open-Source-Bazaar.github.io/actions)
- 部署：[Vercel](https://vercel.com)
- 镜像仓库：[Vikingr2023/awesome-agent-bounties](https://github.com/Vikingr2023/awesome-agent-bounties)

---

由 **laomao-31day001**（31day.cloud agent）· 2026-07-13 贡献。