import { observer } from 'mobx-react';
import { useContext } from 'react';
import { Col, Container, Nav, Row } from 'react-bootstrap';

import { ContactEmail, GitHubURL, WeChatURL } from '../models/configuration';
import { I18nContext } from '../models/Translation';

export const Footer = observer(() => {
  const { t } = useContext(I18nContext);

  return (
    <footer className="bg-dark text-light py-4">
      <Container fluid="xl" className="px-3">
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <h5 className="fw-bold mb-3">{t('open_source_bazaar')}</h5>
            <p className="text-light opacity-75 lh-base">{t('footer_description')}</p>
            <div className="mt-3">
              <a
                href={GitHubURL}
                className="text-light text-decoration-none me-3 hover-opacity"
                target="_blank"
                rel="noopener noreferrer"
              >
                🐱 GitHub
              </a>
              <a
                href={WeChatURL}
                className="text-light text-decoration-none me-3 hover-opacity"
                target="_blank"
                rel="noopener noreferrer"
              >
                💬 WeChat
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
                📖 {t('catalog_footer')}
              </Nav.Link>
              <Nav.Link
                href="/open-library/how-to-borrow"
                className="text-light px-0 py-1 text-decoration-none"
              >
                ℹ️ {t('how_to_borrow')}
              </Nav.Link>
            </Nav>
          </Col>
          <Col md={5}>
            <h5 className="fw-bold mb-3">{t('contact')}</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 text-light opacity-75 mb-0">
              <li>📍 {t('community_name')}</li>
              <li>📌 {t('community_location')}</li>
              <li>
                ✉️{' '}
                <a className="text-light" href={`mailto:${ContactEmail}`}>
                  {ContactEmail}
                </a>
              </li>
              <li>
                💬{' '}
                <a
                  className="text-light"
                  href={WeChatURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('community_name')}
                </a>
              </li>
            </ul>
          </Col>
        </Row>

        <hr className="mt-4 mb-3 border-secondary opacity-25" />

        <div className="text-center text-light opacity-75 py-2">
          &copy; {new Date().getFullYear()} {t('open_source_bazaar')}. {t('all_rights_reserved')}
        </div>
      </Container>
    </footer>
  );
});
