import { observer } from 'mobx-react';
import Link from 'next/link';
import { useContext } from 'react';
import { Col, Container, Image, Nav, Row } from 'react-bootstrap';

import { ContactEmail, GitHubURL, WeChatURL } from '../models/configuration';
import { I18nContext } from '../models/Translation';
import styles from './Footer.module.less';

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
      <footer className={`bg-dark text-light ${styles.footer}`}>
        <Container fluid="xl" className="px-4 px-md-3">
          <Row>
            <Col md={12} lg={4} className={styles.sectionColumn}>
              <section className={styles.section}>
                <h5 className="fw-bold mb-3">{t('open_source_bazaar')}</h5>
                <p className="text-light opacity-75 lh-base mb-0">{description}</p>
                <div className={`${styles.socialLinks} mt-3`}>
                  <a
                    href={GitHubURL}
                    className={`${styles.socialLink} text-light text-decoration-none hover-opacity`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    🐱 GitHub
                  </a>
                  <a
                    href={WeChatURL}
                    className={`${styles.socialLink} text-light text-decoration-none hover-opacity`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    💬 WeChat
                  </a>
                </div>
              </section>
            </Col>
            <Col
              md={6}
              lg={4}
              className={`${styles.sectionColumn} d-md-flex justify-content-md-center`}
            >
              <section className={styles.section}>
                <h5 className="fw-bold mb-3">{t('quick_links_footer')}</h5>
                <Nav className={`${styles.quickLinks} flex-column`}>
                  {quickLinks.map(({ href, icon, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className={`${styles.quickLink} nav-link text-light px-0 text-decoration-none`}
                    >
                      <span className={styles.icon} aria-hidden="true">
                        {icon}
                      </span>
                      <span>{label}</span>
                    </Link>
                  ))}
                </Nav>
              </section>
            </Col>
            <Col
              md={6}
              lg={4}
              className={`${styles.sectionColumn} d-md-flex justify-content-md-center justify-content-lg-end`}
            >
              <section className={styles.section}>
                <h5 className="fw-bold mb-3">{t('contact')}</h5>
                <ul
                  className={`${styles.contactList} list-unstyled d-flex flex-column text-light opacity-75 mb-0`}
                >
                  <li className={styles.contactItem}>
                    <span className={styles.icon} aria-hidden="true">
                      📍
                    </span>
                    <span>{t('community_name')}</span>
                  </li>
                  <li className={styles.contactItem}>
                    <span className={styles.icon} aria-hidden="true">
                      📌
                    </span>
                    <span>{t('community_location')}</span>
                  </li>
                  <li className={styles.contactItem}>
                    <span className={styles.icon} aria-hidden="true">
                      ✉️
                    </span>
                    <a className="text-light" href={`mailto:${ContactEmail}`}>
                      {ContactEmail}
                    </a>
                  </li>
                  <li className={styles.contactItem}>
                    <span className={styles.icon} aria-hidden="true">
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
              </section>
            </Col>
          </Row>

          <hr className="my-0 mt-md-4 mb-md-3 border-secondary opacity-25" />

          <div
            className={`${styles.copyright} d-flex flex-column align-items-center gap-2 text-center text-light opacity-75`}
          >
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
