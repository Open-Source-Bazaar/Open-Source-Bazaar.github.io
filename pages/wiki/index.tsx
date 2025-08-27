import { observer } from 'mobx-react';
import { GetStaticProps } from 'next';
import { FC, useContext } from 'react';
import { Container } from 'react-bootstrap';

import { PageHead } from '../../components/Layout/PageHead';
import { I18nContext } from '../../models/Translation';
import { WikiNode, wikiStore } from '../../models/Wiki';

export const getStaticProps: GetStaticProps = async () => {
  try {
    const nodes = await wikiStore.getAll();

    return { 
      props: { nodes },
      revalidate: 300 // Revalidate every 5 minutes
    };
  } catch (error) {
    console.error('Failed to load wiki content:', error);

    return { props: { nodes: [] } };
  }
};

const renderWikiList = (nodes: WikiNode[]) => {
  if (!nodes.length) {
    return (
      <div className="text-muted">
        <p>暂无政策文档。</p>
        <p>政策文档将从标记为 'wiki' 或 'policy' 的 GitHub Issues 中自动加载。</p>
      </div>
    );
  }

  return (
    <div className="row g-3">
      {nodes.map(({ id, title, body, html_url, updated_at, labels, repository }) => (
        <div key={id} className="col-md-6 col-lg-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">
                <a href={`/wiki/${id}`} className="text-decoration-none">
                  {title}
                </a>
              </h5>
              <p className="card-text text-muted small">
                {body.length > 100 ? `${body.substring(0, 100)}...` : body}
              </p>
              <div className="mb-2">
                {labels.map(label => (
                  <span key={label} className="badge bg-secondary me-1">
                    {label}
                  </span>
                ))}
              </div>
              {repository && (
                <p className="card-text">
                  <small className="text-muted">
                    来源: {repository.full_name}
                  </small>
                </p>
              )}
            </div>
            <div className="card-footer">
              <small className="text-muted">
                更新于: {new Date(updated_at).toLocaleDateString('zh-CN')}
              </small>
              <div className="mt-2">
                <a href={html_url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                  在 GitHub 查看
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const WikiIndexPage: FC<{ nodes: WikiNode[] }> = observer(({ nodes }) => {
  const { t } = useContext(I18nContext);

  return (
    <Container className="py-4">
      <PageHead title={`${t('wiki')} - 政策文档`} />
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>政策 Wiki ({nodes.length})</h1>
        <a 
          href="https://github.com/Open-Source-Bazaar" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-outline-primary"
        >
          贡献内容
        </a>
      </div>

      {renderWikiList(nodes)}
    </Container>
  );
});

export default WikiIndexPage;
