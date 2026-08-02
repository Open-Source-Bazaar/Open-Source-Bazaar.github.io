import { observer } from 'mobx-react';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useContext } from 'react';
import { Badge, Button, Card, Col, Container, Row, Tab, Tabs } from 'react-bootstrap';
import { Minute, Second } from 'web-utility';

import { PageHead } from '../../../components/Layout/PageHead';
import { BorrowHistoryTabContent } from '../../../components/open-library/Borrow';
import { ReviewTabContent } from '../../../components/open-library/Review';
import { BookModel, type Book } from '../../../models/Book';
import { OpenLibraryBorrowFormURL } from '../../../models/configuration';
import { I18nContext } from '../../../models/Translation';
import { lark } from '../../api/Lark/core';
import { skipBuildingAll } from '../../api/SSG';

export const getStaticPaths = skipBuildingAll;

export const getStaticProps: GetStaticProps<Book, { id: string }> = async ({ params }) => {
  await lark.getAccessToken();

  const store = new BookModel();
  store.client = lark.client;

  const props = await store.getOne(params!.id + '');

  return { props, revalidate: Minute / Second };
};

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
      <Container fluid="xl" className="px-3">
        <PageHead title={`${title} - ${t('open_library')}`} />

        <div className="mb-4">
          <Button variant="outline-secondary" className="mb-3" onClick={() => router.back()}>
            &larr; {t('back')}
          </Button>

          <Card className="border-0 shadow-sm" body>
            <Row>
              <Col md={3} className="text-center mb-4 mb-md-0">
                <Image
                  src={cover || '/images/placeholder-book.svg'}
                  alt={title}
                  className="img-fluid"
                  style={{ maxHeight: '300px' }}
                  width={200}
                  height={300}
                />
                <div className="mt-3">
                  <Badge
                    bg={isAvailable ? 'success' : 'warning'}
                    text={isAvailable ? 'white' : 'dark'}
                    className="px-3 py-2"
                  >
                    {isAvailable ? t('available') : t('currently_borrowed')}
                  </Badge>
                </div>
                {status === 'borrowed' && currentHolder && (
                  <div className="mt-2 text-muted">
                    <small>{t('currently_with', { holder: currentHolder })}</small>
                  </div>
                )}
              </Col>
              <Col md={9}>
                <h1>{title}</h1>
                <p className="text-muted mb-3">
                  <cite>{t('by_author', { authors })}</cite>
                </p>

                <div className="mb-3">
                  {category && (
                    <Badge bg="secondary" className="me-2">
                      {category}
                    </Badge>
                  )}
                  {language && (
                    <Badge bg="info" text="dark">
                      {language}
                    </Badge>
                  )}
                </div>

                <p className="lead">{summary}</p>

                <Row as="ul" className="list-unstyled mt-4 g-3" sm={2} md={4}>
                  <Col as="li">
                    <div className="text-muted small">ISBN</div>
                    <div>{isbn || t('not_available')}</div>
                  </Col>
                  <Col as="li">
                    <div className="text-muted small">{t('book_publisher')}</div>
                    <div>{publisher || t('not_available')}</div>
                  </Col>
                  <Col as="li">
                    <div className="text-muted small">{t('book_published_year')}</div>
                    <div>{publishYear || t('not_available')}</div>
                  </Col>
                  <Col as="li">
                    <div className="text-muted small">{t('book_page_count')}</div>
                    <div>{pageCount || t('not_available')}</div>
                  </Col>
                </Row>

                <div className="mt-4">
                  {isAvailable ? (
                    <Button
                      variant="primary"
                      size="lg"
                      href={OpenLibraryBorrowFormURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('request_to_borrow')}
                    </Button>
                  ) : (
                    <Button variant="outline-primary" size="lg" disabled>
                      {t('currently_unavailable')}
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          </Card>

          <div className="mt-4">
            <Tabs defaultActiveKey="reviews" className="mb-3">
              <Tab eventKey="reviews" title={t('reviews')}>
                <ReviewTabContent reviews={reviews} />
              </Tab>
              <Tab eventKey="history" title={t('borrow_history')}>
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
