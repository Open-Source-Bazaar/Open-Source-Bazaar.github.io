import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import 'idea-react/dist/index.css';
import '../styles/globals.css';

const topNavBarMenu = [
  {
    href: '/about',
    name: '关于',
  },
  {
    href: '/history',
    name: '历史',
  },
  {
    href: '/code-of-conduct',
    name: '行为规范',
  },
  {
    href: '/join-us',
    name: '参与',
  },
  {
    href: '/open-collaborator-award',
    name: '开放协作人奖',
  },
];

export default function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const thisFullYear = new Date().getFullYear();
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>开源市集</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar bg="dark" variant="dark" fixed="top" expand="lg">
        <Container>
          <Navbar.Brand href="/" className="fw-bolder">
            开源市集
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
          </Navbar.Collapse>
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
}
