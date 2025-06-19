import dynamic from 'next/dynamic';
import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';

import { t } from '../../models/Translation';

// 动态导入 LanguageMenu 组件，禁用 SSR
const LanguageMenu = dynamic(() => import('../Navigator/LanguageMenu'), {
  ssr: false,
});

const LibraryNavbar = () => {
  // Use a client-side only rendering approach for the brand text to avoid hydration mismatch
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Navbar bg="light" expand="lg" sticky="top" className="shadow-sm">
      <div className="container-xl px-3 d-flex flex-wrap align-items-center justify-content-between w-100">
        <Navbar.Brand
          href="/open-library"
          className="d-flex align-items-center"
        >
          {/* Use a static placeholder during SSR and replace it with translated content after hydration */}
          {isMounted ? t('open_library') : 'Open Library'}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* <Nav.Link href="/open-library">{t('home')}</Nav.Link> */}
            <Nav.Link href="/open-library/books">{t('catalog')}</Nav.Link>
            <Nav.Link href="/open-library/how-to-borrow">
              {t('how_to_borrow')}
            </Nav.Link>
          </Nav>

          <LanguageMenu />
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default LibraryNavbar;
