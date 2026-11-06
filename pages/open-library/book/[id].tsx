import { Badge, Button, Card, Col, Container, Row, Tab, Tabs } from 'idea-react';
import { observer } from 'mobx-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useContext } from 'react';
import { Minute, Second } from 'web-utility';

import { PageHead } from '../../../components/Layout/PageHead';
import { BorrowHistoryTabContent } from '../../../components/open-library/Borrow';
import { ReviewTabContent } from '../../../components/open-library/Review';
import { type Book, BookModel } from '../../../models/Book';
import { OpenLibraryBorrowFormURL } from '../../../models/configuration';
import { I18nContext } from '../../../models/Translation';
import { lark } from '../../api/Lark/core';
import { skipBuilding, skipBuildingAll } from '../../api/SSG';

export const getStaticPaths = skipBuildingAll;

export const getStaticProps = skipBuilding<Book, { id: string }>(async ({ params }) => {
  await lark.getAccessToken();

  const store = new BookModel();
  store.client = lark.client;

  const props = await store.getOne(params!.id + '');

  return { props, revalidate: Minute / Second };
});

const BookDetail: FC<Book> = observer(
  ({
    title,
    authors,
    cover,
    status,
    category,
    language,
    currentHolder,
    isbn,
    publisher,
    publishYear,
    pageCount,
    borrowHistory,
    reviews,
    summary,
  }) => {
    const router = useRouter();
    const { t } = useContext(I18nContext);
    const isAvailable = status === 'available';

    return (
      <Container breakpoint="xl" className="px-5">
        <PageHead title={`${title} - ${t('open_library')}`} />

        <div className="mb-7">
          <Button
            theme="secondary"
            variant="outline"
            className="mb-5"
            onClick={() => router.back()}
          >
            &larr; {t('back')}
          </Button>

          <Card className="border-0 shadow-sm" body>
            <Row>
              <Col md={3} className="text-center mb-7 md:mb-0">
                <Image
                  src={cover || '/images/placeholder-book.svg'}
                  alt={title}
                  className="img-fluid"
                  style={{ maxHeight: '300px' }}
                  width={200}
                  height={300}
                />
                <div className="mt-5">
                  <Badge
                    theme={isAvailable ? 'success' : 'warning'}
                    className={`px-5 py-3 ${isAvailable ? 'fg-white' : 'fg-black'}`}
                  >
                    {isAvailable ? t('available') : t('currently_borrowed')}
                  </Badge>
                </div>
                {status === 'borrowed' && currentHolder && (
                  <div className="mt-3 fg-secondary">
                    <small>{t('currently_with', { holder: currentHolder })}</small>
                  </div>
                )}
              </Col>
              <Col md={9}>
                <h1>{title}</h1>
                <p className="fg-secondary mb-5">
                  <cite>{t('by_author', { authors })}</cite>
                </p>

                <div className="mb-5">
                  {category && (
                    <Badge theme="secondary" className="me-3">
                      {category}
                    </Badge>
                  )}
                  {language && (
                    <Badge theme="info" className="fg-black">
                      {language}
                    </Badge>
                  )}
                </div>

                <p className="fs-lg fw-light">{summary}</p>

                <Row as="ul" className="list-unstyled mt-7 g-5" sm={2} md={4}>
                  <Col as="li">
                    <div className="fg-secondary small">ISBN</div>
                    <div>{isbn || t('not_available')}</div>
                  </Col>
                  <Col as="li">
                    <div className="fg-secondary small">{t('book_publisher')}</div>
                    <div>{publisher || t('not_available')}</div>
                  </Col>
                  <Col as="li">
                    <div className="fg-secondary small">{t('book_published_year')}</div>
                    <div>{publishYear || t('not_available')}</div>
                  </Col>
                  <Col as="li">
                    <div className="fg-secondary small">{t('book_page_count')}</div>
                    <div>{pageCount || t('not_available')}</div>
                  </Col>
                </Row>

                <div className="mt-7">
                  {isAvailable ? (
                    <Button
                      theme="primary"
                      size="lg"
                      href={OpenLibraryBorrowFormURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('request_to_borrow')}
                    </Button>
                  ) : (
                    <Button theme="primary" variant="outline" size="lg" disabled>
                      {t('currently_unavailable')}
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          </Card>

          <div className="mt-7">
            <Tabs id="book-detail-tabs" defaultActiveKey="reviews" className="mb-5">
              <Tab eventKey="reviews" label={t('reviews')}>
                <ReviewTabContent reviews={reviews} />
              </Tab>
              <Tab eventKey="history" label={t('borrow_history')}>
                <BorrowHistoryTabContent history={borrowHistory} />
              </Tab>
            </Tabs>
          </div>
        </div>
      </Container>
    );
  },
);

export default BookDetail;
