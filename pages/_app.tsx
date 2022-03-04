import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Image } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import 'idea-react/dist/index.css';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const thisFullYear = new Date().getFullYear();
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>开源市集</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css"
        />
      </Head>

      <Navbar bg="dark" variant="dark" fixed="top">
        <Container>
          <Navbar.Brand href="/" className="fw-bolder">
            开源市集
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link
              href="/about"
              className={pathname === '/about' ? 'fw-bolder text-light' : ''}
            >
              关于
            </Nav.Link>
            <Nav.Link
              href="/history"
              className={pathname === '/history' ? 'fw-bolder text-light' : ''}
            >
              历史
            </Nav.Link>
            <Nav.Link
              href="/code-of-conduct"
              className={
                pathname === '/code-of-conduct' ? 'fw-bolder text-light' : ''
              }
            >
              行为规范
            </Nav.Link>
            <Nav.Link
              href="/join-us"
              className={pathname === '/join-us' ? 'fw-bolder text-light' : ''}
            >
              参与
            </Nav.Link>
            <Nav.Link
              href="/open-collaborator-award"
              className={
                pathname === '/open-collaborator-award'
                  ? 'fw-bolder text-light'
                  : ''
              }
            >
              开放协作人奖
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <div className="mt-5 pt-2">
        <Component {...pageProps} />
      </div>

      <footer className="mw-100 bg-dark text-white">
        <p className="text-center my-0 py-3">
          <span className="pr-3">
            © 2021{thisFullYear === 2021 ? '' : `-${thisFullYear}`} 开源市集
          </span>
          <a
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
          </a>
        </p>
      </footer>
    </>
  );
}
