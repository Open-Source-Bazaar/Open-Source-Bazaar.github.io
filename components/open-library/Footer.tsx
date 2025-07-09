import React, { PropsWithChildren, useContext } from 'react';
import { Col, Nav, Row } from 'react-bootstrap';

import { I18nContext } from '../../models/Translation';

// 使用 Bootstrap 工具类替换内联样式的 ContentContainer
const ContentContainer: React.FC<PropsWithChildren> = ({ children }) => (
  <div className="container-xl px-3">{children}</div>
);

const FooterComponent = () => {
  // Use client-side rendering for the copyright text to avoid hydration issues
  const [isMounted, setIsMounted] = React.useState(false);

  const { t } = useContext(I18nContext);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <footer className="bg-dark text-light py-4">
      <ContentContainer>
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <h5 className="fw-bold mb-3">{t('open_library')}</h5>
            <p className="text-light opacity-75 lh-base">
              {t('footer_description')}
            </p>
            <div className="mt-3">
              <a
                href="#github"
                className="text-light text-decoration-none me-3 hover-opacity"
              >
                <i className="bi bi-github me-1" />
                GitHub
              </a>
              <a
                href="#twitter"
                className="text-light text-decoration-none me-3 hover-opacity"
              >
                <i className="bi bi-twitter me-1" />
                Twitter
              </a>
              <a
                href="#feishu"
                className="text-light text-decoration-none me-3 hover-opacity"
              >
                <i className="bi bi-chat-dots me-1" />
                Feishu
              </a>
            </div>
          </Col>
          <Col md={3} className="mb-3 mb-md-0">
            <h5 className="fw-bold mb-3">{t('quick_links_footer')}</h5>
            <Nav className="flex-column">
              <Nav.Link
                href="/open-library/books"
                className="text-light px-0 py-1 text-decoration-none"
              >
                <i className="bi bi-book me-2" />
                {t('catalog_footer')}
              </Nav.Link>
              <Nav.Link
                href="/open-library/how-to-borrow"
                className="text-light px-0 py-1 text-decoration-none"
              >
                <i className="bi bi-info-circle me-2" />
                {t('how_to_borrow')}
              </Nav.Link>
            </Nav>
          </Col>
          <Col md={5}>
            <h5 className="fw-bold mb-3">{t('contact')}</h5>
            <div className="text-light opacity-75">
              <p className="mb-2">
                <i className="bi bi-geo-alt me-2" />
                freeCodeCamp Chengdu Community
              </p>
              <p className="mb-2">
                <i className="bi bi-pin-map me-2" />
                Chengdu, Sichuan, China
              </p>
              <p className="mb-2">
                <i className="bi bi-envelope me-2" />
                Email: contact@openlibrary.org
              </p>
              <p className="mb-0">
                <i className="bi bi-wechat me-2" />
                WeChat: FCCChengdu
              </p>
            </div>
          </Col>
        </Row>

        <hr className="mt-4 mb-3 border-secondary opacity-25" />

        <div className="text-center text-light opacity-75 py-2">
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
