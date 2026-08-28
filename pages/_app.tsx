import '../styles/globals.css';

import { HTTPError } from 'koajax';
import { configure } from 'mobx';
import { enableStaticRendering, observer } from 'mobx-react';
import App, { AppContext } from 'next/app';
import Head from 'next/head';

import { Footer } from '../components/Footer';
import { MainNavigator } from '../components/Navigator/MainNavigator';
import { LibraryNavbar } from '../components/open-library/Navbar';
import { PageContent } from '../components/PageContent';
import { isServer } from '../models/configuration';
import { createI18nStore, I18nContext, I18nProps, loadSSRLanguage } from '../models/Translation';

configure({ enforceActions: 'never' });

enableStaticRendering(isServer());

@observer
export default class CustomApp extends App<I18nProps> {
  static async getInitialProps(context: AppContext) {
    return {
      ...(await App.getInitialProps(context)),
      ...(await loadSSRLanguage(context.ctx)),
    };
  }

  i18nStore = createI18nStore(this.props.language, this.props.languageMap);

  componentDidMount() {
    window.addEventListener('unhandledrejection', ({ reason }) => {
      const { message, response } = reason as HTTPError;
      const { statusText, body } = response || {};

      const tips = body?.message || statusText || message;

      if (tips) alert(tips);
    });
  }

  renderOpenLibraryFrame() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <LibraryNavbar />
        <main className="py-5">
          <Component {...pageProps} />
        </main>
      </>
    );
  }

  renderSiteFrame(isArticlePage: boolean) {
    const { Component, pageProps } = this.props;
    const content = <Component {...pageProps} />;

    return (
      <>
        <MainNavigator />

        <div className="mt-5 pt-2">
          {isArticlePage ? <PageContent>{content}</PageContent> : content}
        </div>
      </>
    );
  }

  render() {
    const { Component, pageProps, router } = this.props,
      { t } = this.i18nStore;
    const { asPath } = router;
    const isArticlePage = asPath.startsWith('/article/') || asPath.startsWith('/policy/'),
      isActivityPage = asPath.startsWith('/hackathon'),
      isOpenLibraryPath = asPath.startsWith('/open-library');
    const footerProps = isOpenLibraryPath
      ? {
          description: t('footer_description'),
          quickLinks: [
            { href: '/open-library/books', icon: '📖', label: t('catalog_footer') },
            { href: '/open-library/how-to-borrow', icon: 'ℹ️', label: t('how_to_borrow') },
          ],
        }
      : {
          description: t('site_footer_description'),
          quickLinks: [
            { href: '/', icon: '🏠', label: t('home_footer') },
            { href: '/article/about', icon: 'ℹ️', label: t('about_us_footer') },
            { href: '/article/join-us', icon: '🤝', label: t('join_us') },
          ],
        };

    return (
      <I18nContext.Provider value={this.i18nStore}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <title>{t('open_source_bazaar')}</title>
        </Head>

        {isActivityPage ? (
          <Component {...pageProps} />
        ) : isOpenLibraryPath ? (
          this.renderOpenLibraryFrame()
        ) : (
          this.renderSiteFrame(isArticlePage)
        )}
        <Footer {...footerProps} />
      </I18nContext.Provider>
    );
  }
}
