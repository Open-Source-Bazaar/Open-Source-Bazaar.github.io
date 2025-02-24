import '../styles/globals.css';

import { HTTPError } from 'koajax';
import { configure } from 'mobx';
import { enableStaticRendering, observer } from 'mobx-react';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';

import { PageContent } from '../components/PageContent';
import { isServer } from '../models/Base';
import { t } from '../models/Translation';

const LanguageMenu = dynamic(import('../components/Navigator/LanguageMenu'), {
  ssr: false,
});

configure({ enforceActions: 'never' });

enableStaticRendering(isServer());

globalThis.addEventListener?.('unhandledrejection', ({ reason }) => {
  const { message, response } = reason as HTTPError;
  const { statusText, body } = response || {};

  const tips = body?.message || statusText || message;

  if (tips) alert(tips);
});

const App: FC<AppProps> = observer(({ Component, pageProps }) => {
  const { pathname } = useRouter();
  const thisFullYear = new Date().getFullYear();

  const topNavBarMenu = [
    { href: '/about', name: t('about') },
    { href: '/history', name: t('history') },
    { href: '/code-of-conduct', name: t('code_of_conduct') },
    { href: '/join-us', name: t('join_us') },
    { href: '/open-collaborator-award', name: t('open_collaborator_award') },
    {
      href: 'https://github.com/Open-Source-Bazaar/Git-Hackathon-scaffold',
      name: t('hackathon'),
    },
    {
      href: '/library', name: t('open_library'),
    },
  ];
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>{t('open_source_bazaar')}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar bg="dark" variant="dark" fixed="top" expand="lg">
        <Container>
          <Navbar.Brand href="/" className="fw-bolder">
            {t('open_source_bazaar')}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" navbarScroll>
              {topNavBarMenu.map(({ href, name }) => (
                <Nav.Link
                  key={`${href}-${name}`}
                  href={href}
                  className={
                    pathname === `${href}` ? 'fw-bolder text-light' : ''
                  }
                >
                  {name}
                </Nav.Link>
              ))}
            </Nav>

            <LanguageMenu />
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="mt-5 pt-2">
        <PageContent>
          <Component {...pageProps} />
        </PageContent>
      </div>

      <footer className="mw-100 bg-dark text-white">
        <p className="text-center my-0 py-3">
          <span className="pr-3">
            © 2021{thisFullYear === 2021 ? '' : `-${thisFullYear}`}{' '}
            {t('open_source_bazaar')}
          </span>
          {/* <a
            className="flex-fill d-flex justify-content-center align-items-center"
            href="https://vercel.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by
            <span className="mx-2">
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                width={72}
                height={16}
              />
            </span>
          </a> */}
        </p>
      </footer>
    </>
  );
});

export default App;
