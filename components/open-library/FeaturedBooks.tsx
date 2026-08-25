import Link from 'next/link';
import { observer } from 'mobx-react';
import { FC, useContext } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';

import { I18nContext } from '../../models/Translation';
import { BookCard, type Book } from './BookCard';

export interface FeaturedBooksProps extends Partial<
  Record<'title' | 'subtitle' | 'viewAllLink' | 'viewAllText', string>
> {
  books: Book[];
  showViewAll?: boolean;
}

export const FeaturedBooks: FC<FeaturedBooksProps> = observer(
  ({
    books,
    title,
    subtitle,
    showViewAll = true,
    viewAllLink = '/open-library/books',
    viewAllText,
  }) => {
    const { t } = useContext(I18nContext);
    const resolvedTitle = title ?? t('featured_books');
    const resolvedSubtitle = subtitle ?? t('featured_books_subtitle');
    const resolvedViewAllText = viewAllText ?? t('view_all_books');

    return (
      <section className="py-5 bg-light">
        <Container fluid="xl" className="px-3">
          <hgroup className="text-center mb-5">
            <h2 className="display-5 fw-bold text-dark mb-3 position-relative">
              {resolvedTitle}
              <div className="position-absolute start-50 translate-middle-x mt-2">
                <div className="bg-success rounded-pill" style={{ width: '60px', height: '3px' }} />
              </div>
            </h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: '37.5rem' }}>
              {resolvedSubtitle}
            </p>
          </hgroup>

          <Row xs={1} sm={2} lg={3} xl={4} className="g-4 justify-content-center">
            {books.slice(0, 8).map(book => (
              <Col key={book.id}>
                <BookCard book={book} variant="featured" />
              </Col>
            ))}
          </Row>

          {showViewAll && (
            <div className="text-center mt-5">
              <Link href={viewAllLink} passHref legacyBehavior>
                <Button
                  variant="outline-success"
                  size="lg"
                  as="a"
                  className="rounded-pill px-4 fw-semibold"
                >
                  <span className="me-2" aria-hidden="true">
                    📚
                  </span>
                  {resolvedViewAllText} <span aria-hidden="true">→</span>
                </Button>
              </Link>
            </div>
          )}
        </Container>
      </section>
    );
  },
);
