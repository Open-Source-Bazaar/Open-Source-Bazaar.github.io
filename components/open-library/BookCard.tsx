import Link from 'next/link';
import React, { useContext } from 'react';
import { Button, Card, Image } from 'react-bootstrap';

import { I18nContext } from '../../models/Translation';

export interface Book {
  id: number;
  title: string;
  author: string;
  cover?: string;
  status?: 'available' | 'borrowed';
  category?: string;
  description?: string;
}

interface BookCardProps {
  book: Book;
  showStatus?: boolean;
  variant?: 'featured' | 'catalog';
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  showStatus = false,
  variant = 'featured',
}) => {
  const cardClass =
    variant === 'featured'
      ? 'h-100 shadow-sm border-0'
      : 'h-100 shadow border-0';

  const { t } = useContext(I18nContext);

  return (
    <Card className={cardClass}>
      <div className="text-center p-3 position-relative">
        {showStatus && (
          <div className="position-absolute top-0 end-0 m-2">
            <span
              className={`badge ${
                book.status === 'available'
                  ? 'bg-success'
                  : 'bg-warning text-dark'
              }`}
            >
              {book.status === 'available' ? '可借阅' : '已借出'}
            </span>
          </div>
        )}
        <div
          className="d-flex align-items-center justify-content-center overflow-hidden rounded bg-light"
          style={{ height: '180px' }}
        >
          <Image
            src={book.cover || '/images/placeholder-book.svg'}
            alt={`${book.title} 封面`}
            className="img-fluid"
            style={{
              maxHeight: '160px',
              maxWidth: '120px',
              objectFit: 'contain',
            }}
          />
        </div>
      </div>
      <Card.Body className="text-center d-flex flex-column p-3">
        <Card.Title
          className="fw-bold h6 mb-2 text-truncate"
          title={book.title}
        >
          {book.title}
        </Card.Title>
        <Card.Text
          className="text-muted small mb-2 text-truncate"
          title={book.author}
        >
          {book.author}
        </Card.Text>
        {book.category && (
          <Card.Text className="text-muted small mb-3">
            <i className="bi bi-tag me-1" />
            {book.category}
          </Card.Text>
        )}
        <div className="mt-auto">
          <Link href={`/open-library/book/${book.id}`} passHref legacyBehavior>
            <Button
              variant="outline-success"
              size="sm"
              as="a"
              className="rounded-pill px-3 fw-medium"
            >
              {t('view_details')}
            </Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BookCard;
