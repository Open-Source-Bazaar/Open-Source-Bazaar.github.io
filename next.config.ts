import setMDX from '@next/mdx';
import setPWA from 'next-pwa';

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
    disable: process.env.NODE_ENV === 'development',
  });

export default withPWA(
  withMDX({
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
    output: 'export',
  }),
);
