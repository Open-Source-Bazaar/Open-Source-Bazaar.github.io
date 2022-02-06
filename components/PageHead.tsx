import type { PropsWithChildren } from 'react';
import Head from 'next/head';

export type PageHeadProps = PropsWithChildren<{
  title?: string;
  description?: string;
}>;

export default function PageHead({
  title,
  description = 'React project scaffold based on TypeScript, Next.js & Bootstrap.',
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
