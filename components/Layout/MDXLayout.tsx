import { Container, ContainerProps } from 'idea-react';
import { FC } from 'react';

import { PageHead } from './PageHead';

export const MDXLayout: FC<ContainerProps> = ({
  className = 'mt-12 pt-12 pb-5',
  title,
  children,
  ...props
}) => (
  <Container as="article" {...props} className={className}>
    <PageHead title={title} />
    <h1 className="my-7">{title}</h1>

    {children}
  </Container>
);
