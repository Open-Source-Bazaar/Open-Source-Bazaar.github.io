import { IndexHistoryPoint } from '../types/finance';

export const TRADING_DAYS_PER_YEAR = 252;

export function computeChangePct(current?: number | null, base?: number | null) {
  if (current == null || base == null || base === 0) return null;

  return (current - base) / base;
}

export function computeOneYearReturn(series: IndexHistoryPoint[]) {
  if (series.length < 2) return null;

  const sorted = [...series].sort((a, b) => a.date.localeCompare(b.date));
  const recent = sorted.slice(-TRADING_DAYS_PER_YEAR);

  if (recent.length < 2) return null;

  const first = recent[0].value;
  const last = recent[recent.length - 1].value;

  if (!first) return null;

  return (last - first) / first;
}

export function computeMaxDrawdown(series: IndexHistoryPoint[]) {
  if (!series.length) return null;

  const sorted = [...series].sort((a, b) => a.date.localeCompare(b.date));

  let peak = sorted[0].value;
  let maxDrawdown = 0;

  sorted.forEach(point => {
    const { value } = point;

    if (value > peak) peak = value;

    if (!peak) return;

    const drawdown = (value - peak) / peak;

    if (drawdown < maxDrawdown) maxDrawdown = drawdown;
  });

  return maxDrawdown || null;
}

export function computeDailyChange(series: IndexHistoryPoint[]) {
  if (series.length < 2) return null;

  const sorted = [...series].sort((a, b) => a.date.localeCompare(b.date));
  const latest = sorted[sorted.length - 1].value;
  const previous = sorted[sorted.length - 2].value;

  return computeChangePct(latest, previous);
}

export function buildSparkline(series: IndexHistoryPoint[], limit = 30) {
  if (!series.length) return [];

  const sorted = [...series].sort((a, b) => a.date.localeCompare(b.date));

  return sorted.slice(-limit);
}
