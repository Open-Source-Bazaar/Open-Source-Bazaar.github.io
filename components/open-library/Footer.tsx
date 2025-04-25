import React from 'react';
import { Col, Nav, Row } from 'react-bootstrap';

import { t } from '../../models/Translation';

//
const ContentContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  );
};

const FooterComponent = () => {
  // Use client-side rendering for the copyright text to avoid hydration issues
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <ContentContainer>
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <h5>{t('open_library')}</h5>
            <p>{t('footer_description')}</p>
            <div className="mt-2">
              <a href="#github" className="text-light me-3">
                GitHub
              </a>
              <a href="#twitter" className="text-light me-3">
                Twitter
              </a>
              <a href="#feishu" className="text-light me-3">
                Feishu
              </a>
              <a href="#instagram" className="text-light">
                Instagram
              </a>
            </div>
          </Col>
          <Col md={3} className="mb-3 mb-md-0">
            <h5>{t('quick_links_footer')}</h5>
            <Nav className="flex-column">
              <Nav.Link href="/open-library/books" className="text-light px-0">
                {t('catalog_footer')}
              </Nav.Link>
              <Nav.Link href="/open-library/donate" className="text-light px-0">
                {t('donate_footer')}
              </Nav.Link>
              <Nav.Link
                href="/open-library/how-to-borrow"
                className="text-light px-0"
              >
                {t('how_to_borrow')}
              </Nav.Link>
              <Nav.Link href="/open-library/about" className="text-light px-0">
                {t('about_us_footer')}
              </Nav.Link>
              <Nav.Link href="/open-library/faq" className="text-light px-0">
                {t('faq')}
              </Nav.Link>
            </Nav>
          </Col>
          <Col md={5}>
            <h5>{t('contact')}</h5>
            <p className="mb-1">freeCodeCamp Chengdu Community</p>
            <p className="mb-1">Chengdu, Sichuan, China</p>
            <p className="mb-1">Email: contact@openlibrary.org</p>
            <p>WeChat: FCCChengdu</p>
          </Col>
        </Row>

        <hr
          className="mt-4 mb-3"
          style={{ borderColor: 'rgba(255,255,255,0.2)' }}
        />

        {/* Use a more direct approach with inline styles to ensure visibility */}
        <div
          className="py-2"
          style={{
            textAlign: 'center',
            color: '#6c757d',
            fontSize: '0.875rem',
            width: '100%',
            display: 'block',
          }}
        >
          {isMounted ? (
            <>
              &copy; {new Date().getFullYear()} {t('open_library')}.{' '}
              {t('all_rights_reserved')}
            </>
          ) : (
            <>
              &copy; {new Date().getFullYear()} Open Library. All rights
              reserved.
            </>
          )}
        </div>
      </ContentContainer>
    </footer>
  );
};

export default FooterComponent;
