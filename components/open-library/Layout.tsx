import Head from 'next/head';
import React, { PropsWithChildren } from 'react';

import FooterComponent from './Footer';
import LibraryNavbar from './Navbar';
import { useOpenLibraryLayout } from './useOpenLibraryLayout';

const ContentContainer: React.FC<PropsWithChildren> = ({ children }) => (
  <div className="container-xl px-3">{children}</div>
);

interface LayoutProps {
  title?: string;
}

/**
 * Open Library 的共享布局组件
 * 包含导航栏、页脚和内容容器
 * 所有 Open Library 页面都应使用此布局
 */
const Layout: React.FC<PropsWithChildren<LayoutProps>> = ({
  children,
  title = 'Open Library - Open Source Bazaar',
}) => {
  // Apply Open Library layout styles
  useOpenLibraryLayout();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <LibraryNavbar />

      <main className="py-5">
        <ContentContainer>{children}</ContentContainer>
      </main>

      <FooterComponent />
    </>
  );
};

export default Layout;
export { ContentContainer, Layout };
