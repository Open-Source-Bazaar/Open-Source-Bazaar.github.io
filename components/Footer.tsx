import { observer } from 'mobx-react';
import Link from 'next/link';
import { useContext } from 'react';
import { Col, Container, Image, Nav, Row } from 'react-bootstrap';

import { ContactEmail, GitHubURL, WeChatURL } from '../models/configuration';
import { I18nContext } from '../models/Translation';

export interface FooterLink {
  href: string;
  icon: string;
  label: string;
}

export interface FooterProps {
  description: string;
  quickLinks: FooterLink[];
  copyrightStartYear?: number;
  showVercelCredit?: boolean;
}

export const Footer = observer(
  ({ description, quickLinks, copyrightStartYear, showVercelCredit }: FooterProps) => {
    const { t } = useContext(I18nContext);
    const currentYear = new Date().getFullYear();
    const copyrightYear =
      copyrightStartYear && copyrightStartYear !== currentYear
        ? `${copyrightStartYear}-${currentYear}`
        : currentYear;

    return (
      <footer className="bg-dark text-light py-4">
        <Container fluid="xl" className="px-3">
          <Row>
            <Col md={4} className="mb-3 mb-md-0">
              <section>
                <h5 className="fw-bold mb-3">{t('open_source_bazaar')}</h5>
                <p className="text-light opacity-75 lh-base">{description}</p>
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
              </section>
            </Col>
            <Col md={4} className="d-md-flex justify-content-md-center mb-3 mb-md-0">
              <section>
                <h5 className="fw-bold mb-3">{t('quick_links_footer')}</h5>
                <Nav className="flex-column">
                  {quickLinks.map(({ href, icon, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="nav-link text-light px-0 py-1 text-decoration-none"
                    >
                      {icon} {label}
                    </Link>
                  ))}
                </Nav>
              </section>
            </Col>
            <Col md={4} className="d-md-flex justify-content-md-end">
              <section>
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
              </section>
            </Col>
          </Row>

          <hr className="mt-4 mb-3 border-secondary opacity-25" />

          <div className="d-flex flex-column align-items-center gap-2 text-center text-light opacity-75 py-2">
            <span>
              &copy; {copyrightYear} {t('open_source_bazaar')}. {t('all_rights_reserved')}
            </span>
            {showVercelCredit && (
              <a
                className="d-flex align-items-center text-light text-decoration-none"
                href="https://vercel.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('powered_by')}
                <Image
                  className="mx-2"
                  src="/vercel.svg"
                  alt="Vercel"
                  width={72}
                  height={16}
                  style={{ filter: 'invert(1)' }}
                />
              </a>
            )}
          </div>
        </Container>
      </footer>
    );
  },
);
