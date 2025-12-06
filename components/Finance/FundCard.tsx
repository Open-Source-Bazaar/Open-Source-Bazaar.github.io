import { FC, useContext, useMemo } from 'react';
import { Badge, Card } from 'react-bootstrap';

import { INDEX_CATEGORY_LABEL_KEYS, INDEX_RISK_LABEL_KEYS } from '../../constants/finance';
import { I18nContext } from '../../models/Translation';
import { IndexFundSnapshot, IndexHistoryPoint } from '../../types/finance';
import styles from './Finance.module.less';

export interface FundCardProps {
  data: IndexFundSnapshot;
}

const formatNumber = (value?: number | null) =>
  value != null ? value.toLocaleString('zh-CN', { maximumFractionDigits: 2 }) : '--';

const formatPercent = (value?: number | null) =>
  value != null ? `${(value * 100).toFixed(2)}%` : '--';

const valueTone = (value?: number | null) =>
  value != null ? (value >= 0 ? styles.positiveText : styles.negativeText) : styles.mutedText;

const Sparkline: FC<{ points: IndexHistoryPoint[]; chartId: string }> = ({ points, chartId }) => {
  const { t } = useContext(I18nContext);

  const { polyline, gradientStops } = useMemo(() => {
    if (!points.length) return { polyline: '', gradientStops: [] as number[] };

    const values = points.map(({ value }) => value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const delta = max - min || 1;

    const polylinePoints = points
      .map(({ value }, index, { length }) => {
        const x = (index / Math.max(length - 1, 1)) * 100;
        const y = ((max - value) / delta) * 40;

        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ');

    const gradientOffsets = [0, 50, 100];

    return { polyline: polylinePoints, gradientStops: gradientOffsets };
  }, [points]);
  const gradientId = `${chartId}-gradient`;

  return (
    <div className={styles.sparkline}>
      <svg viewBox="0 0 100 40" role="img" aria-label={t('index_sparkline_60d_label')}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            {gradientStops.map(offset => (
              <stop
                key={offset}
                offset={`${offset}%`}
                stopColor="var(--bs-primary)"
                stopOpacity="0.5"
              />
            ))}
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={polyline}
        />
      </svg>
    </div>
  );
};

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
  const { t } = useContext(I18nContext);
  const sparklineId = useMemo(() => `fund-${symbol}`, [symbol]);
  const updatedAtISO = updatedAt ? new Date(updatedAt).toJSON() : undefined;

  return (
    <Card className={`${styles.fundCard} h-100`}>
      <Card.Body className="d-flex flex-column gap-3">
        <div
          className={`${styles.fundCardHeader} d-flex justify-content-between align-items-start`}
        >
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

        <dl className={`${styles.metricRow} d-flex flex-wrap gap-4 align-items-center`}>
          <dt className="text-muted mb-1">{t('index_metric_latest_value')}</dt>
          <dd className={styles.metricValue}>{formatNumber(latestValue)}</dd>

          <dt className="text-muted mb-1">{t('index_metric_daily_change')}</dt>
          <dd className={valueTone(dailyChangePct)}>{formatPercent(dailyChangePct)}</dd>

          <dt className="text-muted mb-1">{t('index_metric_one_year_return')}</dt>
          <dd className={valueTone(oneYearReturnPct)}>{formatPercent(oneYearReturnPct)}</dd>

          <dt className="text-muted mb-1">{t('index_metric_max_drawdown')}</dt>
          <dd className={valueTone(maxDrawdownPct)}>{formatPercent(maxDrawdownPct)}</dd>
        </dl>

        {sparkline.length ? (
          <Sparkline points={sparkline} chartId={sparklineId} />
        ) : (
          <div className={styles.sparklinePlaceholder}>{t('data_preparing')}</div>
        )}

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
