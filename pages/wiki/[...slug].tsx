import { marked } from 'marked';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { FC } from 'react';
import { Badge, Container } from 'react-bootstrap';

import { PageHead } from '../../components/Layout/PageHead';
import { WikiNode, wikiStore } from '../../models/Wiki';

interface WikiPageParams extends ParsedUrlQuery {
  slug: string[];
}

export const getStaticPaths: GetStaticPaths<WikiPageParams> = async () => {
  try {
    const nodes = await wikiStore.getAll();
    const paths = nodes.map(({ id }) => ({ 
      params: { slug: [id.toString()] } 
    }));

    return { paths, fallback: 'blocking' };
  } catch (error) {
    console.error('Failed to generate static paths:', error);

    return { paths: [], fallback: 'blocking' };
  }
};

interface WikiPageProps {
  node?: WikiNode;
  markup: string;
}

export const getStaticProps: GetStaticProps<WikiPageProps, WikiPageParams> = async ({ params }) => {
  const { slug } = params!;
  const [nodeId] = slug;

  try {
    const node = await wikiStore.getOne(nodeId);
    
    if (!node) {
      return { notFound: true };
    }

    const markup = marked(node.body || '') as string;

    return { 
      props: { node, markup },
      revalidate: 300 // Revalidate every 5 minutes
    };
  } catch (error) {
    console.error('Failed to load wiki node:', error);

    return { notFound: true };
  }
};

const WikiPage: FC<WikiPageProps> = ({ node, markup }) => {
  if (!node) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <h2>Wiki 页面未找到</h2>
          <p>请检查页面链接是否正确。</p>
          <Link href="/wiki" className="btn btn-primary">
            返回 Wiki 首页
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <PageHead title={node.title} />
      
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/wiki">Wiki</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {node.title}
          </li>
        </ol>
      </nav>

      <article>
        <header className="mb-4">
          <h1>{node.title}</h1>
          
          <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
            <div>
              {node.labels.map(label => (
                <Badge key={label} bg="secondary" className="me-1">
                  {label}
                </Badge>
              ))}
            </div>
            
            {node.repository && (
              <small className="text-muted">
                来源: {node.repository.full_name}
              </small>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center text-muted small">
            <div>
              创建于: {new Date(node.created_at).toLocaleDateString('zh-CN')}
              {node.updated_at !== node.created_at && (
                <> | 更新于: {new Date(node.updated_at).toLocaleDateString('zh-CN')}</>
              )}
            </div>
            
            <div>
              <a 
                className="btn btn-sm btn-outline-primary"
                href={node.html_url} 
                rel="noopener noreferrer"
                target="_blank" 
              >
                在 GitHub 编辑
              </a>
            </div>
          </div>
        </header>

        <div 
          dangerouslySetInnerHTML={{ __html: markup }} 
          className="wiki-content" 
        />
      </article>

      <footer className="mt-5 pt-4 border-top">
        <div className="text-center">
          <p className="text-muted">
            这是一个基于 GitHub Issues 的 Wiki 页面。
            <a href={node.html_url} target="_blank" rel="noopener noreferrer" className="ms-2">
              在 GitHub 上查看或编辑此内容
            </a>
          </p>
        </div>
      </footer>
    </Container>
  );
};

export default WikiPage;
