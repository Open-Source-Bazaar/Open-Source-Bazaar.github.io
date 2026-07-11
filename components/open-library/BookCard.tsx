import Link from 'next/link';
import { observer } from 'mobx-react';
import { FC, useContext } from 'react';
import { Badge, Button, Card, CardProps } from 'react-bootstrap';

export type { Book } from '../../models/Book';
import type { Book } from '../../models/Book';
import { I18nContext } from '../../models/Translation';

export interface BookCardProps extends CardProps {
  book: Book;
  showStatus?: boolean;
  variant?: 'featured' | 'catalog';
}

export const BookCard: FC<BookCardProps> = observer(
  ({ className = '', book, showStatus = false, variant = 'featured', ...cardProps }) => {
    const isFeatured = variant === 'featured';
    const isAvailable = book.status === 'available';

    const { t } = useContext(I18nContext);

    return (
      <Card className={`border-0 shadow${isFeatured ? '-sm' : ''} ${className}`} {...cardProps}>
        <div className="text-center p-3 position-relative">
          {showStatus && (
            <div className="position-absolute top-0 end-0 m-2">
              <Badge
                bg={isAvailable ? 'success' : 'warning'}
                text={isAvailable ? undefined : 'dark'}
              >
                {isAvailable ? t('available') : t('borrowed')}
              </Badge>
            </div>
          )}
          <div className="p-3">
            <Card.Img
              variant="top"
              src={book.cover || '/images/placeholder-book.svg'}
              alt={`${book.title} ${t('book_cover')}`}
              className="rounded bg-light object-fit-contain"
              style={{
                height: '180px',
                padding: '10px',
              }}
            />
          </div>
        </div>
        <Card.Body className="text-center d-flex flex-column p-3">
          <Card.Title className="fw-bold h6 mb-2 text-truncate" title={book.title}>
            {book.title}
          </Card.Title>
          <Card.Text className="text-muted small mb-2 text-truncate" title={book.author}>
            {book.author}
          </Card.Text>
          {book.category && (
            <Card.Text className="text-muted small mb-3">🏷️ {book.category}</Card.Text>
          )}
          <div className="mt-auto">
            <Link href={`/open-library/book/${book.id}`} passHref legacyBehavior>
              <Button
                variant="outline-success"
                size="sm"
                as="a"
                className="rounded-pill px-3 fw-medium"
              >
                {t('open_library_view_details')}
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    );
  },
);
