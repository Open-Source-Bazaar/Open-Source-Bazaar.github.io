import { FC, HTMLAttributes, PropsWithChildren } from 'react';
import { Badge } from 'react-bootstrap';

export type SectionTitleProps = PropsWithChildren<
  HTMLAttributes<HTMLHeadingElement> & { count?: number }
>;

export const SectionTitle: FC<SectionTitleProps> = ({ className = '', count, children }) => (
  <h2 className={`d-flex align-items-center gap-2 ${className}`}>
    {children}
    <Badge className="fs-6" pill bg="danger">
      {count}
    </Badge>
  </h2>
);
