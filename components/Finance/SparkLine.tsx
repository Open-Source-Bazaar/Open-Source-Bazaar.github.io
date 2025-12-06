import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';

import { i18n, I18nContext } from '../../models/Translation';
import { IndexHistoryPoint } from '../../types/finance';
import styles from './SparkLine.module.less';

export interface SparkLineProps {
  points: IndexHistoryPoint[];
  chartId: string;
}

@observer
export class SparkLine extends ObservedComponent<SparkLineProps, typeof i18n> {
  static contextType = I18nContext;

  @computed
  get chartData() {
    const { points } = this.observedProps;

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
  }

  renderContent() {
    const { t } = this.observedContext,
      { chartId } = this.observedProps,
      { polyline, gradientStops } = this.chartData;
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
  }

  render() {
    const { t } = this.observedContext,
      { points } = this.props;

    return points.length ? (
      this.renderContent()
    ) : (
      <div className={styles.sparkline}>
        <div className={styles.placeholder}>{t('data_preparing')}</div>
      </div>
    );
  }
}
