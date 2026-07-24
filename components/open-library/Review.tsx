import { observer } from 'mobx-react';
import { FC, useContext } from 'react';
import { Button, Card } from 'react-bootstrap';
import { formatDate } from 'web-utility';

import { type BookReview } from '../../models/Book';
import { OpenLibraryReviewFormURL } from '../../models/configuration';
import { I18nContext } from '../../models/Translation';

export const RatingStars: FC<Pick<BookReview, 'rating'>> = ({ rating }) => (
  <ol className="list-unstyled d-flex gap-1 mb-0">
    {[...Array(5)].map((_, index) => (
      <li key={index} className="text-warning">
        {index < rating ? '\u2605' : '\u2606'}
      </li>
    ))}
  </ol>
);

export const ReviewCard: FC<BookReview> = ({ reviewer, rating, comment, date }) => (
  <Card className="mb-3 shadow-sm" body>
    <div className="d-flex justify-content-between align-items-center mb-2">
      <h5 className="mb-0">{reviewer}</h5>
      <RatingStars rating={rating} />
    </div>
    <Card.Text>{comment}</Card.Text>
    <Card.Text className="small text-muted">{formatDate(date, 'YYYY-MM-DD')}</Card.Text>
  </Card>
);

export const ReviewTabContent: FC<{ reviews?: BookReview[] }> = observer(({ reviews }) => {
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
});
