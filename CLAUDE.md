# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Open Source Bazaar** (开源市集) is an open-source project showcase platform built with Next.js 15, TypeScript, React Bootstrap, and MobX. The platform serves as a comprehensive hub for open-source collaboration, featuring license filtering tools, Wiki knowledge base integration, volunteer showcases, and GitHub repository management.

### Key Features

- **License Filter Tool**: Interactive multi-step license selection process with comprehensive i18n support
- **Wiki Knowledge Base**: Integration with GitHub ContentModel to access policy documents
- **Volunteer Showcase**: GitHub organization contributor displays with OSS Insight widgets
- **Project Repository**: GitHub repository listings and management
- **Multi-language Support**: Full i18n with Chinese (Simplified/Traditional) and English
- **Lark Integration**: Enterprise collaboration platform integration
- **PWA Support**: Progressive Web App capabilities

## Repository Structure

### Important Directories

- **`pages/`** - Next.js pages and API routes
  - `index.tsx` - Homepage with animated welcome content
  - `license-filter.tsx` - Interactive license selection tool
  - `policy/` - Wiki/policy document pages
  - `volunteer.tsx` - Contributor showcase
  - `project.tsx` - GitHub repository listings
  - `api/` - API routes for external integrations

- **`components/`** - Reusable React components with Bootstrap styling
  - `Layout/` - Page layout components (PageHead, Navigation, Footer)
  - `Git/` - GitHub-related components
  - `Navigator/` - Navigation components
  - `PageContent/` - Content display components
  - `License/` - License filter components

- **`models/`** - MobX stores and data models
  - `Base.ts` - Core configuration and client setup
  - `Repository.ts` - GitHub repository data models
  - `Translation.ts` - i18n translation models
  - `Wiki.ts` - Wiki content models
  - `System.ts` - System configuration models

- **`translation/`** - i18n language files
  - `zh-CN.ts` - Simplified Chinese
  - `zh-TW.ts` - Traditional Chinese
  - `en-US.ts` - English

- **`styles/`** - CSS and styling files
- **`public/`** - Static assets and PWA manifest
- **`types/`** - TypeScript type definitions

### Configuration Files

- **`package.json`** - Dependencies and scripts
- **`next.config.ts`** - Next.js configuration with MDX, PWA, and proxy rewrites
- **`tsconfig.json`** - TypeScript configuration
- **`eslint.config.ts`** - ESLint configuration with spell checking
- **`babel.config.js`** - Babel configuration for decorators
- **`.github/copilot-instructions.md`** - Detailed development guidelines

## Technology Stack

### Core Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript 5.9** - Type-safe JavaScript
- **React 19.1** - UI library with hooks
- **React Bootstrap 2.10** - UI component library
- **MobX 6.13** - State management
- **PNPM** - Package manager

### Key Dependencies

- **MobX Ecosystem**:
  - `mobx-github` - GitHub API integration
  - `mobx-i18n` - Internationalization
  - `mobx-restful` - RESTful API client
  - `mobx-restful-table` - Data table components
  - `mobx-lark` - Lark integration
  - `mobx-react` - React bindings

- **Content Processing**:
  - `@mdx-js/react` - MDX support
  - `marked` - Markdown processing
  - `yaml` - YAML front-matter processing

- **Development Tools**:
  - `eslint` - Code linting
  - `prettier` - Code formatting
  - `husky` - Git hooks
  - `lint-staged` - Pre-commit linting

- **Utilities**:
  - `web-utility` - Web utility functions
  - `license-filter` - License filtering logic
  - `koajax` - HTTP client
  - `idea-react` - React utilities

## Development Environment

### Critical Requirements

⚠️ **MANDATORY NODE.JS VERSION**: This project requires **Node.js >=20**

- Check Node.js version: `node --version`
- Development and linting commands work on Node.js 20+
- Use **PNPM** as package manager, not NPM or Yarn

### Initial Setup

1. **Install global pnpm**: `npm install -g pnpm`
2. **Install dependencies**: `pnpm install` -- takes 1-3 minutes. NEVER CANCEL
3. **Verify setup**: `pnpm --version` (should be 10.x+)

