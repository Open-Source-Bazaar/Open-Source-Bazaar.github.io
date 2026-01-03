import { observer } from 'mobx-react';
import { FilePreview } from 'mobx-restful-table';
import { FC } from 'react';
import { CardProps, Card, Button } from 'react-bootstrap';
import { formatDate } from 'web-utility';

import { Product } from '../../models/Hackathon';

export type ProductCardProps = Product & Omit<CardProps, 'id' | 'title'>;

export const ProductCard: FC<ProductCardProps> = observer(
  ({ className = '', id, createdAt, name, sourceLink, link = sourceLink, summary, ...props }) => (
    <Card className={`border-success ${className}`} {...props}>
      <Card.Body className="d-flex flex-column">
        <Card.Title
          as="a"
          className="text-primary"
          title={name as string}
          target="_blank"
          href={link as string}
        >
          {(name || link) as string}
        </Card.Title>
        <p className="border-bottom p-2 text-muted text-truncate">{summary as string}</p>
        <div className="border-bottom py-2 my-2 flex-fill">
          <FilePreview className="w-100" path={link as string} />

          {sourceLink && (
            <Button variant="success" size="sm" href={sourceLink as string}>
              🔗 Git
            </Button>
          )}
        </div>
        <time
          className="d-block p-2 text-truncate"
          dateTime={new Date(createdAt as number).toJSON()}
        >
          📅
          {formatDate(createdAt as number)}
        </time>
      </Card.Body>
    </Card>
  ),
);
