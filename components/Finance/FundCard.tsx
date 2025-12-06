import { FC, useContext, useMemo } from 'react';
import { Badge, Card } from 'react-bootstrap';

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
  value != null ? (value >= 0 ? styles.positiveText : styles.negativeText) : styles.mutedText;

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
  const updatedAtISO = updatedAt ? new Date(updatedAt).toJSON() : undefined;

  return (
    <Card className={`${styles.fundCard} h-100`}>
      <Card.Body className="d-flex flex-column gap-3">
        <div className={`${styles.header} d-flex justify-content-between align-items-start`}>
          <div>
            <h3 className="h5 mb-1">{displayName}</h3>
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <Badge bg="light" text="dark">
                {t(INDEX_CATEGORY_LABEL_KEYS[category])}
              </Badge>
              <Badge
                bg={
                  riskLevel === 'aggressive'
                    ? 'danger'
                    : riskLevel === 'balanced'
                      ? 'warning'
                      : 'success'
                }
              >
                {t(INDEX_RISK_LABEL_KEYS[riskLevel])}
              </Badge>
              {fallback && (
                <Badge bg="secondary" text="light">
                  {t('offline_data')}
                </Badge>
              )}
            </div>
          </div>
          <small className="text-muted text-end">
            {t('data_source')} <br />
            {source.historyEndpoint}
          </small>
        </div>

        <p className="text-muted mb-0">{description}</p>

        <dl className={`${styles.metric} d-flex flex-wrap gap-4 align-items-center`}>
          <dt className="text-muted mb-1">{t('index_metric_latest_value')}</dt>
          <dd className={styles.value}>{formatNumber(latestValue, currentLanguage)}</dd>

          <dt className="text-muted mb-1">{t('index_metric_daily_change')}</dt>
          <dd className={valueTone(dailyChangePct)}>{formatPercent(dailyChangePct)}</dd>

          <dt className="text-muted mb-1">{t('index_metric_one_year_return')}</dt>
          <dd className={valueTone(oneYearReturnPct)}>{formatPercent(oneYearReturnPct)}</dd>

          <dt className="text-muted mb-1">{t('index_metric_max_drawdown')}</dt>
          <dd className={valueTone(maxDrawdownPct)}>{formatPercent(maxDrawdownPct)}</dd>
        </dl>

        <SparkLine points={sparkline} chartId={sparklineId} />

        <ul className="list-unstyled m-0 d-flex flex-wrap gap-2">
          {tags?.map(tag => (
            <Badge key={tag} as="li" bg="light" text="dark" className={styles.tagBadge}>
              {tag}
            </Badge>
          ))}
        </ul>

        <time className="small text-muted" dateTime={updatedAtISO}>
          {t('updated_at')} {updatedAt || '--'}
        </time>

        <a href={`/finance/${symbol}`} className="text-primary fw-semibold">
          {t('view_details')}
        </a>
      </Card.Body>
    </Card>
  );
};
