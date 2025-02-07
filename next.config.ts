import setMDX from '@next/mdx';
import setPWA from 'next-pwa';
// @ts-expect-error no official types
import withLess from 'next-with-less';

const { NODE_ENV, CI } = process.env;
const isDev = NODE_ENV === 'development';

const withMDX = setMDX({
    options: {
      remarkPlugins: [],
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

export default withPWA(
  withLess(
    withMDX({
      pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
      output: CI ? 'standalone' : undefined,
    }),
  ),
);
