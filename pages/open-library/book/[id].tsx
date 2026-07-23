import { observer } from 'mobx-react';
import { HTTPError } from 'koajax';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useContext } from 'react';
import { Badge, Button, Card, Col, Container, Row, Tab, Table, Tabs } from 'react-bootstrap';
import { formatDate } from 'web-utility';

import { PageHead } from '../../../components/Layout/PageHead';
import { BookModel, type Book, type BookReview, type BorrowHistory } from '../../../models/Book';
import { OpenLibraryBorrowFormURL, OpenLibraryReviewFormURL } from '../../../models/configuration';
import { I18nContext } from '../../../models/Translation';

export const getServerSideProps: GetServerSideProps<Book> = async ({ params }) => {
  try {
    return { props: await new BookModel().getOne(params!.id + '') };
  } catch (error) {
    if (error instanceof HTTPError && error.response?.status === 404) return { notFound: true };
    throw error;
  }
};

const RatingStars: FC<Pick<BookReview, 'rating'>> = ({ rating }) => (
  <ol className="list-unstyled d-flex gap-1 mb-0">
    {[...Array(5)].map((_, index) => (
      <li key={index} className="text-warning">
        {index < rating ? '\u2605' : '\u2606'}
      </li>
    ))}
  </ol>
);

const ReviewCard: FC<BookReview> = ({ reviewer, rating, comment, date }) => (
  <Card className="mb-3 shadow-sm" body>
    <div className="d-flex justify-content-between align-items-center mb-2">
      <h5 className="mb-0">{reviewer}</h5>
      <RatingStars rating={rating} />
    </div>
    <Card.Text>{comment}</Card.Text>
    <Card.Text className="small text-muted">{formatDate(date, 'YYYY-MM-DD')}</Card.Text>
  </Card>
);

const ReviewTabContent: FC<{ reviews?: BookReview[] }> = ({ reviews }) => {
  const { t } = useContext(I18nContext);

  return reviews?.[0] ? (
    <>
      {reviews.map(({ reviewer, rating, comment, date }) => (
        <ReviewCard key={`${reviewer}-${date}`} {...{ reviewer, rating, comment, date }} />
      ))}
      <div className="text-center mt-4">
        <Button
          variant="outline-primary"
          href={OpenLibraryReviewFormURL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('add_your_review')}
        </Button>
      </div>
    </>
  ) : (
    <div className="text-center py-5">
      <p className="mb-4">{t('be_first_to_review')}</p>
      <Button
        variant="primary"
        href={OpenLibraryReviewFormURL}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('write_review')}
      </Button>
    </div>
  );
};

const BorrowHistoryRow: FC<BorrowHistory> = ({ borrower, borrowDate, returnDate }) => {
  const { t } = useContext(I18nContext);

  return (
    <tr>
      <td>{borrower}</td>
      <td>{formatDate(borrowDate, 'YYYY-MM-DD')}</td>
      <td>{returnDate ? formatDate(returnDate, 'YYYY-MM-DD') : '-'}</td>
      <td>
        {returnDate ? (
          <Badge bg="success">{t('returned')}</Badge>
        ) : (
          <Badge bg="warning" text="dark">
            {t('active')}
          </Badge>
        )}
      </td>
    </tr>
  );
};

const BorrowHistoryTabContent: FC<{ history?: BorrowHistory[] }> = ({ history }) => {
  const { t } = useContext(I18nContext);

  return history?.[0] ? (
    <Table hover responsive>
      <thead>
        <tr>
          <th>{t('borrower')}</th>
          <th>{t('borrow_date')}</th>
          <th>{t('return_date')}</th>
          <th>{t('status')}</th>
        </tr>
      </thead>
      <tbody>
        {history.map(({ borrower, borrowDate, returnDate }) => (
          <BorrowHistoryRow
            key={`${borrower}-${borrowDate}`}
            {...{ borrower, borrowDate, returnDate }}
          />
        ))}
      </tbody>
    </Table>
  ) : (
    <div className="text-center py-5">
      <p>{t('not_borrowed_yet')}</p>
    </div>
  );
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
