/** @type {import('next').NextConfig} */
const withMDX = require('@next/mdx')({
    options: {
      remarkPlugins: [],
      rehypePlugins: [],
      providerImportSource: '@mdx-js/react',
    },
    extension: /\.mdx?$/,
  }),
  withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  });

module.exports = withPWA(
  withMDX({
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
    reactStrictMode: true,
  }),
);
