import { MDXProvider } from '@mdx-js/react';
import type { PropsWithChildren } from 'react';
import { Card, Container } from 'react-bootstrap';

import styles from '../../styles/Home.module.scss';
import pageContentStyles from './PageContent.module.scss';

export type PageContentProps = PropsWithChildren<{}>;

const components = {
  h1: (props: PropsWithChildren<{}>) => (
    <h1 className="bg-info text-center fw-bolder" style={{ color: 'red' }}>
      {props?.children}
    </h1>
  ),
};

export default function PageContent({ children }: PageContentProps) {
  return (
    <main
      className={`flex-fill d-flex flex-column justify-content-start align-items-center bg-secondary bg-gradient text-dark bg-opacity-10 ${styles.main}`}
    >
      <Container>
        <Card
          body
          className={`px-5 py-5 lh-base ${pageContentStyles.MDXProvider}`}
        >
          <MDXProvider components={components}>{children}</MDXProvider>
        </Card>
      </Container>
    </main>
  );
}
