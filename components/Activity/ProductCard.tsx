import { observer } from 'mobx-react';
import { FilePreview } from 'mobx-restful-table';
import { FC } from 'react';
import { CardProps, Card, Button } from 'react-bootstrap';
import { formatDate } from 'web-utility';

import { Product } from '../../models/Hackathon';
import styles from '../../styles/Hackathon.module.less';

export type ProductCardProps = Product & Omit<CardProps, 'id' | 'title'>;

export const ProductCard: FC<ProductCardProps> = observer(
  ({ className = '', id, createdAt, name, sourceLink, link = sourceLink, summary, ...props }) => (
    <Card className={`${styles.projectCard} ${className}`} {...props}>
      <Card.Body className="d-flex flex-column">
        <Card.Title
          as="a"
          className="text-dark fw-bold"
          title={name as string}
          target="_blank"
          href={link as string}
        >
          {(name || link) as string}
        </Card.Title>
        <p className="text-dark opacity-75 mb-3">{summary as string}</p>
        <div className="flex-fill mb-3">
          <FilePreview className="w-100" path={link as string} />
        </div>

        {sourceLink && (
          <div className="d-flex flex-wrap gap-2 mb-3">
            <Button
              variant="dark"
              size="sm"
              href={sourceLink as string}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </Button>
            <Button
              variant="primary"
              size="sm"
              href={`https://github.dev/${(sourceLink as string).replace('https://github.com/', '')}`}
              target="_blank"
              rel="noreferrer"
            >
              GitHub.dev
            </Button>
            <Button
              variant="dark"
              size="sm"
              href={`https://codespaces.new/${(sourceLink as string).replace('https://github.com/', '')}`}
              target="_blank"
              rel="noreferrer"
            >
              Codespaces
            </Button>
            <Button
              variant="warning"
              size="sm"
              href={`https://gitpod.io/#${sourceLink as string}`}
              target="_blank"
              rel="noreferrer"
            >
              GitPod
            </Button>
          </div>
        )}

        <time className="text-dark opacity-75 small" dateTime={new Date(createdAt as number).toJSON()}>
          📅 {formatDate(createdAt as number)}
        </time>
      </Card.Body>
    </Card>
  ),
);
