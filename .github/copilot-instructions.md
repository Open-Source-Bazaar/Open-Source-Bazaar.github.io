# Open Source Bazaar - GitHub Copilot Instructions

Open Source Bazaar is an open-source project showcase platform built with Next.js 15, TypeScript, React Bootstrap, and MobX. It includes license filters, Wiki knowledge base, volunteer showcase, Lark integration, and other features.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Critical Requirements

⚠️ **MANDATORY NODE.JS VERSION**: This project requires **Node.js >=20**. The build works on Node.js 20+ but may have warnings.

- Check Node.js version: `node --version`
- Development and linting commands work on Node.js 20+
- Use **PNPM** as package manager, not NPM or Yarn

## Working Effectively

### Initial Setup (REQUIRED for all development)

1. **Install global pnpm**: `npm install -g pnpm`
2. **Install dependencies**: `pnpm install` -- takes 1-3 minutes. NEVER CANCEL. Set timeout to 5+ minutes.
3. **Verify setup**: `pnpm --version` (should be 10.x+)

**Important**: If you see "node_modules missing" error, you MUST run `pnpm install` first before any other commands.

### Development Workflow (FULLY VALIDATED)

- **Start development server**: `pnpm dev` -- starts in 5-15 seconds on http://localhost:3000
- **Run linting**: `pnpm lint` -- takes 15 seconds. NEVER CANCEL. Set timeout to 2+ minutes.
- **Run tests**: `pnpm test` -- runs lint-staged + lint, takes 15 seconds. Set timeout to 2+ minutes.

### Build Process

- **Production build**: `pnpm build` -- works on Node.js 20+ (estimated 30s-2 minutes)
  - NEVER CANCEL. Set timeout to 5+ minutes.
- **Static export**: Available but not commonly used in development

## Validation Scenarios

After making ANY changes, ALWAYS validate by running through these scenarios:

### Manual Testing Requirements

1. **Start development server**: `pnpm dev` and verify it starts without errors
2. **Navigate to homepage**: Visit http://localhost:3000 and verify page loads with navigation menu
3. **Test core pages**:
   - License filter: http://localhost:3000/license-filter (interactive license selection tool)
   - Wiki pages: http://localhost:3000/wiki (policy documents from GitHub)
   - Volunteer page: http://localhost:3000/volunteer (contributor showcase)
   - Projects: http://localhost:3000/project (GitHub repository listings)
4. **Test API endpoints**: Verify GitHub API integrations work
5. **Check responsive design**: Test mobile/desktop layouts with React Bootstrap components
6. **Verify i18n functionality**: Check Chinese/English language switching works

### Pre-commit Validation

ALWAYS run before committing changes:

```bash
npm test     # Runs linting + staged file checks
```

## Key Project Structure

### Important Directories

- `pages/` - Next.js pages and API routes
- `components/` - Reusable React components with Bootstrap styling
- `models/` - MobX stores and data models
- `translation/` - i18n language files (zh-CN, en-US, zh-TW)
- `styles/` - CSS and styling files
- `public/` - Static assets

### Configuration Files

- `package.json` - Dependencies and scripts
- `next.config.ts` - Next.js configuration with MDX support
- `tsconfig.json` - TypeScript configuration
- `eslint.config.ts` - ESLint configuration
- `babel.config.js` - Babel configuration

### Key Dependencies

- **Next.js 15** - React framework
- **React Bootstrap 2.10** - UI component library
- **MobX 6.13** - State management
- **MobX-GitHub 0.4** - GitHub API integration
- **MobX-i18n 0.7** - Internationalization
- **License-Filter 0.2** - License filtering functionality
- **Marked 16.2** - Markdown processing

## Development Standards and Best Practices

Based on comprehensive PR review analysis, follow these critical development standards:

### Architecture and Code Organization

#### Component and Import Standards

- **ALWAYS use React Bootstrap components** instead of custom HTML elements
- Use utilities from established libraries: 'web-utility'
- Import `'./Base'` in model files for proper configuration

### UI/UX Standards

#### Component Usage Patterns

```typescript
// ✅ Correct - use React Bootstrap components
import { Button, Badge, Breadcrumb, Card, Container } from 'react-bootstrap';

<Button variant="outline-primary" size="sm" href={url} target="_blank">
  {t('edit_on_github')}
</Button>

<Badge bg="secondary">{label}</Badge>

// ❌ Wrong - custom HTML elements
<a href={url} className="btn btn-outline-primary">Edit</a>
<span className="badge bg-secondary">{label}</span>
```

#### Semantic HTML Structure

- Use ordered lists (`<ol>`) for countable items, unordered lists (`<ul>`) for navigation
- Apply proper semantic structure: `<article>`, `<header>`, `<section>`
- Use `list-unstyled` class for first-level lists to remove default styling

### Code Quality Standards

#### Modern ECMAScript Features

```typescript
// ✅ Correct - use optional chaining
node.parent_path?.split('/')
node.children?.length > 0

// ✅ Correct - let TypeScript infer types when possible
const renderTree = (nodes: WikiNode[], level = 0) => (
  // No need for explicit return type annotation
)

// ❌ Wrong - verbose type annotations where inference works
const renderTree = (nodes: WikiNode[], level = 0): React.ReactElement => (
```

