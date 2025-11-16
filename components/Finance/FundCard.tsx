import { FC, useMemo } from 'react';
import { Badge, Card } from 'react-bootstrap';

import { INDEX_CATEGORY_LABELS, INDEX_RISK_LABELS } from '../../constants/finance';
import styles from '../../styles/Finance.module.scss';
import { IndexFundSnapshot, IndexHistoryPoint } from '../../types/finance';

export interface FundCardProps {
  data: IndexFundSnapshot;
}

const formatNumber = (value: number | null | undefined) =>
  value == null ? '--' : value.toLocaleString('zh-CN', { maximumFractionDigits: 2 });

const formatPercent = (value: number | null | undefined) =>
  value == null ? '--' : `${(value * 100).toFixed(2)}%`;

const valueTone = (value: number | null | undefined) =>
  value == null ? styles.mutedText : value >= 0 ? styles.positiveText : styles.negativeText;

const Sparkline: FC<{ points: IndexHistoryPoint[]; chartId: string }> = ({ points, chartId }) => {
  const { polyline, gradientStops } = useMemo(() => {
    if (!points.length) return { polyline: '', gradientStops: [] as number[] };

    const values = points.map(point => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const delta = max - min || 1;

    const polylinePoints = points
      .map((point, index) => {
        const x = (index / Math.max(points.length - 1, 1)) * 100;
        const y = ((max - point.value) / delta) * 40;

        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ');

    const gradientOffsets = [0, 50, 100];

    return { polyline: polylinePoints, gradientStops: gradientOffsets };
  }, [points]);

  if (!points.length) return <div className={styles.sparklinePlaceholder}>数据准备中</div>;

  const gradientId = `${chartId}-gradient`;

  return (
    <div className={styles.sparkline}>
      <svg viewBox="0 0 100 40" role="img" aria-label="近 60 日走势">
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

export const FundCard: FC<FundCardProps> = ({ data }) => {
  const {
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
  } = data;
  const sparklineId = useMemo(() => `fund-${data.symbol}`, [data.symbol]);

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
                {INDEX_CATEGORY_LABELS[category]}
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
                {INDEX_RISK_LABELS[riskLevel]}
              </Badge>
              {fallback && (
                <Badge bg="secondary" text="light">
                  离线数据
                </Badge>
              )}
            </div>
          </div>
          <small className="text-muted text-end">
            数据源 <br />
            {data.source.historyEndpoint}
          </small>
        </div>

        <p className="text-muted mb-0">{description}</p>

        <div className={`${styles.metricRow} d-flex flex-wrap gap-4 align-items-center`}>
          <div>
            <p className="text-muted mb-1">最新点位</p>
            <span className={styles.metricValue}>{formatNumber(latestValue)}</span>
          </div>
          <div>
            <p className="text-muted mb-1">日涨跌</p>
            <strong className={valueTone(dailyChangePct)}>{formatPercent(dailyChangePct)}</strong>
          </div>
          <div>
            <p className="text-muted mb-1">近 1 年收益</p>
            <strong className={valueTone(oneYearReturnPct)}>
              {formatPercent(oneYearReturnPct)}
            </strong>
          </div>
          <div>
            <p className="text-muted mb-1">最大回撤</p>
            <strong className={valueTone(maxDrawdownPct)}>{formatPercent(maxDrawdownPct)}</strong>
          </div>
        </div>

        <Sparkline points={sparkline} chartId={sparklineId} />

        <div className="d-flex flex-wrap gap-2">
          {tags?.map(tag => (
            <Badge key={tag} bg="light" text="dark" className={styles.tagBadge}>
              {tag}
            </Badge>
          ))}
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">更新于 {updatedAt || '--'}</small>
          <a href={`/finance/${data.symbol}`} className="text-primary fw-semibold">
            查看详情 →
          </a>
        </div>
      </Card.Body>
    </Card>
  );
};
