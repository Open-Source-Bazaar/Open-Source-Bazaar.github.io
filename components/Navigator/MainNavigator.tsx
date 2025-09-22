import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { AnchorHTMLAttributes, FC, useContext } from 'react';
import { Container, Image, Nav, Navbar, NavDropdown } from 'react-bootstrap';

import { DefaultImage } from '../../models/configuration';
import { i18n, I18nContext } from '../../models/Translation';

const LanguageMenu = dynamic(() => import('./LanguageMenu'), { ssr: false });

export interface MenuItem extends Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'title'> {
  subs?: MenuItem[];
}

const topNavBarMenu = ({ t }: typeof i18n): MenuItem[] => [
  {
    title: t('about'),
    subs: [
      { href: '/article/about', title: t('about') },
      { href: '/article/history', title: t('history') },
      { href: '/article/code-of-conduct', title: t('code_of_conduct') },
    ],
  },
  {
    title: t('join_us'),
    subs: [
      { href: '/article/join-us', title: t('join_us') },
      {
        href: '/article/open-collaborator-award',
        title: t('open_collaborator_award'),
      },
      { href: '/volunteer', title: t('volunteer') },
    ],
  },
  {
    title: t('open_source_projects'),
    subs: [
      { href: '/project', title: t('open_source_projects') },
      { href: '/issue', title: 'GitHub issues' },
      {
        href: 'https://github.com/Open-Source-Bazaar/Git-Hackathon-scaffold',
        title: t('hackathon'),
      },
      { href: '/license-filter', title: t('license_filter') },
    ],
  },
  {
    title: t('NGO'),
    subs: [
      { href: '/NGO', title: t('China_NGO_DB') },
      {
        href: 'https://open-source-bazaar.feishu.cn/wiki/VGrMwiweVivWrHkTcvpcJTjjnoY',
        title: t('Open_Source_NGO_plan'),
      },
    ],
  },
  {
    title: t('wiki'),
    subs: [
      { href: '/wiki', title: t('wiki') },
      { href: '/policy', title: t('policy') },
      { href: '/recipe', title: t('recipe') },
    ],
  },
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
        <Navbar.Brand href="/" className="fw-bolder d-flex align-items-center gap-2">
          <Image width={40} src={DefaultImage} alt={t('open_source_bazaar')} />
          {t('open_source_bazaar')}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            {menu.map(({ href, title, subs }) =>
              subs ? (
                <NavDropdown key={title} title={title}>
                  {subs.map(({ href, title }) => (
                    <NavDropdown.Item key={href} href={href}>
                      {title}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>
              ) : (
                <Nav.Link
                  key={`${href}-${title}`}
                  href={href}
                  className={pathname === `${href}` ? 'fw-bolder text-light' : ''}
                >
                  {title}
                </Nav.Link>
              ),
            )}
          </Nav>

          <LanguageMenu />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
});