**Important**: If you see "node_modules missing" error, you MUST run `pnpm install` first before any other commands.

### Development Workflow

```bash
# Development
pnpm dev             # Start development server (5-15s) on http://localhost:3000
pnpm build           # Production build (30s-2min)
pnpm start           # Start production server

# Code Quality
pnpm lint            # Run ESLint with auto-fix (15s)
pnpm test            # Run tests (lint-staged + lint, 15s)

# Git Hooks
pnpm prepare         # Install husky hooks
```

## Development Standards

### Architecture and Code Organization

#### Component Standards

- **ALWAYS use React Bootstrap components** instead of custom HTML elements
- Use utilities from established libraries: 'web-utility'
- Import `'./Base'` in model files for proper configuration
- Use semantic HTML structure: `<article>`, `<header>`, `<section>`

#### Import Patterns

```typescript
// ✅ Correct - use React Bootstrap components
import { Button, Badge, Breadcrumb, Card, Container } from 'react-bootstrap';

// ✅ Correct - import from established sources
import { ContentModel } from 'mobx-github';
import { githubClient } from 'mobx-github';
import { treeFrom } from 'web-utility';
import './Base';  // For GitHub client setup

// ❌ Wrong - custom HTML elements
<a href={url} className="btn btn-outline-primary">Edit</a>
<span className="badge bg-secondary">{label}</span>
```

#### Error Handling

- **Natural error throwing** for static generation - let errors bubble up to catch build issues
- Ensure build passes before pushing - resolve issues at compile time

### Translation and Internationalization

#### Critical Requirements

- **ALL user-facing text** MUST be translated using i18n system
- Use the `t()` function from I18nContext for all translations
- This includes button text, labels, error messages, placeholder text, and dynamic content

#### Translation Patterns

```typescript
// ✅ Correct - use translation function
<Button variant="outline-primary" size="sm">
  {t('edit_on_github')}
</Button>

// ❌ Wrong - hardcoded text
<Button variant="outline-primary" size="sm">
  Edit on GitHub
</Button>
```

#### Translation Key Management

- Use generic terms unless specifically scoped: `t('knowledge_base')` not `t('policy_documents')`
- Add translation keys to ALL language files: `zh-CN.ts`, `en-US.ts`, `zh-TW.ts`
- Remove unused translation keys when replacing with generic ones

### Data Modeling and GitHub Integration

#### Content Model Patterns

- Use ContentModel with configured client from mobx-github
- Import configuration via `'./Base'` to ensure proper GitHub client setup
- Handle Base64 content decoding when processing GitHub API responses

#### GitHub API Usage

```typescript
// ✅ Correct - use configured client
import { githubClient } from './models/Base';

// ❌ Wrong - create separate instances
const client = new GitHubClient();
```

#### Authentication and Rate Limiting

- GitHub API authentication is configured in `models/Base.ts`
- Use the configured client to avoid rate limiting and authentication issues
- Don't create separate GitHub API instances

### Code Quality Standards

#### Modern ECMAScript Features

- Use optional chaining and modern JavaScript features
- Let TypeScript infer types when possible to avoid verbose annotations
- Use modern ECMAScript patterns for cleaner, more maintainable code

#### Import and Type Management

- Import from established sources: ContentModel from mobx-github, utilities from web-utility
- Import configuration files where needed: `'./Base'` for GitHub client setup
- Use minimal exports and avoid unnecessary custom implementations

### Build and Development Process

#### Pre-commit Standards

1. **Run linting**: `pnpm lint` to auto-fix formatting
2. **Check build**: Ensure `pnpm build` passes
3. **Validate translations**: Verify all text is properly translated
4. **Remove unused code**: Clean up unused imports and translation keys

#### Testing Requirements

After making ANY changes, ALWAYS validate by running through these scenarios:

1. **Start development server**: `pnpm dev` and verify it starts without errors
2. **Navigate to homepage**: Visit http://localhost:3000 and verify page loads
3. **Test core pages**:
   - License filter: http://localhost:3000/license-filter
   - Wiki pages: http://localhost:3000/policy
   - Volunteer page: http://localhost:3000/volunteer
   - Projects: http://localhost:3000/project
