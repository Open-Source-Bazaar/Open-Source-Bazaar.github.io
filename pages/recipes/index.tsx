import { observer } from 'mobx-react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import React, { FC, useContext } from 'react';
import { Badge, Button, Card, Container } from 'react-bootstrap';
import { treeFrom } from 'web-utility';

import { PageHead } from '../../components/Layout/PageHead';
import { I18nContext } from '../../models/Translation';
import { recipeContentStore, XContent } from '../../models/Wiki';
import { MD_pattern, splitFrontMatter } from '../api/core';

export const getStaticProps: GetStaticProps<{ nodes: XContent[] }> = async () => {
  const nodes = (await recipeContentStore.getAll())
    .filter(({ type, name }) => type !== 'file' || MD_pattern.test(name))
    .map(({ content, ...rest }) => {
      const { meta, markdown } = content ? splitFrontMatter(content) : {};

      return { ...rest, content: markdown, meta };
    });

  return {
    props: JSON.parse(JSON.stringify({ nodes })),
    revalidate: 300, // Revalidate every 5 minutes
  };
};

const renderTree = (nodes: XContent[], level = 0) => (
  <ol className={level === 0 ? 'list-unstyled' : ''}>
    {nodes.map(({ path, name, type, meta, children }) => (
      <li key={path} className={level > 0 ? 'ms-3' : ''}>
        {type !== 'dir' ? (
          <Link className="h4 d-flex align-items-center py-1" href={`/recipes/${path}`}>
            {name}

            {meta?.['category'] && (
              <Badge bg="secondary" className="ms-2 small">
                {meta['category']}
              </Badge>
            )}
          </Link>
        ) : (
          <details>
            <summary className="h4">{name}</summary>

            {renderTree(children || [], level + 1)}
          </details>
        )}
      </li>
    ))}
  </ol>
);

const RecipeIndexPage: FC<{ nodes: XContent[] }> = observer(({ nodes }) => {
  const { t } = useContext(I18nContext);

  return (
    <Container className="py-4">
      <PageHead title={`${t('recipes')} - ${t('knowledge_base')}`} />

      <hgroup className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          {t('recipes')} ({nodes.length})
        </h1>
        <Button
          href="https://github.com/Gar-b-age/CookLikeHOC"
          target="_blank"
          rel="noopener noreferrer"
          variant="outline-primary"
        >
          {t('contribute_content')}
        </Button>
      </hgroup>

      {nodes[0] ? (
        renderTree(treeFrom(nodes, 'path', 'parent_path', 'children'))
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

export default RecipeIndexPage;