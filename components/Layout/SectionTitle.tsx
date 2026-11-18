import { Badge } from 'idea-react';
import { FC, HTMLAttributes, PropsWithChildren } from 'react';

export type SectionTitleProps = PropsWithChildren<
  HTMLAttributes<HTMLHeadingElement> & { count?: number }
>;

export const SectionTitle: FC<SectionTitleProps> = ({ className = '', count, children }) => (
  <h2 className={`d-flex align-items-center gap-3 ${className}`}>
    {children}
    <Badge className="fs-md" pill theme="danger">
      {count}
    </Badge>
  </h2>
);
