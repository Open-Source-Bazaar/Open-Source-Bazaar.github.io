import { WikiNode } from 'mobx-lark';
import { observer } from 'mobx-react';
import { GetStaticProps } from 'next';
import { FC, useContext } from 'react';
import { Container } from 'react-bootstrap';
import { treeFrom } from 'web-utility';

import { PageHead } from '../../components/Layout/PageHead';
import { I18nContext } from '../../models/Translation';
import { wikiStore } from '../../models/Wiki';
import { lark } from '../api/Lark/core';

export const getStaticProps: GetStaticProps = async () => {
  await lark.getAccessToken();

  const nodes = await wikiStore.getAll();

  return { props: { nodes } };
};

interface XWikiNode extends WikiNode {
  // eslint-disable-next-line no-restricted-syntax
  children?: XWikiNode[];
}

const renderTree = (children?: XWikiNode[]) =>
  children && (
    <ol>
      {children.map(({ node_token, title, children }) => (
        <li key={node_token}>
          <a href={`/wiki/${node_token}`}>{title}</a>

          {renderTree(children)}
        </li>
      ))}
    </ol>
  );

const WikiIndexPage: FC<{ nodes: XWikiNode[] }> = observer(({ nodes }) => {
  const { t } = useContext(I18nContext);

  return (
    <Container>
      <PageHead title={t('wiki')} />

      <h1>{t('wiki')}</h1>

      {renderTree(treeFrom(nodes, 'node_token', 'parent_node_token', 'children'))}
    </Container>
  );
});

export default WikiIndexPage;
