import { observer } from 'mobx-react';
import { cache, compose, errorLogger } from 'next-ssr-middleware';
import { FC, useContext, useMemo, useState } from 'react';
import { Badge, Card, Col, Container, Form, Row } from 'react-bootstrap';

import { PageHead } from '../../components/Layout/PageHead';
import { SectionTitle } from '../../components/Layout/SectionTitle';
import { I18nContext } from '../../models/Translation';
import type { Book, BookCategory, BookStatus } from '../../types/library';
import { libraryBooks } from './books';

export const getServerSideProps = compose(cache(), errorLogger, async () => ({
  props: {} as Record<string, never>,
}));

const CATEGORY_OPTIONS: { value: BookCategory | 'all'; labelKey: string }[] = [
  { value: 'all', labelKey: 'library_category_all' },
  { value: 'open-source', labelKey: 'library_category_open_source' },
  { value: 'programming', labelKey: 'library_category_programming' },
  { value: 'community', labelKey: 'library_category_community' },
  { value: 'design', labelKey: 'library_category_design' },
  { value: 'business', labelKey: 'library_category_business' },
];

const LibraryPage: FC = observer(() => {
  const { t } = useContext(I18nContext);
  const [category, setCategory] = useState<BookCategory | 'all'>('all');
  const [search, setSearch] = useState('');

  const filteredBooks = useMemo(() => {
    let books: Book[] = libraryBooks;
    if (category !== 'all') {
      books = books.filter((b) => b.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      books = books.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.tags?.some((tag) => tag.toLowerCase().includes(q)),
      );
    }
    return books;
  }, [category, search]);

  return (
    <Container>
      <PageHead title={t('open_library')} description={t('open_library_description')} />
      <h1 className="py-5 text-center text-md-start ps-md-4">{t('open_library')}</h1>

      <section className="mb-4">
        <p className="text-muted">{t('open_library_description')}</p>
        <Row className="g-3 mb-4">
          <Col xs={12} md={4}>
            <Form.Control
              type="search"
              placeholder={t('search_books_placeholder')}
              value={search}
              onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
            />
          </Col>
          <Col xs={6} md={3}>
            <Form.Select
              value={category}
              onChange={(e) => setCategory((e.target as HTMLSelectElement).value as BookCategory | 'all')}
            >
              {CATEGORY_OPTIONS.map(({ value, labelKey }) => (
                <option key={value} value={value}>{t(labelKey as any)}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </section>

      <SectionTitle count={filteredBooks.length}>{t('book_catalog')}</SectionTitle>
      <Row as="section" className="g-4 mb-5" xs={1} sm={2} lg={3} xl={4}>
        {filteredBooks.map((book) => (
          <Col key={book.id}>
            <Card className="h-100 shadow-sm">
              <div className="text-center pt-4 px-3 bg-light">
                <Card.Img
                  variant="top"
                  src={book.cover}
                  alt={book.title}
                  style={{ width: 120, height: 160, objectFit: 'cover' }}
                  className="rounded"
                />
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="fs-6">{book.title}</Card.Title>
                <Card.Text className="text-muted small mb-2">{book.author}</Card.Text>
                <div className="d-flex gap-2 flex-wrap mb-2">
                  <Badge bg={book.status === 'available' ? 'success' : 'secondary'}>
                    {t(book.status === 'available' ? 'library_status_available' : 'library_status_borrowed' as any)}
                  </Badge>
                  {book.tags?.slice(0, 2).map((tag) => (
                    <Badge key={tag} bg="info" className="bg-opacity-50 text-dark">{tag}</Badge>
                  ))}
                </div>
                <div className="mt-auto">
                  <a href={`/library/${book.id}`} className="btn btn-outline-primary btn-sm w-100 stretched-link">
                    {t('view_details')}
                  </a>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredBooks.length === 0 && (
        <div className="text-center py-5 text-muted">{t('no_books_found')}</div>
      )}
    </Container>
  );
});

export default LibraryPage;