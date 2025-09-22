import { observer } from 'mobx-react';
import { GetStaticProps } from 'next';
import React, { FC, useContext } from 'react';
import { Alert, Button, Card, Container } from 'react-bootstrap';
import { treeFrom } from 'web-utility';

import { ContentTree } from '../../components/Layout/ContentTree';
import { PageHead } from '../../components/Layout/PageHead';
import { I18nContext } from '../../models/Translation';
import { recipeContentStore, XContent } from '../../models/Wiki';
import { filterMarkdownFiles } from '../api/core';

export const getStaticProps: GetStaticProps<{ nodes: XContent[] }> = async () => {
  const nodes = filterMarkdownFiles(await recipeContentStore.getAll());

  return {
    props: JSON.parse(JSON.stringify({ nodes })),
    revalidate: 300, // Revalidate every 5 minutes
  };
};

const RecipeIndexPage: FC<{ nodes: XContent[] }> = observer(({ nodes }) => {
  const { t } = useContext(I18nContext);

  return (
    <Container className="py-4">
      <PageHead title={`${t('recipe')} - ${t('knowledge_base')}`} />

      <hgroup className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          {t('recipe')} ({nodes.length})
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

      <Alert variant="info" className="mb-4">
        本菜谱原创自
        <Alert.Link href="https://www.lxjchina.com.cn/display_4226.html" target="_blank">
          《老乡鸡菜品溯源报告》
        </Alert.Link>
        ，并由{' '}
        <Alert.Link href="https://github.com/Gar-b-age/CookLikeHOC" target="_blank">
          CookLikeHOC 开源菜谱项目
        </Alert.Link>
        整理，感谢原作者们的贡献与分享。
      </Alert>

      {nodes[0] ? (
        <ContentTree
          nodes={treeFrom(nodes, 'path', 'parent_path', 'children')}
          basePath="/recipe"
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
