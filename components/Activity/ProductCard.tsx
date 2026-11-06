import { Button, Card, CardBody, CardProps, CardTitle, Time } from 'idea-react';
import { observer } from 'mobx-react';
import { FilePreview } from 'mobx-restful-table';
import { FC } from 'react';

import { Product } from '../../models/Hackathon';
import styles from '../../styles/Hackathon.module.less';

export type ProductCardProps = Product & Omit<CardProps, 'id' | 'title'>;

export const ProductCard: FC<ProductCardProps> = observer(
  ({ className = '', id, createdAt, name, sourceLink, link = sourceLink, summary, ...props }) => (
    <Card className={`${styles.projectCard} ${className}`} {...props}>
      <CardBody className="d-flex flex-column">
        <CardTitle
          as="a"
          className="fg-black fw-bold"
          title={name as string}
          target="_blank"
          href={link as string}
        >
          {(name || link) as string}
        </CardTitle>
        <p className="fg-black opacity-75 mb-5">{summary as string}</p>
        <div className="flex-fill mb-5">
          <FilePreview className="w-100" path={link as string} />
        </div>

        {sourceLink && (
          <div className="d-flex flex-wrap gap-3 mb-5">
            <Button
              theme="inverse"
              size="sm"
              href={sourceLink as string}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </Button>
            <Button
              theme="primary"
              size="sm"
              href={`https://github.dev/${(sourceLink as string).replace('https://github.com/', '')}`}
              target="_blank"
              rel="noreferrer"
            >
              GitHub.dev
            </Button>
            <Button
              theme="inverse"
              size="sm"
              href={`https://codespaces.new/${(sourceLink as string).replace('https://github.com/', '')}`}
              target="_blank"
              rel="noreferrer"
            >
              Codespaces
            </Button>
            <Button
              theme="warning"
              size="sm"
              href={`https://gitpod.io/#${sourceLink as string}`}
              target="_blank"
              rel="noreferrer"
            >
              GitPod
            </Button>
          </div>
        )}

        <span className="fg-black opacity-75 small">
          📅 <Time dateTime={createdAt as number} format="YYYY-MM-DD" />
        </span>
      </CardBody>
    </Card>
  ),
);
