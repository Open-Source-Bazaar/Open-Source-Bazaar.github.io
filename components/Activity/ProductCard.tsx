import { observer } from 'mobx-react';
import { FilePreview } from 'mobx-restful-table';
import { FC } from 'react';
import { CardProps, Card, Button } from 'react-bootstrap';
import { formatDate } from 'web-utility';

import { Product } from '../../models/Hackathon';

export type ProductCardProps = Product & Omit<CardProps, 'id' | 'title'>;

export const ProductCard: FC<ProductCardProps> = observer(
  ({ className = '', id, createdAt, name, sourceLink, link = sourceLink, summary, ...props }) => {
    if (!sourceLink) return null;

    return (
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

            <div className="d-flex flex-wrap gap-2 mt-2">
              <Button
                variant="dark"
                size="sm"
                href={sourceLink as string}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="https://img.shields.io/badge/GitHub-181717?logo=github"
                  alt="GitHub"
                  style={{ height: '20px' }}
                />
              </Button>
              <Button
                variant="primary"
                size="sm"
                href={`https://github.dev/${(sourceLink as string).replace('https://github.com/', '')}`}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="https://img.shields.io/badge/GitHub.dev-blue?logo=visualstudio"
                  alt="GitHub.dev"
                  style={{ height: '20px' }}
                />
              </Button>
              <Button
                variant="dark"
                size="sm"
                href={`https://codespaces.new/${(sourceLink as string).replace('https://github.com/', '')}`}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="https://img.shields.io/badge/GitHub_codespaces-black?logo=github"
                  alt="GitHub Codespaces"
                  style={{ height: '20px' }}
                />
              </Button>
              <Button
                variant="warning"
                size="sm"
                href={`https://gitpod.io/#${sourceLink as string}`}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="https://img.shields.io/badge/GitPod.io-orange?logo=git"
                  alt="GitPod"
                  style={{ height: '20px' }}
                />
              </Button>
            </div>
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
    );
  },
);
