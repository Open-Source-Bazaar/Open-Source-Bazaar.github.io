# Open Source Bazaar — GitHub Copilot Instructions

These instructions apply to the entire repository. Read
[`AGENTS.md`](../AGENTS.md) first and use
[`CONTRIBUTING.md`](../CONTRIBUTING.md) for the complete workflow.

## Source of truth

Before changing code, inspect the current issue, maintainer comments, relevant
source files, tests, `package.json`, `pnpm-workspace.yaml`,
`eslint.config.ts`, `tsconfig.json`, and affected workflows.

Executable configuration and the latest maintainer direction take precedence
over prose. Do not repeat commands, versions, routes, or project assumptions
from an older PR without verifying them in the current branch.

## Current repository

- Default branch: `main`
- Package manager: pnpm
- Application: Next.js 16, React 19, and strict TypeScript 5
- UI and styles: React Bootstrap, Bootstrap utilities, Less/CSS Modules
- State and clients: MobX and the existing models
- Internationalization: `translation/zh-CN.ts`,
  `translation/zh-TW.ts`, and `translation/en-US.ts`

Treat `package.json` and the lockfile as authoritative for exact versions.

## Setup

The deployment workflow uses Node.js 24. Use a compatible modern Node.js
version and either an installed pnpm command or Corepack:

```bash
node --version
corepack pnpm --version
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

If pnpm is already installed, the equivalent `pnpm` commands are valid.

Read lifecycle scripts before installation. The current `install` script
attempts an optional key-vault download and tolerates failure; never commit
downloaded vault content, credentials, tokens, or local environment files.

## Synchronize a fork

Create work from the current upstream `main`, not merely a potentially stale
fork branch:

```bash
git remote add upstream https://github.com/Open-Source-Bazaar/Open-Source-Bazaar.github.io.git
git fetch upstream
git switch main
git merge --ff-only upstream/main
git push origin main
git switch -c feat/short-description
```

If `upstream` already exists, verify its URL instead of adding it again. Use a
`docs/`, `fix/`, or `chore/` prefix when that better describes the task.

## Commands that exist

```bash
pnpm dev
pnpm build
pnpm start
pnpm exec prettier --check <changed-files>
pnpm exec eslint <changed-code-files>
pnpm exec tsc --noEmit
```

There is no `pnpm lint` script. Do not invent one.

The current `pnpm test` command runs `lint-staged`, then `git add .`, then
`tsc --noEmit`. It mutates the Git index and only formats files already staged
when `lint-staged` starts. Read `package.json`, inspect `git status` before and
afterward, and do not stage unrelated work.

## Implementation rules

- Search the current code and every open or closed PR touching the same
  function or files before implementing.
- Keep one reviewable goal per PR and avoid unrelated refactors.
- Reuse existing components, models, clients, dependencies, and nearby
  patterns.
- Follow ESLint and Prettier; the current formatting uses single quotes,
  trailing commas, a 100-character print width, and no parentheses around a
  single arrow-function parameter.
- Keep strict TypeScript compatibility. Object shapes normally use
  `interface`, and imports are managed by `simple-import-sort`.
- Use `I18nContext` / `t()` for new user-facing text and update all three
  translation files.
- Preserve semantic HTML, keyboard access, labels, and responsive behavior.
- Do not update the lockfile, reformat the repository, or add dependencies
  unless the task requires it.

The tracked `.env` contains repository runtime configuration. Do not add
secrets to it. Put local secrets in an ignored local environment file such as
`.env.local`, and never commit credentials or private user data.

## Validation and CI limits

Run checks that match the changed scope. For TypeScript or UI work, normally
run:

```bash
pnpm exec prettier --check <changed-files>
pnpm exec eslint <changed-code-files>
pnpm exec tsc --noEmit
pnpm build
```

For page changes, also run `pnpm dev` and inspect the affected routes,
responsive layout, and language switching.

The current CI/CD workflow is triggered by pushes, but checkout, Node setup,
and deployment are conditional on Vercel secrets. It does not provide a
general PR lint, type-check, or build gate for external forks. A fork workflow
may also wait for maintainer approval. Local validation evidence in the PR is
therefore required.

## Pull requests and rewards

- Check the issue state, assignees, comments, Development links, and all
  related open and closed PRs before starting.
- Fill the repository PR checklist truthfully and include Summary, Changes,
  Validation, and Scope/Risks.
- Use `Closes #<issue>` only when the PR should close that issue.
- Do not claim an external mirror task unless its claim protocol is confirmed
  for this repository.

For issues labelled `reward`, closing through a merged PR triggers automation
that finds one merged closing PR and writes reward metadata to a Git tag and
issue comment. This records allocation data; it does not verify a currency's
value, escrow funds, transfer payment, or guarantee acceptance. Confirm those
terms with the named payer, and record a reward as earned only after settlement.

## Security

Never expose tokens, cookies, passwords, private keys, key-vault data, or
production user data. Report vulnerabilities through the repository's private
Security reporting channel rather than publishing exploit details.
