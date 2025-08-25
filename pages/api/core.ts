import 'core-js/full/array/from-async';

import Router, { RouterParamContext } from '@koa/router';
import { Context, Middleware } from 'koa';
import { HTTPError } from 'koajax';
import { DataObject } from 'mobx-restful';
import { KoaOption, withKoa, withKoaRouter } from 'next-ssr-middleware';
import { ProxyAgent, setGlobalDispatcher } from 'undici';
import { parse } from 'yaml';

const { HTTP_PROXY } = process.env;

if (HTTP_PROXY) setGlobalDispatcher(new ProxyAgent(HTTP_PROXY));

export const safeAPI: Middleware<any, any> = async (context: Context, next) => {
  try {
    return await next();
  } catch (error) {
    if (!(error instanceof HTTPError)) {
      console.error(error);

      context.status = 400;

      return (context.body = { message: (error as Error).message });
    }
    const { message, response } = error;
    let { body } = response;

    context.status = response.status;
    context.statusMessage = message;

    if (body instanceof ArrayBuffer)
      try {
        body = new TextDecoder().decode(new Uint8Array(body));

        body = JSON.parse(body);
      } catch {
        //
      }
    console.error(JSON.stringify(body, null, 2));

    context.body = body;
  }
};

export const withSafeKoa = <S, C>(...middlewares: Middleware<S, C>[]) =>
  withKoa<S, C>({} as KoaOption, safeAPI, ...middlewares);

export const withSafeKoaRouter = <S, C extends RouterParamContext<S>>(
  router: Router<S, C>,
  ...middlewares: Middleware<S, C>[]
) => withKoaRouter<S, C>({} as KoaOption, router, safeAPI, ...middlewares);

export interface ArticleMeta {
  name: string;
  path?: string;
  meta?: DataObject;
  subs: ArticleMeta[];
}

const MDX_pattern = /\.mdx?$/;

export async function splitFrontMatter(path: string) {
  const { readFile } = await import('fs/promises');

  const file = await readFile(path, 'utf-8');

  const [, frontMatter, markdown] =
    file.trim().match(/^---[\r\n]([\s\S]+?[\r\n])---[\r\n]([\s\S]*)/) || [];

  if (!frontMatter) return { markdown: file };

  try {
    const meta = parse(frontMatter) as DataObject;

    return { markdown, meta };
  } catch (error) {
    console.error(`Error reading front matter for ${path}:`, error);

    return { markdown };
  }
}

export async function* pageListOf(path: string, prefix = 'pages'): AsyncGenerator<ArticleMeta> {
  const { readdir } = await import('fs/promises');

  const list = await readdir(prefix + path, { withFileTypes: true });

  for (const node of list) {
    let { name, path } = node;

    if (name.startsWith('.')) continue;

    const isMDX = MDX_pattern.test(name);

    name = name.replace(MDX_pattern, '');
    path = `${path}/${name}`.replace(new RegExp(`^${prefix}`), '');

    if (node.isFile() && isMDX) {
      const article: ArticleMeta = { name, path, subs: [] };

      const { meta } = await splitFrontMatter(`${node.path}/${node.name}`);

      if (meta) article.meta = meta;

      yield article;
    }
    if (!node.isDirectory()) continue;

    const subs = await Array.fromAsync(pageListOf(path, prefix));

    if (subs.length) yield { name, subs };
  }
}

export type TreeNode<K extends string> = {
  [key in K]: TreeNode<K>[];
};

export function* traverseTree<K extends string, N extends TreeNode<K>>(
  tree: N,
  key: K,
): Generator<N> {
  for (const node of tree[key] || []) {
    yield node as N;
    yield* traverseTree(node as N, key);
  }
}
