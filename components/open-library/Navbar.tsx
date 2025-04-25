import dynamic from 'next/dynamic';
import React from 'react';
import { Button, Form, FormControl, Nav, Navbar } from 'react-bootstrap';

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
    <Navbar bg="light" expand="lg" sticky="top" className="mb-4 shadow-sm">
      {/* 使用自定义的居中容器替代 Container fluid，与页面内容保持一致的宽度和居中效果 */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          width: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
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
            <Nav.Link href="/open-library">{t('home')}</Nav.Link>
            <Nav.Link href="/open-library/books">{t('catalog')}</Nav.Link>
            <Nav.Link href="/open-library/about">{t('about')}</Nav.Link>
            <Nav.Link href="/open-library/donate">{t('donate')}</Nav.Link>
            <Nav.Link href="/open-library/how-to-borrow">
              {t('how_to_borrow')}
            </Nav.Link>
            <Nav.Link href="/open-library/review">{t('review')}</Nav.Link>
          </Nav>
          {/* 添加语言切换菜单 */}
          <LanguageMenu />
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default LibraryNavbar;
