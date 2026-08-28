import { observer } from 'mobx-react';
import Link from 'next/link';
import { FC, useContext } from 'react';
import { Col, Container, Nav, Row } from 'react-bootstrap';

import { ContactEmail, GitHubURL, WeChatURL } from '../models/configuration';
import { I18nContext } from '../models/Translation';

export type FooterLink = Record<'href' | 'icon' | 'label', string>;

export interface FooterProps {
  description: string;
  quickLinks: FooterLink[];
}

const CopyrightStartYear = 2021;

export const Footer: FC<FooterProps> = observer(({ description, quickLinks }) => {
  const { t } = useContext(I18nContext);
  const currentYear = new Date().getFullYear();
  const copyrightYear =
    CopyrightStartYear === currentYear ? currentYear : `${CopyrightStartYear}-${currentYear}`;

  return (
    <footer className="bg-dark text-light">
      <Container fluid="xl" className="px-4 px-md-3 py-lg-4">
        <Row>
          <Col as="section" xs={12} lg={4} className="py-4 py-lg-0">
            <h5 className="fw-bold mb-3">{t('open_source_bazaar')}</h5>
            <p className="text-light opacity-75 lh-base mb-0">{description}</p>
            <div className="d-flex flex-wrap gap-2 column-gap-3 mt-3">
              <a
                href={GitHubURL}
                className="d-inline-flex align-items-center py-2 py-lg-0 text-light text-decoration-none hover-opacity"
                target="_blank"
                rel="noopener noreferrer"
              >
                🐱 GitHub
              </a>
              <a
                href={WeChatURL}
                className="d-inline-flex align-items-center py-2 py-lg-0 text-light text-decoration-none hover-opacity"
                target="_blank"
                rel="noopener noreferrer"
              >
                💬 WeChat
              </a>
            </div>
          </Col>

          <Col xs={12} className="d-lg-none">
            <hr className="m-0 border-secondary opacity-25" />
          </Col>

          <Col
            as="section"
            xs={12}
            md
            lg={4}
            className="d-md-grid align-content-md-start justify-content-md-center py-4 py-lg-0"
          >
            <h5 className="fw-bold mb-3">{t('quick_links_footer')}</h5>
            <Nav className="flex-column gap-1 gap-lg-0">
              {quickLinks.map(({ href, icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="nav-link d-flex align-items-center gap-2 px-0 py-2 py-lg-1 text-light text-decoration-none"
                >
                  <span className="d-inline-block flex-shrink-0 text-center" aria-hidden="true">
                    {icon}
                  </span>
                  <span>{label}</span>
                </Link>
              ))}
            </Nav>
          </Col>

          <Col xs={12} className="d-md-none">
            <hr className="m-0 border-secondary opacity-25" />
          </Col>

          <div className="vr d-none d-md-block d-lg-none px-0 opacity-25" />

          <Col
            as="section"
            xs={12}
            md
            lg={4}
            className="d-md-grid align-content-md-start justify-content-md-center justify-content-lg-end py-4 py-lg-0"
          >
            <h5 className="fw-bold mb-3">{t('contact')}</h5>
            <ul className="list-unstyled d-flex flex-column gap-1 text-light opacity-75 mb-0">
              <li className="d-flex align-items-center gap-2 py-1">
                <span className="d-inline-block flex-shrink-0 text-center" aria-hidden="true">
                  📍
                </span>
                <span>{t('community_name')}</span>
              </li>
              <li className="d-flex align-items-center gap-2 py-1">
                <span className="d-inline-block flex-shrink-0 text-center" aria-hidden="true">
                  📌
                </span>
                <span>{t('community_location')}</span>
              </li>
              <li className="d-flex align-items-center gap-2 py-1">
                <span className="d-inline-block flex-shrink-0 text-center" aria-hidden="true">
                  ✉️
                </span>
                <a className="text-light" href={`mailto:${ContactEmail}`}>
                  {ContactEmail}
                </a>
              </li>
              <li className="d-flex align-items-center gap-2 py-1">
                <span className="d-inline-block flex-shrink-0 text-center" aria-hidden="true">
                  💬
                </span>
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

        <hr className="my-0 mt-md-4 mb-md-3 border-secondary opacity-25" />

        <div className="py-4 py-lg-2 text-center text-light opacity-75">
          &copy; {copyrightYear} {t('open_source_bazaar')}. {t('all_rights_reserved')}
        </div>
      </Container>
    </footer>
  );
});