4. **Test API endpoints**: Verify GitHub API integrations work
5. **Check responsive design**: Test mobile/desktop layouts
6. **Verify i18n functionality**: Check language switching works

## Project-Specific Patterns

### Wiki System Architecture

- Uses GitHub ContentModel to access policy documents from `fpsig/open-source-policy` repository
- Renders markdown content with front-matter metadata
- Supports hierarchical document structure with breadcrumb navigation
- Uses `treeFrom` utility from web-utility for hierarchical data structures

### License Filter Integration

- Interactive multi-step license selection process
- Uses `license-filter` package for license recommendation logic
- Supports multiple languages with comprehensive i18n coverage
- Complex state management with MobX stores

### Volunteer Management

- Displays GitHub organization contributors
- Integrates with OSS Insight widgets for contributor analytics
- Uses GitHub API for real-time contributor data
- Features contributor cards with activity metrics

### Proxy Configuration

The project includes proxy rewrites for external services:
- GitHub API and raw content
- Alibaba Geo Data services
- Lark API integration

## Common Issues and Solutions

### Build and Development Issues

- **"Unsupported engine" warnings**: Expected on Node.js <22, development still works
- **Build hangs**: Never cancel builds - they may take several minutes, set appropriate timeouts
- **Missing dependencies**: Always run `pnpm install` first

### Component and Styling Issues

- **Custom HTML not working**: Replace with React Bootstrap components
- **Translation not showing**: Ensure all text uses `t()` function and keys exist in all language files
- **GitHub API errors**: Verify you're using configured `githubClient` from `models/Base.ts`

### Data and Content Issues

- **Base64 content errors**: Use `atob(item.content)` to decode GitHub API responses
- **Missing content**: Check ContentModel configuration and repository access
- **Tree structure problems**: Use `treeFrom()` utility from web-utility

### Development Environment Setup

- Clear browser cache if components don't render properly
- Restart development server after major configuration changes
- Verify all translation files are updated when adding new keys

## Deployment and CI/CD

### Vercel Deployment

- Project is configured for Vercel deployment
- Uses GitHub Actions for CI/CD pipeline
- PWA support enabled for offline functionality

### Environment Variables

- `NODE_ENV` - Environment detection
- `CI` - Continuous integration flag
- `GithubToken` - GitHub API authentication
- `API_Host` - Backend API host
- `LARK_API_HOST` - Lark API host

## Contributing Guidelines

### Code Review Process

- **Follow exact code suggestions** from reviews when provided
- Use **minimal approach** - only include explicitly requested functionality
- **Don't add extra features** not specified in requirements
- **Address reviewer feedback completely** before requesting re-review

### Pull Request Template

```markdown
Checklist（清单）:

- [ ] Labels
- [ ] Assignees
- [ ] Reviewers

Closes #XXXXX
```

### Quality Gates

- [ ] All tests pass
- [ ] Code follows project conventions
- [ ] No linting errors
- [ ] Build succeeds
- [ ] Translations are complete
- [ ] Responsive design verified
- [ ] API integrations working

## Resources and Documentation

### Internal Resources

- **`.github/copilot-instructions.md`** - Detailed development guidelines
- **`README.md`** - Project overview and quick start
- **`package.json`** - Complete dependency list
- **Translation files** - All supported languages and keys

### External Dependencies

- [Next.js Documentation](https://nextjs.org/)
- [React Bootstrap Documentation](https://react-bootstrap.github.io/)
- [MobX Documentation](https://mobx.js.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [PNPM Documentation](https://pnpm.io/)

### Key Repository Links

- [Upstream Project](https://github.com/idea2app/Lark-Next-Bootstrap-ts)
- [GitHub Actions CI/CD](https://github.com/Open-Source-Bazaar/Open-Source-Bazaar.github.io/actions)
- [Live Demo](https://bazaar.fcc-cd.dev/)

## Contact and Support

For project-specific questions, refer to the existing documentation and GitHub issues. For development guidance, follow the patterns and conventions established in the codebase and the detailed copilot instructions.