import { Button, Card, CardBody, Col, Container, Row } from 'idea-react';
import { observer } from 'mobx-react';
import Link from 'next/link';
import { FC, useContext } from 'react';
import { Minute, Second } from 'web-utility';

import { PageHead } from '../../components/Layout/PageHead';
import { FeaturedBooks } from '../../components/open-library/FeaturedBooks';
import { HeroSection } from '../../components/open-library/HeroSection';
import { HowItWorks } from '../../components/open-library/HowItWorks';
import { Book, BookModel } from '../../models/Book';
import { OpenLibraryMembershipFormURL } from '../../models/configuration';
import { I18nContext } from '../../models/Translation';
import { skipBuilding } from '../api/SSG';

interface OpenLibraryHomepageProps {
  featuredBooks: Book[];
}

export const getStaticProps = skipBuilding<OpenLibraryHomepageProps>(async () => {
  const featuredBooks = await new BookModel().getList({}, 1, 4);

  return { props: { featuredBooks }, revalidate: Minute / Second };
});

const OpenLibraryHomepage: FC<OpenLibraryHomepageProps> = observer(({ featuredBooks }) => {
  const { t } = useContext(I18nContext);
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
    <>
      <PageHead title={t('open_library')} />

      <HeroSection
        title={t('hero_title')}
        subtitle={t('hero_subtitle')}
        ctaText={t('become_member')}
        ctaLink={OpenLibraryMembershipFormURL}
        browseText={t('browse_catalog')}
        heroImage="/images/placeholder-hero.svg"
        heroImageAlt={t('hero_image_alt')}
      />

      <Container breakpoint="xl" className="px-5">
        <div className="py-12">
          <div className="text-center mb-12">
            <h2 className="fs-4xl fw-bold fg-primary mb-5">📚 {t('about_us_footer')}</h2>
            <p className="fs-lg fw-light fg-secondary">{t('open_library_community_intro')}</p>
          </div>

          <Row className="g-7 mb-12">
            <Col md={6}>
              <Card className="h-100 border-0 shadow-sm">
                <CardBody className="p-7">
                  <h4 className="fg-primary mb-5">🌟 {t('our_mission')}</h4>
                  <p>{t('our_mission_text')}</p>
                </CardBody>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100 border-0 shadow-sm">
                <CardBody className="p-7">
                  <h4 className="fg-primary mb-5">💡 {t('core_concepts')}</h4>
                  <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
                    <li className="d-flex gap-3">
                      <span aria-hidden="true">✦</span>
                      <span>
                        <strong>{t('knowledge_flow')}</strong> - {t('knowledge_flow_desc')}
                      </span>
                    </li>
                    <li className="d-flex gap-3">
                      <span aria-hidden="true">✦</span>
                      <span>
                        <strong>{t('community_driven')}</strong> - {t('community_driven_desc')}
                      </span>
                    </li>
                    <li className="d-flex gap-3">
                      <span aria-hidden="true">✦</span>
                      <span>
                        <strong>{t('open_sharing')}</strong> - {t('open_sharing_desc')}
                      </span>
                    </li>
                  </ul>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>

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

      <div className="bg-primary bg-gradient fg-white py-12">
        <Container breakpoint="xl" className="px-5">
          <div className="text-center">
            <h2 className="fs-3xl fw-bold mb-5">💖 {t('support_us')}</h2>
            <p className="fs-lg fw-light mb-7">{t('support_us_description')}</p>
            <div className="d-flex flex-column sm:flex-row gap-5 justify-content-center">
              <Link href="/open-library/books" passHref legacyBehavior>
                <Button as="a" theme="secondary" size="lg" className="rounded-pill px-7">
                  📚 {t('share_your_book')}
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
});

export default OpenLibraryHomepage;
