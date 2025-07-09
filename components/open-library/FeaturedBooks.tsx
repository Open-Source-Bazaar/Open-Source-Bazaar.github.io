import Link from 'next/link';
import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';

import BookCard, { Book } from './BookCard';
import { ContentContainer } from './Layout';

interface FeaturedBooksProps {
  books: Book[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  viewAllLink?: string;
  viewAllText?: string;
}

const FeaturedBooks: React.FC<FeaturedBooksProps> = ({
  books,
  title = '精选图书',
  subtitle = '社区成员推荐的优质读物，涵盖技术、设计、创业等多个领域',
  showViewAll = true,
  viewAllLink = '/open-library/books',
  viewAllText = '查看全部图书',
}) => (
  <section className="py-5 bg-light">
    <ContentContainer>
      <div className="text-center mb-5">
        <h2 className="display-5 fw-bold text-dark mb-3 position-relative">
          {title}
          <div className="position-absolute start-50 translate-middle-x mt-2">
            <div
              className="bg-success rounded-pill"
              style={{ width: '60px', height: '3px' }}
            />
          </div>
        </h2>
        <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
          {subtitle}
        </p>
      </div>

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
              <i className="bi bi-collection me-2" />
              {viewAllText}
              <i className="bi bi-arrow-right ms-2" />
            </Button>
          </Link>
        </div>
      )}
    </ContentContainer>
  </section>
);

export default FeaturedBooks;
