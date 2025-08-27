import { marked } from 'marked';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { FC } from 'react';
import { Badge, Breadcrumb, Button, Container } from 'react-bootstrap';

import { PageHead } from '../../components/Layout/PageHead';
import { WikiNode, wikiStore } from '../../models/Wiki';

interface WikiPageParams extends ParsedUrlQuery {
  slug: string[];
}

export const getStaticPaths: GetStaticPaths<WikiPageParams> = async () => {
  const nodes = await wikiStore.getAllContent();
  const paths = nodes.map(({ path }) => ({ 
    params: { slug: path.split('/') } 
  }));

  return { paths, fallback: 'blocking' };
};

interface WikiPageProps {
  node: WikiNode;
  markup: string;
}

export const getStaticProps: GetStaticProps<WikiPageProps, WikiPageParams> = async ({ params }) => {
  const { slug } = params!;
  const nodePath = slug.join('/');

  const node = await wikiStore.getOne(nodePath);
  const markup = marked(node.content || '') as string;

  return { 
    props: { node, markup },
    revalidate: 300 // Revalidate every 5 minutes
  };
};

const WikiPage: FC<WikiPageProps> = ({ node, markup }) => (
  <Container className="py-4">
    <PageHead title={node.title} />
    
    <Breadcrumb className="mb-4">
      <Breadcrumb.Item linkAs={Link} linkProps={{ href: '/wiki' }}>
        Wiki
      </Breadcrumb.Item>
      {node.parent_path && node.parent_path.split('/').map((segment, index, array) => {
        const breadcrumbPath = array.slice(0, index + 1).join('/');

        return (
          <Breadcrumb.Item 
            key={breadcrumbPath}
            linkAs={Link} 
            linkProps={{ href: `/wiki/${breadcrumbPath}` }}
          >
            {segment}
          </Breadcrumb.Item>
        );
      })}
      <Breadcrumb.Item active>
        {node.title}
      </Breadcrumb.Item>
    </Breadcrumb>

    <article>
      <header className="mb-4">
        <h1>{node.title}</h1>
        
        {node.metadata && (
          <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
            <ul className="list-inline mb-0">
              {node.metadata['主题分类'] && (
                <li className="list-inline-item">
                  <Badge bg="primary">{node.metadata['主题分类']}</Badge>
                </li>
              )}
              {node.metadata['发文机构'] && (
                <li className="list-inline-item">
                  <Badge bg="secondary">{node.metadata['发文机构']}</Badge>
                </li>
              )}
              {node.metadata['有效性'] && (
                <li className="list-inline-item">
                  <Badge bg={node.metadata['有效性'] === '现行有效' ? 'success' : 'warning'}>
                    {node.metadata['有效性']}
                  </Badge>
                </li>
              )}
            </ul>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center text-muted small mb-3">
          <div>
            {node.metadata?.['成文日期'] && (
              <span>成文日期: {node.metadata['成文日期']}</span>
            )}
            {node.metadata?.['发布日期'] && node.metadata['发布日期'] !== node.metadata['成文日期'] && (
              <span className="ms-3">发布日期: {node.metadata['发布日期']}</span>
            )}
          </div>
          
          <div className="d-flex gap-2">
            <Button 
              variant="outline-primary"
              size="sm"
              href={`https://github.com/fpsig/open-source-policy/blob/main/China/政策/${node.path}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              在 GitHub 编辑
            </Button>
            {node.metadata?.url && (
              <Button 
                variant="outline-secondary"
                size="sm"
                href={node.metadata.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                查看原文
              </Button>
            )}
          </div>
        </div>
      </header>

      <div 
        dangerouslySetInnerHTML={{ __html: markup }} 
        className="markdown-body" 
      />
    </article>

    <footer className="mt-5 pt-4 border-top">
      <div className="text-center">
        <p className="text-muted">
          这是一个基于 GitHub 仓库的政策文档页面。
          <a 
            href={`https://github.com/fpsig/open-source-policy/blob/main/China/政策/${node.path}`} 
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
