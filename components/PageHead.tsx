import Head from 'next/head';
import { FC, PropsWithChildren } from 'react';

export type PageHeadProps = PropsWithChildren<{
  title?: string;
  description?: string;
}>;

export const PageHead: FC<PageHeadProps> = ({
  title,
  description = '开源市集',
  children,
}) => (
  <Head>
    <title>
      {title}
      {title && ' - '}开源市集
    </title>

    {description && <meta name="description" content={description} />}

    {children}
  </Head>
);
