import Head from 'next/head';
import type { PropsWithChildren } from 'react';

export type PageHeadProps = PropsWithChildren<{
  title?: string;
  description?: string;
}>;

export default function PageHead({
  title,
  description = '开源市集。',
  children,
}: PageHeadProps) {
  return (
    <Head>
      <title>
        {title}
        {title && ' - '}开源市集
      </title>

      {description && <meta name="description" content={description} />}

      {children}
    </Head>
  );
}
