import { observer } from 'mobx-react';
import { useContext } from 'react';
import { Nav, Navbar } from 'react-bootstrap';

import { I18nContext } from '../../models/Translation';
import LanguageMenu from '../Navigator/LanguageMenu';

export const LibraryNavbar = observer(() => {
  const { t } = useContext(I18nContext);

  return (
    <Navbar bg="light" expand="lg" sticky="top" className="shadow-sm">
      <div className="container-xl px-3 d-flex flex-wrap align-items-center justify-content-between w-100">
        <Navbar.Brand href="/open-library" className="d-flex align-items-center">
          {t('open_library')}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* <Nav.Link href="/open-library">{t('home')}</Nav.Link> */}
            <Nav.Link href="/open-library/books">{t('catalog')}</Nav.Link>
            <Nav.Link href="/open-library/how-to-borrow">{t('how_to_borrow')}</Nav.Link>
          </Nav>

          <LanguageMenu />
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
});
