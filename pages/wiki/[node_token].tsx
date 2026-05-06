import { Block, renderBlocks, WikiNode } from 'mobx-lark';
import { GetStaticPaths, GetStaticProps } from 'next';
import { FC } from 'react';
import { Container } from 'react-bootstrap';
import { Minute, Second } from 'web-utility';

import { PageHead } from '../../components/Layout/PageHead';
import { documentStore, wikiStore } from '../../models/Wiki';
import { lark } from '../api/Lark/core';

export const getStaticPaths: GetStaticPaths = async () => {
  await lark.getAccessToken();

  const nodes = await wikiStore.getAll();

  return {
    paths: nodes.map(({ node_token }) => ({ params: { node_token } })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  await lark.getAccessToken();

  const node = await wikiStore.getOne(params!.node_token as string);

  if (node?.obj_type !== 'docx') return { notFound: true };

  try {
    const blocks = await documentStore.getOneBlocks(
      node.obj_token,
      token => `/api/Lark/file/${token}/placeholder`,
    );

    return { props: { node, blocks } };
  } catch (error) {
    console.error(error);

    return { notFound: true, revalidate: Minute / Second };
  }
};

interface WikiDocumentPageProps {
  node: WikiNode;
  blocks: Block<any, any, any>[];
}

const WikiDocumentPage: FC<WikiDocumentPageProps> = ({ node, blocks }) => (
  <Container>
    <PageHead title={node.title} />

    {renderBlocks(blocks)}
  </Container>
);

export default WikiDocumentPage;
