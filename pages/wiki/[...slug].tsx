import { marked } from 'marked';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { FC } from 'react';
import { Badge, Breadcrumb, Button, Container } from 'react-bootstrap';
import { decodeBase64 } from 'web-utility';

import { PageHead } from '../../components/Layout/PageHead';
import { policyContentStore, XContent } from '../../models/Wiki';
import { splitFrontMatter } from '../api/core';

interface WikiPageParams extends ParsedUrlQuery {
  slug: string[];
}

export const getStaticPaths: GetStaticPaths<WikiPageParams> = async () => {
  const nodes = await policyContentStore.getAll();

  const paths = nodes
    .filter(({ type }) => type === 'file')
    .map(({ path }) => ({ params: { slug: path.split('/') } }));

  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps<XContent, WikiPageParams> = async ({ params }) => {
  const { slug } = params!;

  const node = await policyContentStore.getOne(slug.join('/'));

  const { meta, markdown } = splitFrontMatter(decodeBase64(node.content!));

  const markup = marked(markdown) as string;

  return {
    props: JSON.parse(JSON.stringify({ ...node, content: markup, meta })),
    revalidate: 300, // Revalidate every 5 minutes
  };
};

const WikiPage: FC<XContent> = ({ name, path, parent_path, content, meta }) => (
  <Container className="py-4">
    <PageHead title={name} />

    <Breadcrumb className="mb-4">
      <Breadcrumb.Item href="/wiki">Wiki</Breadcrumb.Item>

      {parent_path?.split('/').map((segment, index, array) => {
        const breadcrumbPath = array.slice(0, index + 1).join('/');

        return (
          <Breadcrumb.Item key={breadcrumbPath} href={`/wiki/${breadcrumbPath}`}>
            {segment}
          </Breadcrumb.Item>
        );
      })}
      <Breadcrumb.Item active>{name}</Breadcrumb.Item>
    </Breadcrumb>

    <article>
      <header className="mb-4">
        <h1>{name}</h1>

        {meta && (
          <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
            <ul className="mb-0">
              {meta['主题分类'] && (
                <li>
                  <Badge bg="primary">{meta['主题分类']}</Badge>
                </li>
              )}
              {meta['发文机构'] && (
                <li>
                  <Badge bg="secondary">{meta['发文机构']}</Badge>
                </li>
              )}
              {meta['有效性'] && (
                <li>
                  <Badge bg={meta['有效性'] === '现行有效' ? 'success' : 'warning'}>
                    {meta['有效性']}
                  </Badge>
                </li>
              )}
            </ul>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center text-muted small mb-3">
          <div>
            {meta?.['成文日期'] && <span>成文日期: {meta['成文日期']}</span>}
            {meta?.['发布日期'] && meta['发布日期'] !== meta['成文日期'] && (
              <span className="ms-3">发布日期: {meta['发布日期']}</span>
            )}
          </div>

          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              href={`https://github.com/fpsig/open-source-policy/blob/main/China/政策/${path}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              在 GitHub 编辑
            </Button>
            {meta?.url && (
              <Button
                variant="outline-secondary"
                size="sm"
                href={meta.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                查看原文
              </Button>
            )}
          </div>
        </div>
      </header>

      <div dangerouslySetInnerHTML={{ __html: content || '' }} className="markdown-body" />
    </article>

    <footer className="mt-5 pt-4 border-top">
      <div className="text-center">
        <p className="text-muted">
          这是一个基于 GitHub 仓库的政策文档页面。
          <a
            href={`https://github.com/fpsig/open-source-policy/blob/main/China/政策/${path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ms-2"
          >
            在 GitHub 上查看或编辑此内容
          </a>
        </p>
      </div>
    </footer>
  </Container>
);

export default WikiPage;
