import { Drawer, DrawerProps } from 'idea-react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component } from 'react';

type MainNavigatorDrawerProps = Pick<
  DrawerProps,
  'id' | 'title' | 'open' | 'onDismiss' | 'children'
>;

@observer
export class MainNavigatorDrawer extends Component<MainNavigatorDrawerProps> {
  @observable accessor desktop = false;

  media?: MediaQueryList;

  componentDidMount() {
    this.media = window.matchMedia('(min-width: 1024px)');
    this.media.addEventListener('change', this.updateLayout);
    this.updateLayout();
  }

  componentWillUnmount() {
    this.media?.removeEventListener('change', this.updateLayout);
  }

  @action
  updateLayout = () => (this.desktop = this.media?.matches ?? false);

  render() {
    const { id, children, ...props } = this.props;

    // A permanent desktop navigation must not run native dialog autofocus.
    if (this.desktop)
      return (
        <div id={id} className="w-100 d-flex align-items-center">
          {children}
        </div>
      );

    return (
      <Drawer
        {...props}
        id={id}
        className="w-100"
        bodyClassName="d-flex flex-column"
        placement="end"
      >
        {children}
      </Drawer>
    );
  }
}
