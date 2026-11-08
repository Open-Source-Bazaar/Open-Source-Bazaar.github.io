import { Badge, Card, CardBody, Time } from 'idea-react';
import { FC, useContext, useMemo } from 'react';

import { INDEX_CATEGORY_LABEL_KEYS, INDEX_RISK_LABEL_KEYS } from '../../constants/finance';
import { I18nContext } from '../../models/Translation';
import { IndexFundSnapshot } from '../../types/finance';
import styles from './Finance.module.less';
import { SparkLine } from './SparkLine';

const formatNumber = (value?: number | null, locale = 'zh-CN') =>
  value != null ? value.toLocaleString(locale, { maximumFractionDigits: 2 }) : '--';

const formatPercent = (value?: number | null) =>
  value != null ? `${(value * 100).toFixed(2)}%` : '--';

const valueTone = (value?: number | null) =>
  value != null ? (value >= 0 ? 'fg-success' : 'fg-danger') : 'fg-secondary';

export const FundCard: FC<IndexFundSnapshot> = ({
  symbol,
  displayName,
  category,
  riskLevel,
  latestValue,
  dailyChangePct,
  oneYearReturnPct,
  maxDrawdownPct,
  tags,
  sparkline,
  updatedAt,
  fallback,
  description,
  source,
}) => {
  const { currentLanguage, t } = useContext(I18nContext);
  const sparklineId = useMemo(() => `fund-${symbol}`, [symbol]);

  return (
    <Card className={`${styles.fundCard} h-100`}>
      <CardBody className="d-flex flex-column gap-5">
        <div className={`${styles.header} d-flex justify-content-between align-items-start`}>
          <div>
            <h3 className="h5 mb-1">{displayName}</h3>
            <div className="d-flex flex-wrap gap-3 align-items-center">
              <Badge theme="secondary">{t(INDEX_CATEGORY_LABEL_KEYS[category])}</Badge>
              <Badge
                theme={
                  riskLevel === 'aggressive'
                    ? 'danger'
                    : riskLevel === 'balanced'
                      ? 'warning'
                      : 'success'
                }
              >
                {t(INDEX_RISK_LABEL_KEYS[riskLevel])}
              </Badge>
              {fallback && <Badge theme="secondary">{t('offline_data')}</Badge>}
            </div>
          </div>
          <small className="fg-secondary text-end">
            {t('data_source')} <br />
            {source.historyEndpoint}
          </small>
        </div>

        <p className="fg-secondary mb-0">{description}</p>

        <dl className={`${styles.metric} d-flex flex-wrap gap-7 align-items-center`}>
          <dt className="fg-secondary mb-1">{t('index_metric_latest_value')}</dt>
          <dd className={styles.value}>{formatNumber(latestValue, currentLanguage)}</dd>

          <dt className="fg-secondary mb-1">{t('index_metric_daily_change')}</dt>
          <dd className={valueTone(dailyChangePct)}>{formatPercent(dailyChangePct)}</dd>

          <dt className="fg-secondary mb-1">{t('index_metric_one_year_return')}</dt>
          <dd className={valueTone(oneYearReturnPct)}>{formatPercent(oneYearReturnPct)}</dd>

          <dt className="fg-secondary mb-1">{t('index_metric_max_drawdown')}</dt>
          <dd className={valueTone(maxDrawdownPct)}>{formatPercent(maxDrawdownPct)}</dd>
        </dl>

        <SparkLine points={sparkline} chartId={sparklineId} />

        <ul className="list-unstyled m-0 d-flex flex-wrap gap-3">
          {tags?.map(tag => (
            <Badge key={tag} as="li" theme="secondary" className={styles.tagBadge}>
              {tag}
            </Badge>
          ))}
        </ul>

        <p className="small fg-secondary mb-0">
          {t('updated_at')}{' '}
          {updatedAt ? <Time dateTime={updatedAt} format="YYYY-MM-DD HH:mm:ss" /> : '--'}
        </p>

        <a href={`/finance/${symbol}`} className="fg-primary fw-semibold">
          {t('view_details')}
        </a>
      </CardBody>
    </Card>
  );
};
