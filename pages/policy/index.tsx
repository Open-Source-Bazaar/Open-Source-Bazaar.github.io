import { observer } from 'mobx-react';
import { GetStaticProps } from 'next';
import React, { FC, useContext } from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import { treeFrom } from 'web-utility';

import { ContentTree } from '../../components/Layout/ContentTree';
import { PageHead } from '../../components/Layout/PageHead';
import { I18nContext } from '../../models/Translation';
import { policyContentStore, XContent } from '../../models/Wiki';
import { filterMarkdownFiles } from '../api/core';

export const getStaticProps: GetStaticProps<{ nodes: XContent[] }> = async () => {
  const nodes = filterMarkdownFiles(await policyContentStore.getAll());

  return {
    props: JSON.parse(JSON.stringify({ nodes })),
    revalidate: 300, // Revalidate every 5 minutes
  };
};

const WikiIndexPage: FC<{ nodes: XContent[] }> = observer(({ nodes }) => {
  const { t } = useContext(I18nContext);

  return (
    <Container className="py-4">
      <PageHead title={`${t('policy')} - ${t('knowledge_base')}`} />

      <hgroup className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          {t('policy')} ({nodes.length})
        </h1>
        <Button
          href="https://github.com/fpsig/open-source-policy"
          target="_blank"
          rel="noopener noreferrer"
          variant="outline-primary"
        >
          {t('contribute_content')}
        </Button>
      </hgroup>

      {nodes[0] ? (
        <ContentTree
          nodes={treeFrom(nodes, 'path', 'parent_path', 'children')}
          basePath="/policy"
          metaKey="主题分类"
        />
      ) : (
        <Card>
          <Card.Body className="text-muted text-center">
            <p>{t('no_docs_available')}</p>
            <p>{t('docs_auto_load_from_github')}</p>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
});

export default WikiIndexPage;
