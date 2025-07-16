import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { FC, useContext } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';

import { i18n, I18nContext } from '../../models/Translation';

const LanguageMenu = dynamic(() => import('./LanguageMenu'), { ssr: false });

export type MenuItem = Record<'href' | 'name', string>;

const topNavBarMenu = ({ t }: typeof i18n): MenuItem[] => [
  { href: '/article/about', name: t('about') },
  { href: '/article/history', name: t('history') },
  { href: '/article/code-of-conduct', name: t('code_of_conduct') },
  { href: '/article/join-us', name: t('join_us') },
  {
    href: '/article/open-collaborator-award',
    name: t('open_collaborator_award'),
  },
  { href: '/project', name: t('open_source_projects') },
  { href: '/issue', name: 'GitHub issues' },
  {
    href: 'https://github.com/Open-Source-Bazaar/Git-Hackathon-scaffold',
    name: t('hackathon'),
  },
  { href: '/license-filter', name: 'License Filter' },
];

export interface MainNavigatorProps {
  menu?: MenuItem[];
}

export const MainNavigator: FC<MainNavigatorProps> = observer(({ menu }) => {
  const { pathname } = useRouter(),
    i18n = useContext(I18nContext);
  const { t } = i18n;

  menu ||= topNavBarMenu(i18n);

  return (
    <Navbar bg="dark" variant="dark" fixed="top" expand="lg">
      <Container>
        <Navbar.Brand href="/" className="fw-bolder">
          {t('open_source_bazaar')}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            {menu.map(({ href, name }) => (
              <Nav.Link
                key={`${href}-${name}`}
                href={href}
                className={pathname === `${href}` ? 'fw-bolder text-light' : ''}
              >
                {name}
              </Nav.Link>
            ))}
          </Nav>

          <LanguageMenu />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
});
