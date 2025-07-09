import '../styles/globals.css';
import '../styles/open-library.css';

import { HTTPError } from 'koajax';
import { configure } from 'mobx';
import { enableStaticRendering, observer } from 'mobx-react';
import App, { AppContext } from 'next/app';
import Head from 'next/head';
import { Image } from 'react-bootstrap';

import { MainNavigator } from '../components/Navigator/MainNavigator';
import { PageContent } from '../components/PageContent';
import { isServer } from '../models/configuration';
import {
  createI18nStore,
  I18nContext,
  I18nProps,
  loadSSRLanguage,
} from '../models/Translation';

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

  render() {
    const { Component, pageProps, router } = this.props,
      { t } = this.i18nStore;
    const thisFullYear = new Date().getFullYear();

    // 检查是否是 Open Library 路径
    const isOpenLibraryPath = router.route.startsWith('/open-library');

    return (
      <I18nContext.Provider value={this.i18nStore}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <title>{t('open_source_bazaar')}</title>
        </Head>

        <MainNavigator />

        {/* 根据路径决定是否使用 PageContent 包装和 margin */}
        {isOpenLibraryPath ? (
          // Open Library 路径直接渲染内容，不使用 PageContent 和额外的 margin
          <Component {...pageProps} />
        ) : (
          <div className="mt-5 pt-2">
            {router.route.startsWith('/article/') ? (
              <PageContent>
                <Component {...pageProps} />
              </PageContent>
            ) : (
              <Component {...pageProps} />
            )}
          </div>
        )}

        {/* 只在非 Open Library 路径显示主站页脚 */}
        {!isOpenLibraryPath && (
          <footer className="mw-100 bg-dark text-white">
            <p className="text-center my-0 py-3">
              <span className="pr-3">
                2021{thisFullYear === 2021 ? '' : `-${thisFullYear}`}{' '}
                {t('open_source_bazaar')}
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
        )}
      </I18nContext.Provider>
    );
  }
}
