import setMDX from '@next/mdx';
import { NextConfig } from 'next';
import setPWA from 'next-pwa';
// @ts-expect-error no official types
import withLess from 'next-with-less';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

const { NODE_ENV, CI } = process.env;
const isDev = NODE_ENV === 'development';

const withMDX = setMDX({
    options: {
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      rehypePlugins: [],
      providerImportSource: '@mdx-js/react',
    },
    extension: /\.mdx?$/,
  }),
  withPWA = setPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: isDev,
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
    {
      source: '/recipe/images/:path*',
      destination: 'https://raw.githubusercontent.com/Gar-b-age/CookLikeHOC/main/images/:path*',
    },
  ],
  afterFiles: [],
});

export default withPWA(
  withLess(
    withMDX({
      pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
      output: CI ? 'standalone' : undefined,
      rewrites,
    }),
  ),
);
