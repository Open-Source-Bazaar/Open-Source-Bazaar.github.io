import { FC } from 'react';
import { Card } from 'react-bootstrap';

export const CommentBox: FC = () => {
  return (
    <Card className="mt-4">
      <Card.Body>
        <h3 className="h5">Comments</h3>
        <p className="text-muted">Comment functionality coming soon...</p>
      </Card.Body>
    </Card>
  );
};
