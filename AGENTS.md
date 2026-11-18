# Open Source Bazaar 编程规范

本文档适用于本仓库的代码、测试和文档变更。修改前先理解现有实现与调用关系，遵循仓库已有模式；只实现明确要求的内容，不擅自扩展功能或修复无关问题。

## 项目与依赖

- 本项目使用 Next.js、TypeScript、React、Idea React 和 MobX。优先复用现有依赖、组件、模型和工具，不重复实现已有能力。
- Node.js 版本要求为 22 或更高；依赖管理和开发命令遵循仓库当前使用的 PNPM 与锁文件，不要擅自固定未经仓库约定的包管理器版本。
- 共用脚本、Git hooks 和 CI 命令应保持跨环境兼容，不依赖开发者机器上的绝对路径或特定本机安装方式。

## TypeScript、数据与集成

- 保留类型安全：明确数据结构和字段类型；动态加载组件时提供正确的 props 类型。能由 TypeScript 推断时不添加冗余类型声明。
- 复用重复表达式、网址和列表数据：适合时提取常量，并由数组迭代生成结构重复的内容。
- 使用项目既有的模型和工具：GitHub 集成使用 `models/Base.ts` 中配置的客户端；模型按需导入 `'./Base'` 完成配置。使用 `ContentModel`、`treeFrom()` 等现有能力，而不是另造实现。
- 保持错误可见。不要吞掉异常、静默返回成功形状的默认值，或以无效输入掩盖问题；静态生成期间让错误自然抛出，以便构建及时暴露问题。

## 文案与国际化

- 所有用户可见文案（包括标题、按钮、标签、统计项、提示和动态文本）都必须通过现有 i18n 机制获取，不要硬编码在组件中。
- 新增翻译键时，更新 `translation/` 中所有受支持语言文件（`zh-TW.ts`、`zh-CN.ts`、`en-US.ts`）；移除或替换文案时，清理不再使用的键。
- 翻译键优先使用通用概念；只有确有范围区分时才使用具体限定词。

## 组件风格

1. 组件应保持单一职责并可复用，不与具体页面或路由耦合；页面布局和路由分支由应用层处理。
2. Bootstrap UI 优先使用 Idea React 组件，避免用自定义 HTML 和 `className` 重造已有组件。
3. 选择合适的语义元素（如 `<article>`、`<header>`、`<section>`），有序步骤使用 `<ol>`、无序列表使用 `<ul>`，并避免不必要的标签和过深的 JSX 嵌套。
4. 页面或组件的局部样式使用 CSS modules 并就近维护，避免重置或污染全局样式。

### 只依赖 Props 的组件

仅负责展示 props 的组件使用函数组件，不在其中加入内部状态、业务逻辑或生命周期行为。让组件只呈现输入数据，保持调用方式清晰、易复用。

除 i18n 等上下文注入以外，尽最大可能不用 React hooks API。

```tsx
import { FC } from 'react';

export interface MyComponentProps {
  message: string;
}

export const MyComponent: FC<MyComponentProps> = ({ message }) => <div>{message}</div>;

MyComponent.displayName = 'MyComponent';
```

### 依赖 State 的组件

当组件确实需要内部状态、自定义行为或生命周期逻辑时，使用项目现有的 MobX 类组件模式，并以 `@observer` 响应状态变化。优先采用 ECMAScript 装饰器（stage 3 版，如 `@observable accessor`、`@computed`、`@action`），不要使用旧式装饰器或手动 `makeObservable` / `makeAutoObservable`。

```tsx
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component } from 'react';

@observer
export class MyComponent extends Component {
  static displayName = 'MyComponent';

  @observable
  accessor count = 0;

  @action
  increment = () => {
    this.count++;
  };

  render() {
    return <button onClick={this.increment}>{this.count}</button>;
  }
}
```

### 依赖 Store 的组件

复杂状态、业务逻辑、异步流程和订阅应放在职责明确的 MobX model 中；组件专注于展示、必要的生命周期接线，并将用户交互转发给 model，避免把业务行为堆积在组件里。

```tsx
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component } from 'react';

export class MyModel {
  @observable
  accessor count = 0;

  @action
  increment() {
    this.count++;
  }
}

@observer
export class MyComponent extends Component {
  static displayName = 'MyComponent';

  store = new MyModel();

  handleIncrement = () => this.store.increment();

  render() {
    const { count } = this.store;

    return <button onClick={this.handleIncrement}>{count}</button>;
  }
}
```

### 依赖事件委托、监听数据变更的组件

需要委托 DOM 事件或响应 props 变化时，使用 `ObservedComponent`、`@reaction` 等现有机制。组件负责生命周期接线和交互转发，复杂状态与业务流程仍由 model 管理；事件处理保持聚焦，避免形成难以阅读的 JSX 分支。

```tsx
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent, reaction } from 'mobx-react-helper';
import { MouseEvent } from 'react';
import { Button, Table } from 'idea-react';

export interface ChoiceTableProps {
  resetKey: string;
  onSelect?: (value: string) => unknown;
}

@observer
export class ChoiceTable extends ObservedComponent<ChoiceTableProps> {
  static displayName = 'ChoiceTable';

  @observable
  accessor selected = '';

  @reaction(({ observedProps: { resetKey } }) => resetKey)
  @action
  resetSelection() {
    this.selected = '';
  }

  @action
  select = (value: string) => {
    this.selected = value;
  };

  handleClick = ({ target, currentTarget }: MouseEvent<HTMLTableElement>) => {
    if (!(target instanceof Element)) return;

    const button = target.closest<HTMLButtonElement>('button[data-choice]');
    const { choice } = button?.dataset || {};
    if (!choice) return;

    this.props.onSelect?.(choice);

    this.select(choice);
  };

  renderChoice = (value: string) => (
    <tr key={value}>
      <td>
        <Button data-choice={value} active={this.selected === value}>
          {value}
        </Button>
      </td>
    </tr>
  );

  render() {
    return (
      <Table onClick={this.handleClick}>
        <caption>Choose an item</caption>
        <tbody>{['One', 'Two', 'Three', 'Four'].map(this.renderChoice)}</tbody>
      </Table>
    );
  }
}
```

### 复杂组件架构

参考 https://idea-react.pages.dev/guides/approach/#complex-component-architecture 。

## 测试与验证

- 变更后运行覆盖该改动的仓库脚本。当前 `pnpm test` 执行 Lint-Staged 与 TypeScript 检查，`pnpm build` 用于验证生产构建；无需为文档专门运行构建，除非文档测试要求。
- 提交前检查构建和类型错误，清理变更引入的未使用代码；不要把无关格式化或改动混入任务。
- 如遇因环境变量缺失导致的构建或测试失败，可以先用 `--no-verify` 参数或 `HUSKY=0` 环境变量临时禁用 Git hook，确保代码能顺利提交、推送，以便项目维护者先做 code review。
