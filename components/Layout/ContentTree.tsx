import Link from 'next/link';
import { FC } from 'react';
import { Badge } from 'react-bootstrap';

import { XContent } from '../../models/Wiki';

interface ContentTreeProps {
  nodes: XContent[];
  basePath: string;
  level?: number;
  metaKey?: string;
}

export const ContentTree: FC<ContentTreeProps> = ({ nodes, basePath, level = 0, metaKey = '主题分类' }) => (
  <ol className={level === 0 ? 'list-unstyled' : ''}>
    {nodes.map(({ path, name, type, meta, children }) => (
      <li key={path} className={level > 0 ? 'ms-3' : ''}>
        {type !== 'dir' ? (
          <Link className="h4 d-flex align-items-center py-1" href={`${basePath}/${path}`}>
            {name}

            {meta?.[metaKey] && (
              <Badge bg="secondary" className="ms-2 small">
                {meta[metaKey]}
              </Badge>
            )}
          </Link>
        ) : (
          <details>
            <summary className="h4">{name}</summary>

            <ContentTree nodes={children || []} basePath={basePath} level={level + 1} metaKey={metaKey} />
          </details>
        )}
      </li>
    ))}
  </ol>
);