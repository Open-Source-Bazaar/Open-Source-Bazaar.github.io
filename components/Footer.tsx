import { Col, Container, Nav, Row } from 'idea-react';
import { observer } from 'mobx-react';
import Link from 'next/link';
import { FC, useContext } from 'react';

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
    <footer data-bs-theme="dark" className="bg-body fg-body">
      <Container fluid="xl" className="px-7 md:px-5 lg:py-7">
        <Row>
          <Col as="section" xs={12} lg={4} className="py-7 lg:py-0">
            <h5 className="fw-bold mb-5">{t('open_source_bazaar')}</h5>
            <p className="fg-white opacity-75 lh-md mb-0">{description}</p>
            <div className="d-flex flex-wrap gap-3 column-gap-5 mt-5">
              <a
                href={GitHubURL}
                className="d-inline-flex align-items-center py-3 lg:py-0 fg-white text-decoration-none hover-opacity"
                target="_blank"
                rel="noopener noreferrer"
              >
                🐱 GitHub
              </a>
              <a
                href={WeChatURL}
                className="d-inline-flex align-items-center py-3 lg:py-0 fg-white text-decoration-none hover-opacity"
                target="_blank"
                rel="noopener noreferrer"
              >
                💬 WeChat
              </a>
            </div>
          </Col>

          <Col xs={12} className="lg:d-none">
            <hr className="m-0 border-secondary opacity-25" />
          </Col>

          <Col
            as="section"
            xs={12}
            md
            lg={4}
            className="md:d-grid md:align-content-start md:justify-content-center py-7 lg:py-0"
          >
            <h5 className="fw-bold mb-5">{t('quick_links_footer')}</h5>
            <Nav className="flex-column gap-1 lg:gap-0">
              {quickLinks.map(({ href, icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="nav-link d-flex align-items-center gap-3 px-0 py-3 lg:py-1 fg-white text-decoration-none"
                >
                  <span className="d-inline-block flex-shrink-0 text-center" aria-hidden="true">
                    {icon}
                  </span>
                  <span>{label}</span>
                </Link>
              ))}
            </Nav>
          </Col>

          <Col xs={12} className="md:d-none">
            <hr className="m-0 border-secondary opacity-25" />
          </Col>

          <div className="vr d-none md:d-block lg:d-none px-0 opacity-25" />

          <Col
            as="section"
            xs={12}
            md
            lg={4}
            className="md:d-grid md:align-content-start md:justify-content-center lg:justify-content-end py-7 lg:py-0"
          >
            <h5 className="fw-bold mb-5">{t('contact')}</h5>
            <ul className="list-unstyled d-flex flex-column gap-1 fg-white opacity-75 mb-0">
              <li className="d-flex align-items-center gap-3 py-1">
                <span className="d-inline-block flex-shrink-0 text-center" aria-hidden="true">
                  📍
                </span>
                <span>{t('community_name')}</span>
              </li>
              <li className="d-flex align-items-center gap-3 py-1">
                <span className="d-inline-block flex-shrink-0 text-center" aria-hidden="true">
                  📌
                </span>
                <address className="mb-0">{t('community_location')}</address>
              </li>
              <li className="d-flex align-items-center gap-3 py-1">
                <span className="d-inline-block flex-shrink-0 text-center" aria-hidden="true">
                  ✉️
                </span>
                <a className="fg-white" href={`mailto:${ContactEmail}`}>
                  {ContactEmail}
                </a>
              </li>
              <li className="d-flex align-items-center gap-3 py-1">
                <span className="d-inline-block flex-shrink-0 text-center" aria-hidden="true">
                  💬
                </span>
                <a className="fg-white" href={WeChatURL} target="_blank" rel="noopener noreferrer">
                  {t('community_name')}
                </a>
              </li>
            </ul>
          </Col>
        </Row>

        <hr className="my-0 md:mt-7 md:mb-5 border-secondary opacity-25" />

        <div className="py-7 lg:py-3 text-center fg-white opacity-75">
          &copy; {copyrightYear} {t('open_source_bazaar')}. {t('all_rights_reserved')}
        </div>
      </Container>
    </footer>
  );
});
