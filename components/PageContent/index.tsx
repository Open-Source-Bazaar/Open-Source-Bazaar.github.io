import { MDXProvider } from '@mdx-js/react';
import { Card, Container } from 'idea-react';
import type { FC, PropsWithChildren } from 'react';

import styles from '../../styles/Home.module.less';
import pageContentStyles from './PageContent.module.less';

export type PageContentProps = PropsWithChildren<{}>;

const components = {
  h1: ({ children }: PropsWithChildren<{}>) => (
    <h1 className="bg-info text-center fw-bolder" style={{ color: 'red' }}>
      {children}
    </h1>
  ),
};

export const PageContent: FC<PageContentProps> = ({ children }) => (
  <main
    className={`d-flex flex-column justify-content-start align-items-center bg-secondary bg-gradient fg-black bg-10 ${styles.main}`}
  >
    <Container>
      <Card body className={`p-12 lh-md ${pageContentStyles.MDXProvider}`}>
        <MDXProvider components={components}>{children}</MDXProvider>
      </Card>
    </Container>
  </main>
);
