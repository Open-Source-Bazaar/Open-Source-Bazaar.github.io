import { CSSProperties, FC, useContext, useEffect, useState } from 'react';
import { Alert, CloseButton } from 'react-bootstrap';

import { normalizeText, TableCellText } from 'mobx-lark';

import { Activity, ActivityModel } from '../../models/Activity';
import { I18nContext } from '../../models/Translation';
import styles from './PromoBar.module.less';

export const PromoBar: FC = () => {
  const { t } = useContext(I18nContext);
  const [isVisible, setIsVisible] = useState(true);
  const [barStyle, setBarStyle] = useState<CSSProperties>();
  const [activity, setActivity] = useState<Activity>();

  useEffect(() => {
    const navbar = document.querySelector('nav');
    const syncTopBarOffset = () => {
      const navbarHeight = navbar?.getBoundingClientRect().height || 56;

      setBarStyle({
        '--promo-bar-gap': `${Math.max(navbarHeight - 56, 0)}px`,
        '--promo-bar-offset': `${navbarHeight}px`,
      } as CSSProperties);
    };
    const observer =
      typeof ResizeObserver === 'undefined' || !navbar
        ? undefined
        : new ResizeObserver(syncTopBarOffset);

    syncTopBarOffset();
    if (navbar) observer?.observe(navbar);
    window.addEventListener('resize', syncTopBarOffset);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', syncTopBarOffset);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const model = new ActivityModel();
        const data = await model.getOne('Labor-AI-hackathon-2026');
        setActivity(data);
      } catch (err) {
        console.error('Failed to load activity:', err);
      }
    })();
  }, []);

  const closeBar = () => setIsVisible(false);

  if (!isVisible) return null;

  return (
    <Alert
      role="banner"
      className={`${styles.promoBar} d-flex flex-column w-100 text-white mb-0 p-0 border-0 rounded-0`}
      aria-label={t('home_hackathon_top_bar_aria_label')}
      style={barStyle}
    >
      <div className={`${styles.promoBarInner} d-flex align-items-center mx-auto px-3`}>
        <Alert.Link
          className={`${styles.promoBarContent} d-flex justify-content-center align-items-center text-decoration-none`}
          href={activity ? ActivityModel.getLink(activity) : '/hackathon/Labor-AI-hackathon-2026'}
        >
          <span className={`${styles.promoBarText} d-flex align-items-baseline`}>
            <strong>{t('home_hackathon_top_bar_title')}</strong>
            <span>{t('home_hackathon_top_bar_description')}</span>
          </span>
          <span className={styles.promoBarEventName}>
            {activity ? normalizeText(activity.name as TableCellText) : 'Labor AI Hackathon 2026'}
          </span>
          <span className={styles.promoBarAction}>{t('home_hackathon_top_bar_action')}</span>
        </Alert.Link>
        <CloseButton
          className={`${styles.promoBarClose} p-0 rounded`}
          variant="white"
          aria-label={t('home_hackathon_top_bar_close')}
          onClick={closeBar}
        />
      </div>
    </Alert>
  );
};
