import {
  Badge,
  Button,
  Card,
  CardBody,
  CardImage,
  CardProps,
  CardText,
  CardTitle,
} from 'idea-react';
import { observer } from 'mobx-react';
import Link from 'next/link';
import { FC, useContext } from 'react';

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
        <div className="text-center p-5 position-relative">
          {showStatus && (
            <div className="position-absolute top-0 end-0 m-3">
              <Badge theme={isAvailable ? 'success' : 'warning'}>
                {isAvailable ? t('available') : t('borrowed')}
              </Badge>
            </div>
          )}
          <div className="p-5">
            <CardImage
              placement="top"
              src={book.cover || '/images/placeholder-book.svg'}
              alt={`${book.title} ${t('book_cover')}`}
              className="rounded bg-1 object-fit-contain"
              style={{
                height: '180px',
                padding: '10px',
              }}
            />
          </div>
        </div>
        <CardBody className="text-center d-flex flex-column p-5">
          <CardTitle className="fw-bold h6 mb-3 text-truncate" title={book.title}>
            {book.title}
          </CardTitle>
          <CardText className="fg-secondary small mb-3 text-truncate" title={book.authors}>
            {book.authors}
          </CardText>
          {book.category && (
            <CardText className="fg-secondary small mb-5">🏷️ {book.category}</CardText>
          )}
          <div className="mt-auto">
            <Link href={`/open-library/book/${book.id}`} passHref legacyBehavior>
              <Button
                theme="success"
                variant="outline"
                size="sm"
                as="a"
                className="rounded-pill px-5 fw-medium"
              >
                {t('open_library_view_details')}
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    );
  },
);
