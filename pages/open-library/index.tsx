import Link from 'next/link';
import { observer } from 'mobx-react';
import { useContext } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';

import { PageHead } from '../../components/Layout/PageHead';
import FeaturedBooks from '../../components/open-library/FeaturedBooks';
import HeroSection from '../../components/open-library/HeroSection';
import HowItWorks from '../../components/open-library/HowItWorks';
import { ContentContainer } from '../../components/open-library/Layout';
import { I18nContext } from '../../models/Translation';
import { openLibraryBooks } from '../api/open-library/books';
import styles from '../../styles/open-library.module.scss';

const OpenLibraryHomepage = observer(() => {
  const { t } = useContext(I18nContext);
  const featuredBooks = openLibraryBooks.slice(0, 4);
  const workflowSteps = [
    {
      id: 1,
      icon: '🔍',
      title: t('step_1_find_book'),
      description: t('step_1_description'),
      color: '#6f42c1',
    },
    {
      id: 2,
      icon: '📄',
      title: t('step_2_apply'),
      description: t('step_2_description'),
      color: '#0d6efd',
    },
    {
      id: 3,
      icon: '↔️',
      title: t('step_3_receive'),
      description: t('step_3_description'),
      color: '#fd7e14',
    },
    {
      id: 4,
      icon: '📚',
      title: t('share_your_knowledge'),
      description: t('learn_more_about_borrowing'),
      color: '#198754',
    },
  ];

  return (
    <div className={styles.openLibrary}>
        <PageHead title={t('open_library')} />

        <HeroSection
          title={t('hero_title')}
          subtitle={t('hero_subtitle')}
          ctaText={t('become_member')}
          ctaLink="https://open-source-bazaar.feishu.cn/share/base/form/shrcngQgMrhjTh6ycO1zcaEWZld"
          browseText={t('browse_catalog')}
          heroImage="/images/placeholder-hero.svg"
          heroImageAlt="People sharing books"
        />

        <ContentContainer>
          <div className="py-5">
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold text-primary mb-3">📚 {t('about_us_footer')}</h2>
              <p className="lead text-muted">{t('open_library_community_intro')}</p>
            </div>

            <Row className="g-4 mb-5">
              <Col md={6}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <h4 className="text-primary mb-3">🌟 {t('our_mission')}</h4>
                    <p>{t('our_mission_text')}</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <h4 className="text-primary mb-3">💡 {t('core_concepts')}</h4>
                    <ul className={styles.featureList}>
                      <li className="mb-2">
                        <strong>{t('knowledge_flow')}</strong> - {t('knowledge_flow_desc')}
                      </li>
                      <li className="mb-2">
                        <strong>{t('community_driven')}</strong> - {t('community_driven_desc')}
                      </li>
                      <li className="mb-2">
                        <strong>{t('open_sharing')}</strong> - {t('open_sharing_desc')}
                      </li>
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </ContentContainer>

        <FeaturedBooks
          title={t('featured_books')}
          subtitle={t('featured_books_subtitle')}
          books={featuredBooks}
          viewAllLink="/open-library/books"
          viewAllText={t('view_all_books')}
        />

        <HowItWorks
          title={t('how_it_works')}
          subtitle={t('how_it_works_description')}
          steps={workflowSteps}
          learnMoreLink="/open-library/how-to-borrow"
        />

        <div className="bg-primary bg-gradient text-white py-5">
          <ContentContainer>
            <div className="text-center">
              <h2 className="display-6 fw-bold mb-3">💖 {t('support_us')}</h2>
              <p className="lead mb-4">{t('support_us_description')}</p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <Button
                  as="a"
                  href="https://github.com/sponsors/your-org"
                  variant="light"
                  size="lg"
                  className="rounded-pill px-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ❤️ GitHub Sponsors
                </Button>
                <Link href="/open-library/books" passHref legacyBehavior>
                  <Button as="a" variant="outline-light" size="lg" className="rounded-pill px-4">
                    📚 {t('share_your_book')}
                  </Button>
                </Link>
              </div>
            </div>
          </ContentContainer>
        </div>

    </div>
  );
});

export default OpenLibraryHomepage;
