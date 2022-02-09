import type { AppProps } from 'next/app';
import Head from 'next/head';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import 'idea-react/dist/index.css';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
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
          <Navbar.Brand href="/">开源市集</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/about">关于</Nav.Link>
            <Nav.Link href="/history">历史</Nav.Link>
            <Nav.Link href="/code-of-conduct">行为规范</Nav.Link>
            <Nav.Link href="/join-us">参与</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <div className="mt-5 pt-2">
        <Component {...pageProps} />
      </div>

      {/* <footer className="flex-fill d-flex justify-content-center align-items-center border-top py-4">
        <a
          className="flex-fill d-flex justify-content-center align-items-center"
          href="https://vercel.com?utm_source=create-next-app&amp;utm_medium=default-template&amp;utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by
          <span className="mx-2">
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
    </>
  );
}