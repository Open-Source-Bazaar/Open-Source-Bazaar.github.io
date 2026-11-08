import { Button, Col, Container, Row } from 'idea-react';
import { observer } from 'mobx-react';
import Link from 'next/link';
import { FC, useContext } from 'react';

import { I18nContext } from '../../models/Translation';
import { type Book, BookCard } from './BookCard';

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
      <section className="py-12 bg-1">
        <Container fluid="xl" className="px-5">
          <hgroup className="text-center mb-12">
            <h2 className="fs-4xl fw-bold fg-black mb-5 position-relative">
              {resolvedTitle}
              <div className="position-absolute start-50 translate-middle-x mt-3">
                <div className="bg-success rounded-pill" style={{ width: '60px', height: '3px' }} />
              </div>
            </h2>
            <p className="fs-lg fw-light fg-secondary mx-auto" style={{ maxWidth: '37.5rem' }}>
              {resolvedSubtitle}
            </p>
          </hgroup>

          <Row xs={1} sm={2} lg={3} xl={4} className="g-7 justify-content-center">
            {books.slice(0, 8).map(book => (
              <Col key={book.id}>
                <BookCard book={book} variant="featured" />
              </Col>
            ))}
          </Row>

          {showViewAll && (
            <div className="text-center mt-12">
              <Link href={viewAllLink} passHref legacyBehavior>
                <Button
                  theme="success"
                  variant="outline"
                  size="lg"
                  as="a"
                  className="rounded-pill px-7 fw-semibold"
                >
                  <span className="me-3" aria-hidden="true">
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
