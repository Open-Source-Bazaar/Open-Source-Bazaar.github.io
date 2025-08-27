import { observer } from 'mobx-react';
import { GetStaticProps } from 'next';
import React, { FC, useContext } from 'react';
import { Badge, Card, Container } from 'react-bootstrap';
import { treeFrom } from 'web-utility';

import { PageHead } from '../../components/Layout/PageHead';
import { I18nContext } from '../../models/Translation';
import { WikiNode, wikiStore } from '../../models/Wiki';

export const getStaticProps: GetStaticProps = async () => {
  const nodes = await wikiStore.getAllContent();

  return { 
    props: { nodes },
    revalidate: 300 // Revalidate every 5 minutes
  };
};

const renderTree = (nodes: WikiNode[], level = 0) => (
  <ol className={level === 0 ? 'list-unstyled' : ''}>
    {nodes.map((node) => (
      <li key={node.path} className={level > 0 ? 'ms-3' : ''}>
        <div className="d-flex align-items-center py-1">
          <a 
            href={`/wiki/${node.path}`} 
            className="text-decoration-none"
          >
            {node.title}
          </a>
          {node.metadata?.['主题分类'] && (
            <Badge bg="secondary" className="ms-2 small">
              {node.metadata['主题分类']}
            </Badge>
          )}
        </div>
        {node.children?.length && node.children.length > 0 && renderTree(node.children, level + 1)}
      </li>
    ))}
  </ol>
);

const WikiIndexPage: FC<{ nodes: WikiNode[] }> = observer(({ nodes }) => {
  const { t } = useContext(I18nContext);

  return (
    <Container className="py-4">
      <PageHead title={`${t('wiki')} - ${t('knowledge_base')}`} />
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{t('wiki')} ({nodes.length})</h1>
        <a 
          href="https://github.com/fpsig/open-source-policy" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-outline-primary"
        >
          {t('contribute_content')}
        </a>
      </div>

      {nodes.length === 0 ? (
        <Card>
          <Card.Body className="text-muted text-center">
            <p>{t('no_docs_available')}</p>
            <p>{t('docs_auto_load_from_github')}</p>
          </Card.Body>
        </Card>
      ) : (
        renderTree(
          treeFrom(nodes, 'path', 'parent_path', 'children'),
        )
      )}
    </Container>
  );
});

export default WikiIndexPage;
