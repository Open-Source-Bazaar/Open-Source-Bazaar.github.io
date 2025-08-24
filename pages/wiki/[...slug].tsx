import { marked } from 'marked';
import { DataObject } from 'mobx-restful';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';

import { pageListOf, splitFrontMatter, traverseTree } from '../api/core';

interface WikiPageParams extends ParsedUrlQuery {
  slug: string[];
}

export const getStaticPaths: GetStaticPaths<WikiPageParams> = async () => {
  const tree = await Array.fromAsync(pageListOf('wiki', 'public/'));
  const list = tree.map(root => [...traverseTree(root, 'subs')]).flat();
  const paths = list
    .map(({ path }) => path && { params: { slug: path.split('/') } })
    .filter(Boolean) as { params: WikiPageParams }[];

  return { paths, fallback: 'blocking' };
};

interface WikiPageProps {
  meta?: DataObject;
  markup: string;
}

export const getStaticProps: GetStaticProps<WikiPageProps, WikiPageParams> = async ({ params }) => {
  const { slug } = params!;
  // https://github.com/vercel/next.js/issues/12851
  if (slug[0] !== 'wiki') slug.unshift('wiki');

  const { meta, markdown } = await splitFrontMatter(`public/${slug.join('/')}.md`);

  const markup = marked(markdown) as string;

  return { props: JSON.parse(JSON.stringify({ meta, markup })) };
};

const WikiPage: NextPage<WikiPageProps> = ({ meta, markup }) => (
  <>
    {meta && (
      <blockquote>
        <a target="_blank" href={meta.url} rel="noreferrer">
          {meta.url}
        </a>
      </blockquote>
    )}
    <article dangerouslySetInnerHTML={{ __html: markup }} />
  </>
);
export default WikiPage;
