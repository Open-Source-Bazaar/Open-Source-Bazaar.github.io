import { Menu, MenuItem } from 'idea-react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, createRef, PointerEvent } from 'react';

import type { NavigatorMenuItem } from './MainNavigator';
import styles from './MainNavigator.module.css';

interface MainNavigatorMenuProps {
  id: string;
  title: NavigatorMenuItem['title'];
  desktop: boolean;
  items: NavigatorMenuItem[];
  pathname: string;
  onSelect: () => void;
}

@observer
export class MainNavigatorMenu extends Component<MainNavigatorMenuProps> {
  @observable accessor horizontalOffset = 0;

  menu = createRef<Menu>();
  closeTimer?: ReturnType<typeof setTimeout>;
  resize?: ResizeObserver;

  componentDidMount() {
    const { trigger, panel } = this.menu.current ?? {};
    if (!this.props.desktop || !trigger?.current || !panel?.current) return;

    this.resize = new ResizeObserver(this.centerMenu);
    this.resize.observe(trigger.current);
    this.resize.observe(panel.current);
  }

  componentWillUnmount() {
    this.cancelClose();
    this.resize?.disconnect();
  }

  @action
  centerMenu = () => {
    const { trigger, panel } = this.menu.current ?? {};
    if (!trigger?.current || !panel?.current || panel.current.hidden) return;

    // Shift start alignment to the center; Menu still clamps it to the viewport.
    this.horizontalOffset = (trigger.current.offsetWidth - panel.current.offsetWidth) / 2;
  };

  cancelClose = () => {
    clearTimeout(this.closeTimer);
    this.closeTimer = undefined;
  };

  handlePointerEnter = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return;

    this.cancelClose();
    this.menu.current?.setOpen(true);
  };

  handlePointerLeave = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return;

    this.cancelClose();
    // Allow diagonal movement into a menu shifted away from the viewport edge.
    this.closeTimer = setTimeout(() => {
      const menu = this.menu.current;
      if (!menu?.panel.current?.contains(document.activeElement)) menu?.setOpen(false);
    }, 200);
  };

  render() {
    const { id, title, desktop, items, pathname, onSelect } = this.props;
    const active = items.some(({ href }) => href === pathname);

    return (
      <Menu
        ref={this.menu}
        id={id}
        label={title}
        nav
        theme="dark"
        className={desktop ? undefined : 'w-100'}
        offset={desktop ? [this.horizontalOffset, 4] : undefined}
        menuClassName={desktop ? styles.menu : styles.inlineMenu}
        toggleProps={{
          className: styles.link,
          'aria-current': active ? 'true' : undefined,
        }}
        onPointerEnter={desktop ? this.handlePointerEnter : undefined}
        onPointerLeave={desktop ? this.handlePointerLeave : undefined}
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
