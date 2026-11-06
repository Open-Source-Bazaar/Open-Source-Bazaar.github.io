import {
  Container,
  Drawer,
  Image,
  Navbar,
  NavbarBrand,
  NavbarNav,
  NavbarToggler,
  NavItem,
  NavLink,
} from 'idea-react';
import { action, observable } from 'mobx';
import { textJoin } from 'mobx-i18n';
import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { AnchorHTMLAttributes, Component, FC } from 'react';

import { DefaultImage } from '../../models/configuration';
import { i18n, I18nContext } from '../../models/Translation';
import { SearchBar } from './SearchBar';

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
      { href: '/project', title: t('self_developed_projects') },
      { href: '/search/project', title: t('bazaar_projects') },
      { href: '/issue', title: 'GitHub issues' },
      { href: '/license-filter', title: t('license_filter') },
      { href: '/finance', title: t('finance_page_title') },
    ],
  },
  {
    title: t('hackathon'),
    subs: [
      {
        href: 'https://github.com/Open-Source-Bazaar/Git-Hackathon-scaffold',
        title: textJoin('GitHub', t('hackathon')),
      },
      {
        href: '/search/activity?keywords=Hackathon',
        title: textJoin('Lark', t('hackathon')),
      },
      {
        href: 'https://test.hackathon.fcc-cd.dev/open-source',
        title: textJoin(t('hackathon'), t('open_source_projects')),
      },
    ],
  },
  { href: '/bounty', title: t('bounty') },
  {
    title: t('NGO'),
    subs: [
      {
        href: 'https://open-source-bazaar.feishu.cn/wiki/VGrMwiweVivWrHkTcvpcJTjjnoY',
        title: t('Open_Source_NGO_plan'),
      },
      { href: '/NGO', title: t('China_NGO_DB') },
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
  {
    href: '/open-library',
    title: t('open_library'),
  },
];

export interface MainNavigatorProps {
  menu?: MenuItem[];
}

interface MainNavigatorViewProps extends MainNavigatorProps {
  pathname: string;
}

@observer
class MainNavigatorView extends Component<MainNavigatorViewProps, typeof i18n> {
  static contextType = I18nContext;

  declare context: typeof i18n;

  @observable accessor open = false;

  toggle = action(() => (this.open = !this.open));

  hide = action(() => (this.open = false));

  render() {
    const { t } = this.context;
    const menu = this.props.menu ?? topNavBarMenu(this.context);

    return (
      <Navbar theme="dark" className="fixed-top bg-body" expand="lg">
        <Container>
          <NavbarBrand href="/" className="fw-bolder d-flex align-items-center gap-3 text-nowrap">
            <Image width={40} src={DefaultImage} alt={t('open_source_bazaar')} />
            {t('open_source_bazaar')}
          </NavbarBrand>
          <NavbarToggler
            expanded={this.open}
            aria-label={t('open_source_bazaar')}
            onClick={this.toggle}
          />
          <Drawer
            className="w-100"
            bodyClassName="d-flex flex-column lg:flex-row lg:align-items-center"
            title={t('open_source_bazaar')}
            responsive="lg"
            placement="end"
            open={this.open}
            onDismiss={this.hide}
          >
            <NavbarNav className="flex-fill me-auto my-3 lg:my-0 lg:flex-row">
              {menu.map(({ href, title, subs }) =>
                subs ? (
                  <NavItem key={title} as="li">
                    <details>
                      <summary className="nav-link">{title}</summary>
                      <ul className="list-unstyled ms-5 lg:ms-0">
                        {subs.map(
                          ({ href: subHref, title: subTitle }) =>
                            subHref && (
                              <li key={subHref}>
                                <NavLink href={subHref} onClick={this.hide}>
                                  {subTitle}
                                </NavLink>
                              </li>
                            ),
                        )}
                      </ul>
                    </details>
                  </NavItem>
                ) : (
                  href && (
                    <NavItem key={`${href}-${title}`} as="li">
                      <NavLink
                        href={href}
                        active={this.props.pathname === href}
                        className={`text-nowrap ${
                          this.props.pathname === href ? 'fw-bolder fg-white' : ''
                        }`}
                        onClick={this.hide}
                      >
                        {title}
                      </NavLink>
                    </NavItem>
                  )
                ),
              )}
            </NavbarNav>

            <div className="d-flex justify-content-around gap-5">
              <SearchBar />
              <LanguageMenu />
            </div>
          </Drawer>
        </Container>
      </Navbar>
    );
  }
}

export const MainNavigator: FC<MainNavigatorProps> = props => {
  const { pathname } = useRouter();

  return <MainNavigatorView {...props} pathname={pathname} />;
};
