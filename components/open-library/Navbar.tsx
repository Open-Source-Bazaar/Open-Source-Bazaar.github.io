import {
  Container,
  Drawer,
  Navbar,
  NavbarBrand,
  NavbarNav,
  NavbarToggler,
  NavLink,
} from 'idea-react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component } from 'react';

import { i18n, I18nContext } from '../../models/Translation';
import LanguageMenu from '../Navigator/LanguageMenu';

@observer
export class LibraryNavbar extends Component<{}, typeof i18n> {
  static contextType = I18nContext;

  declare context: typeof i18n;

  @observable accessor open = false;

  toggle = action(() => (this.open = !this.open));

  hide = action(() => (this.open = false));

  render() {
    const { t } = this.context;

    return (
      <Navbar theme="light" expand="lg" className="shadow-sm sticky-top">
        <Container
          breakpoint="xl"
          className="px-5 d-flex align-items-center justify-content-between"
        >
          <NavbarBrand href="/open-library" className="d-flex align-items-center">
            {t('open_library')}
          </NavbarBrand>
          <NavbarToggler
            expanded={this.open}
            aria-label={t('open_library')}
            onClick={this.toggle}
          />
          <Drawer
            className="w-100"
            bodyClassName="d-flex flex-column lg:flex-row lg:align-items-center"
            title={t('open_library')}
            responsive="lg"
            placement="end"
            open={this.open}
            onDismiss={this.hide}
          >
            <NavbarNav className="me-auto flex-fill lg:flex-row lg:gap-5">
              <NavLink href="/open-library/books" onClick={this.hide}>
                {t('catalog')}
              </NavLink>
              <NavLink href="/open-library/how-to-borrow" onClick={this.hide}>
                {t('how_to_borrow')}
              </NavLink>
            </NavbarNav>

            <LanguageMenu />
          </Drawer>
        </Container>
      </Navbar>
    );
  }
}
