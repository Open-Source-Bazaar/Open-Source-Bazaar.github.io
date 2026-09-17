import { spawnSync } from 'node:child_process';

import setMDX from '@next/mdx';
import { NextConfig } from 'next';
import withSerwistInit from '@serwist/next';
// @ts-expect-error no official types
import withLess from 'next-with-less';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

const { NODE_ENV, CI } = process.env;
const isDev = NODE_ENV === 'development';
const { stdout, stderr } = spawnSync('git', ['rev-parse', 'HEAD'], {
  encoding: 'utf8',
});
const gitRevision = stdout.trim();
const { GITHUB_SHA, VERCEL_GIT_COMMIT_SHA } = process.env;
const revision =
  gitRevision || VERCEL_GIT_COMMIT_SHA || GITHUB_SHA || crypto.randomUUID();

if (!gitRevision)
  console.warn(
    `Falling back to random UUID for Serwist revision: ${
      stderr.trim() || 'Git revision is unavailable'
    }`,
  );

const withMDX = setMDX({
    options: {
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      rehypePlugins: [],
      providerImportSource: '@mdx-js/react',
    },
    extension: /\.mdx?$/,
  }),
  withSerwist = withSerwistInit({
    swSrc: 'service-worker.ts',
    swDest: 'public/sw.js',
    disable: isDev,
    additionalPrecacheEntries: [{ url: '/', revision }],
  });

const rewrites: NextConfig['rewrites'] = async () => ({
  beforeFiles: [
    {
      source: '/proxy/github.com/:path*',
      destination: 'https://github.com/:path*',
    },
    {
      source: '/proxy/raw.githubusercontent.com/:path*',
      destination: 'https://raw.githubusercontent.com/:path*',
    },
    {
      source: '/proxy/geo.datav.aliyun.com/:path*',
      destination: 'https://geo.datav.aliyun.com/:path*',
    },
  ],
  afterFiles: [],
});

const redirects: NextConfig['redirects'] = async () =>
  ['/wiki', '/recipe', '/policy'].flatMap(route => [
    {
      source: `${route}/:path*`,
      destination: `https://wiki.fcc-cd.dev${route}/:path*`,
      permanent: true,
    },
  ]);

export default withSerwist(
  withLess(
    withMDX({
      pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
      output: CI ? 'standalone' : undefined,
      rewrites,
      redirects,
    }),
  ),
);
