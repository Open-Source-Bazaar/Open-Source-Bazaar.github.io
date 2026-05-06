import { marked } from 'marked';
import { observer } from 'mobx-react';
import { BadgeBar } from 'mobx-restful-table';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { FC, useContext } from 'react';
import { Breadcrumb, Button, Container } from 'react-bootstrap';
import { decodeBase64 } from 'web-utility';

import { PageHead } from '../../components/Layout/PageHead';
import { I18nContext } from '../../models/Translation';
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

const WikiPage: FC<XContent> = observer(({ name, path, parent_path, content, meta }) => {
  const { t } = useContext(I18nContext);

  return (
    <Container className="py-4">
      <PageHead title={name} />

      <Breadcrumb className="mb-4">
        <Breadcrumb.Item href="/policy">{t('policy')}</Breadcrumb.Item>

        {parent_path?.split('/').map((segment, index, array) => {
          const breadcrumbPath = array.slice(0, index + 1).join('/');

          return (
            <Breadcrumb.Item key={breadcrumbPath} href={`/policy/${breadcrumbPath}`}>
              {segment}
            </Breadcrumb.Item>
          );
        })}
        <Breadcrumb.Item active>{name}</Breadcrumb.Item>
      </Breadcrumb>

      <article>
        <header className="mb-4">
          <h1>{name}</h1>

          {meta && <BadgeBar list={Object.values(meta).map(text => ({ text }))} />}

          <div className="d-flex justify-content-between align-items-center text-muted small mb-3">
            <dl>
              {meta?.['成文日期'] && (
                <>
                  <dt>{t('creation_date')}:</dt>
                  <dd>{meta['成文日期']}</dd>
                </>
              )}
              {meta?.['发布日期'] && meta['发布日期'] !== meta['成文日期'] && (
                <>
                  <dt>{t('publication_date')}:</dt>
                  <dd>{meta['发布日期']}</dd>
                </>
              )}
            </dl>

            <div className="d-flex gap-2">
              <Button
                variant="outline-primary"
                size="sm"
                href={`https://github.com/fpsig/open-source-policy/edit/main/China/政策/${path}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('edit_on_github')}
              </Button>
              {meta?.url && (
                <Button
                  variant="outline-secondary"
                  size="sm"
                  href={meta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('view_original')}
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
            {t('github_document_description')}
            <a
              href={`https://github.com/fpsig/open-source-policy/blob/main/China/政策/${path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ms-2"
            >
              {t('view_or_edit_on_github')}
            </a>
          </p>
        </div>
      </footer>
    </Container>
  );
});

export default WikiPage;
