import { observer } from 'mobx-react';
import { GetStaticProps } from 'next';
import React, { FC, useContext } from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import { treeFrom } from 'web-utility';

import { ContentTree } from '../../components/Layout/ContentTree';
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

      <div className="alert alert-info mb-4" role="alert">
        <p className="mb-1">
          <strong>感谢老乡鸡餐饮公司及开源菜谱仓库原作者</strong>
        </p>
        <p className="mb-0">
          本菜谱内容来自{' '}
          <a href="https://github.com/Gar-b-age/CookLikeHOC" target="_blank" rel="noopener noreferrer">
            CookLikeHOC 开源菜谱项目
          </a>
          ，感谢原作者们的贡献与分享。
        </p>
      </div>

      {nodes[0] ? (
        <ContentTree 
          nodes={treeFrom(nodes, 'path', 'parent_path', 'children')} 
          basePath="/recipes"
          metaKey="category"
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

export default RecipeIndexPage;