import { IndexHistoryPoint } from '../types/finance';

export const TRADING_DAYS_PER_YEAR = 252;

export const computeChangePct = (current?: number | null, base?: number | null): number | null =>
  current == null || base == null || base === 0 ? null : (current - base) / base;

export function computeOneYearReturn(series: IndexHistoryPoint[]) {
  if (series.length < 2) return null;

  const sorted = [...series].sort((a, b) => a.date.localeCompare(b.date));
  const recent = sorted.slice(-TRADING_DAYS_PER_YEAR);

  if (recent.length < 2) return null;

  const [{ value: first }] = recent;
  const { value: last } = recent.at(-1)!;

  return computeChangePct(last, first);
}

export function computeMaxDrawdown(series: IndexHistoryPoint[]) {
  if (!series.length) return null;

  const sorted = [...series].sort((a, b) => a.date.localeCompare(b.date));

  let peak = sorted[0].value;
  let maxDrawdown = 0;

  for (const { value } of sorted) {
    if (value > peak) peak = value;

    if (!peak) break;

    const drawdown = computeChangePct(value, peak);

    if (drawdown != null && drawdown < maxDrawdown) maxDrawdown = drawdown;
  }

  return maxDrawdown;
}

export function computeDailyChange(series: IndexHistoryPoint[]) {
  if (series.length < 2) return null;

  const [{ value: previous }, { value: latest }] = series.slice(-2);

  return computeChangePct(latest, previous);
}

export const buildSparkline = (series: IndexHistoryPoint[], limit = 30) =>
  [...series].sort((a, b) => a.date.localeCompare(b.date)).slice(-limit);
