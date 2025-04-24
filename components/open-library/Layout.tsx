import Head from 'next/head';
import React from 'react';

import FooterComponent from './Footer';
import NavbarComponent from './Navbar';

// 内容容器组件，使内容居中但不添加边框
const ContentContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  );
};

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

/**
 * Open Library 的共享布局组件
 * 包含导航栏、页脚和内容容器
 * 所有 Open Library 页面都应使用此布局
 */
const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'Open Library - Open Source Bazaar',
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* 导航栏 */}
      <NavbarComponent />

      {/* 主要内容 */}
      <main>{children}</main>

      {/* 页脚 */}
      <FooterComponent />
    </>
  );
};

// 导出布局组件和内容容器组件，以便在页面中使用
export default Layout;
export { ContentContainer, Layout };