#### Import and Type Management

```typescript
// ✅ Correct - import from established sources
import { ContentModel } from 'mobx-github';
import { treeFrom } from 'web-utility';
import './Base'; // For configuration

// ✅ Correct - minimal exports
export const policyContentStore = new ContentModel('fpsig', 'open-source-policy');

// ❌ Wrong - unnecessary custom implementations
// Don't create new GitHub API clients when configured ones exist
```

### Translation and Internationalization

#### Critical Translation Requirements

- **ALL user-facing text** MUST be translated using i18n system
- This includes button text, labels, error messages, placeholder text, and dynamic content
- Use the `t()` function from I18nContext for all translations

#### Translation Patterns

```typescript
// ✅ Correct - all text translated
const { t } = useContext(I18nContext);

<p>{t('no_docs_available')}</p>
<Button>{t('contribute_content')}</Button>
alert(t('operation_successful'));

// ❌ Wrong - hardcoded text
<p>暂无政策文档</p>
<Button>贡献内容</Button>
alert('操作成功');
```

#### Translation Key Management

- Use generic terms unless specifically scoped: `t('knowledge_base')` not `t('policy_documents')`
- Add translation keys to ALL language files: `zh-CN.ts`, `en-US.ts`, `zh-TW.ts`
- Remove unused translation keys when replacing with generic ones

### Data Modeling and Content Management

#### Content Model Patterns

```typescript
// ✅ Correct - use ContentModel with configured client
import { ContentModel } from 'mobx-github';
import './Base'; // Ensures githubClient configuration

export const policyContentStore = new ContentModel('fpsig', 'open-source-policy');

// Content processing with proper Base64 decoding
const content = item.content ? atob(item.content) : '';
```

#### Tree Structure and Navigation

```typescript
// ✅ Correct - use treeFrom utility for hierarchical data
import { treeFrom } from 'web-utility';

const tree = treeFrom(nodes, 'path', 'parent_path', 'children');
```

### GitHub Integration Standards

#### API Usage Patterns

- Import configured `githubClient` from `models/Base.ts`

#### Authentication and Rate Limiting

- GitHub API authentication is configured in `models/Base.ts`
- Use the configured client to avoid rate limiting and authentication issues
- Don't create separate GitHub API instances

### Build and Development Process

#### Pre-commit Standards

1. **Run linting**: `pnpm lint` to auto-fix formatting
2. **Check build**: Ensure `pnpm build` passes
3. **Validate translations**: Verify all text is properly translated
4. **Remove unused code**: Clean up unused imports and translation keys

#### Code Review Compliance

- **Follow exact code suggestions** from reviews when provided
- Use **minimal approach** - only include explicitly requested functionality
- **Don't add extra features** not specified in requirements
- **Address reviewer feedback completely** before requesting re-review

## Common Commands Reference

### Package Management

```bash
pnpm install          # Install dependencies (1-3 minutes)
pnpm --version        # Check pnpm version
```

### Development

```bash
pnpm dev             # Start development server (5-15s)
pnpm build           # Production build (30s-2min)
pnpm start           # Start production server
```

### Code Quality

```bash
pnpm lint            # Run ESLint with auto-fix (15s)
pnpm test            # Run tests (lint-staged + lint, 15s)
```

## Troubleshooting

### Common Issues and Solutions

#### Build and Development Issues

- **"Unsupported engine" warnings**: Expected on Node.js <22, development still works
- **Build hangs**: Never cancel builds - they may take several minutes, set appropriate timeouts
- **Missing dependencies**: Always run `pnpm install` first

#### Component and Styling Issues

- **Custom HTML not working**: Replace with React Bootstrap components
- **Translation not showing**: Ensure all text uses `t()` function and keys exist in all language files
- **GitHub API errors**: Verify you're using configured `githubClient` from `models/Base.ts`

#### Data and Content Issues

- **Base64 content errors**: Use `atob(item.content)` to decode GitHub API responses
- **Missing content**: Check ContentModel configuration and repository access
- **Tree structure problems**: Use `treeFrom()` utility from web-utility

### Development Environment Setup

- Clear browser cache if components don't render properly
- Restart development server after major configuration changes
- Verify all translation files are updated when adding new keys

## Project-Specific Patterns

### Wiki System Architecture

- Uses GitHub ContentModel to access policy documents from `fpsig/open-source-policy` repository
- Renders markdown content with front-matter metadata
- Supports hierarchical document structure with breadcrumb navigation

### License Filter Integration

- Interactive multi-step license selection process
- Uses `license-filter` package for license recommendation logic
- Supports multiple languages with comprehensive i18n coverage

### Volunteer Management

- Displays GitHub organization contributors
- Integrates with OSS Insight widgets for contributor analytics
- Uses GitHub API for real-time contributor data

Always prioritize these project-specific standards over generic Next.js or React guidance when working in this specific codebase.
