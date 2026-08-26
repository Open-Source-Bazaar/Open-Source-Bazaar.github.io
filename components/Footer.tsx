import { observer } from 'mobx-react';
import { useContext } from 'react';
import { Image } from 'react-bootstrap';

import { I18nContext } from '../models/Translation';

export const Footer = observer(() => {
  const { t } = useContext(I18nContext);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mw-100 bg-dark text-white">
      <p className="text-center my-0 py-3">
        <span className="pr-3">
          © 2021{currentYear === 2021 ? '' : `-${currentYear}`} {t('open_source_bazaar')}
        </span>
        <a
          className="flex-fill d-flex justify-content-center align-items-center"
          href="https://vercel.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by
          <span className="mx-2">
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </p>
    </footer>
  );
});
