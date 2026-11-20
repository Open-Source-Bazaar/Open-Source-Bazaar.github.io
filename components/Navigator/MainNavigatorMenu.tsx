import { Menu, MenuItem } from 'idea-react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, createRef, PointerEvent } from 'react';

import type { NavigatorMenuItem } from './MainNavigator';
import styles from './MainNavigator.module.css';

interface MainNavigatorMenuProps {
  id: string;
  title: NavigatorMenuItem['title'];
  items: NavigatorMenuItem[];
  pathname: string;
  onSelect: () => void;
}

// Deliberate UX customization: upstream menus open on click rather than hover.
const canHover = ({ pointerType }: PointerEvent<HTMLElement>) =>
  pointerType === 'mouse' &&
  window.matchMedia('(min-width: 1024px) and (any-hover: hover) and (any-pointer: fine)').matches;

@observer
export class MainNavigatorMenu extends Component<MainNavigatorMenuProps> {
  @observable accessor horizontalOffset = 0;
  @observable accessor viewportPadding = 8;

  menu = createRef<Menu>();
  closeTimer?: ReturnType<typeof setTimeout>;
  resize?: ResizeObserver;

  componentDidMount() {
    const { trigger, panel } = this.menu.current ?? {};
    if (!trigger?.current || !panel?.current) return;

    this.resize = new ResizeObserver(this.centerMenu);
    this.resize.observe(trigger.current);
    this.resize.observe(panel.current);
    window.addEventListener('resize', this.centerMenu);
  }

  componentWillUnmount() {
    this.cancelClose();
    this.resize?.disconnect();
    window.removeEventListener('resize', this.centerMenu);
  }

  @action
  centerMenu = () => {
    const { trigger, panel } = this.menu.current ?? {};
    if (!trigger?.current || !panel?.current || panel.current.hidden) return;

    // Shift start alignment to the center; Menu still clamps it to the viewport.
    this.horizontalOffset = (trigger.current.offsetWidth - panel.current.offsetWidth) / 2;

    // A mobile modal drawer clips content inside its inset viewport edges.
    const drawer = panel.current.closest('dialog:modal')?.getBoundingClientRect();
    this.viewportPadding = drawer
      ? Math.max(8, Math.ceil(drawer.left) + 8, Math.ceil(window.innerWidth - drawer.right) + 8)
      : 8;
  };

  cancelClose = () => {
    clearTimeout(this.closeTimer);
    this.closeTimer = undefined;
  };

  handlePointerEnter = (event: PointerEvent<HTMLElement>) => {
    this.cancelClose();
    if (canHover(event)) this.menu.current?.setOpen(true);
  };

  handlePointerLeave = (event: PointerEvent<HTMLElement>) => {
    if (!canHover(event)) return;

    this.cancelClose();
    // Allow diagonal movement into a menu shifted away from the viewport edge.
    this.closeTimer = setTimeout(() => this.menu.current?.setOpen(false), 200);
  };

  render() {
    const { id, title, items, pathname, onSelect } = this.props;
    const active = items.some(({ href }) => href === pathname);

    return (
      <Menu
        ref={this.menu}
        id={id}
        label={title}
        nav
        theme="dark"
        align="start"
        placement="bottom-start"
        offset={[this.horizontalOffset, 4]}
        padding={this.viewportPadding}
        flip
        menuClassName={styles.menu}
        toggleProps={{
          className: styles.link,
          'aria-current': active ? 'true' : undefined,
        }}
        onPointerEnter={this.handlePointerEnter}
        onPointerLeave={this.handlePointerLeave}
        onOpenChange={this.cancelClose}
      >
        {items.map(
          ({ href, title }) =>
            href && (
              <MenuItem
                key={href}
                href={href}
                active={pathname === href}
                className={styles.menuItem}
                onClick={onSelect}
              >
                {title}
              </MenuItem>
            ),
        )}
      </Menu>
    );
  }
}
