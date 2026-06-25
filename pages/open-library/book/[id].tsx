import Image from 'next/image';
import { GetServerSideProps } from 'next';
import { observer } from 'mobx-react';
import { FC, useContext } from 'react';
import { useRouter } from 'next/router';
import { Badge, Button, Card, Col, Container, Row, Tab, Table, Tabs } from 'react-bootstrap';
import { formatDate } from 'web-utility';

import { PageHead } from '../../../components/Layout/PageHead';
import type { Book } from '../../../models/Book';
import { I18nContext } from '../../../models/Translation';
import { openLibraryBooks } from '../../api/open-library/books';

export const getServerSideProps: GetServerSideProps<Book> = async ({ params }) => {
  const bookId = +(params!.id + '');
  const book = openLibraryBooks.find(({ id }) => id === bookId);

  return book ? { props: book } : { notFound: true };
};

const BookDetail: FC<Book> = observer(book => {
  const router = useRouter();
  const { t } = useContext(I18nContext);

  return (
    <Container fluid="xl" className="px-3">
      <PageHead title={`${book.title} - ${t('open_library')}`} />

      <div className="mb-4">
        <Button variant="outline-secondary" className="mb-3" onClick={() => router.back()}>
          &larr; {t('back')}
        </Button>

        <Card className="border-0 shadow-sm" body>
          <Row>
            <Col md={3} className="text-center mb-4 mb-md-0">
              <Image
                src={book.cover || '/images/placeholder-book.svg'}
                alt={book.title}
                className="img-fluid"
                style={{ maxHeight: '300px' }}
                width={200}
                height={300}
              />
              <div className="mt-3">
                <Badge
                  bg={book.status === 'available' ? 'success' : 'warning'}
                  text={book.status === 'available' ? 'white' : 'dark'}
                  className="px-3 py-2"
                >
                  {book.status === 'available' ? t('available') : t('currently_borrowed')}
                </Badge>
              </div>
              {book.status === 'borrowed' && book.currentHolder && (
                <div className="mt-2 text-muted">
                  <small>{t('currently_with', { holder: book.currentHolder })}</small>
                </div>
              )}
            </Col>
            <Col md={9}>
              <h1>{book.title}</h1>
              <p className="text-muted mb-3">
                <cite>{t('by_author', { author: book.author })}</cite>
              </p>

              <div className="mb-3">
                <Badge bg="secondary" className="me-2">
                  {book.category}
                </Badge>
                <Badge bg="info" text="dark">
                  {book.language}
                </Badge>
              </div>

              <p className="lead">{book.description}</p>

              <Row as="ul" className="list-unstyled mt-4 g-3" sm={2} md={4}>
                <Col as="li">
                  <div className="text-muted small">ISBN</div>
                  <div>{book.isbn || t('not_available')}</div>
                </Col>
                <Col as="li">
                  <div className="text-muted small">{t('book_publisher')}</div>
                  <div>{book.publisher || t('not_available')}</div>
                </Col>
                <Col as="li">
                  <div className="text-muted small">{t('book_published_year')}</div>
                  <div>{book.publishYear || t('not_available')}</div>
                </Col>
                <Col as="li">
                  <div className="text-muted small">{t('book_page_count')}</div>
                  <div>{book.pageCount || t('not_available')}</div>
                </Col>
              </Row>

              <div className="mt-4">
                {book.status === 'available' ? (
                  <Button
                    variant="primary"
                    size="lg"
                    href="https://open-source-bazaar.feishu.cn/share/base/form/shrcnNiKwb9ApzFFGI3YkCXDdwe?prefill_%E6%93%8D%E4%BD%9C=%E5%80%9F%E5%85%A5"
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
              {book.reviews?.[0] ? (
                <>
                  {book.reviews.map((review, index) => (
                    <Card key={index} className="mb-3 shadow-sm" body>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="mb-0">{review.reviewer}</h5>
                        <ol className="list-unstyled d-flex gap-1 mb-0">
                          {[...Array(5)].map((_, i) => (
                            <li key={i} className="text-warning">
                              {i < review.rating ? '\u2605' : '\u2606'}
                            </li>
                          ))}
                        </ol>
                      </div>
                      <Card.Text>{review.comment}</Card.Text>
                      <Card.Text className="small text-muted">
                        {formatDate(review.date, 'YYYY-MM-DD')}
                      </Card.Text>
                    </Card>
                  ))}
                  <div className="text-center mt-4">
                    <Button
                      variant="outline-primary"
                      href="https://open-source-bazaar.feishu.cn/share/base/form/shrcnFAX8q7mnywCQOsVnIS5Dwb"
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
                    href="https://open-source-bazaar.feishu.cn/share/base/form/shrcnFAX8q7mnywCQOsVnIS5Dwb"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('write_review')}
                  </Button>
                </div>
              )}
            </Tab>
            <Tab eventKey="history" title={t('borrow_history')}>
              {book.borrowHistory?.[0] ? (
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
                    {book.borrowHistory.map((history, index) => (
                      <tr key={index}>
                        <td>{history.borrower}</td>
                        <td>{formatDate(history.borrowDate, 'YYYY-MM-DD')}</td>
                        <td>
                          {history.returnDate ? formatDate(history.returnDate, 'YYYY-MM-DD') : '-'}
                        </td>
                        <td>
                          {history.returnDate ? (
                            <Badge bg="success">{t('returned')}</Badge>
                          ) : (
                            <Badge bg="warning" text="dark">
                              {t('active')}
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-5">
                  <p>{t('not_borrowed_yet')}</p>
                </div>
              )}
            </Tab>
          </Tabs>
        </div>
      </div>
    </Container>
  );
});

export default BookDetail;
