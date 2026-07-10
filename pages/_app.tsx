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
        <Footer />
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

        <Footer />
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
      </I18nContext.Provider>
    );
  }
}
