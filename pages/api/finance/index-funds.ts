import { Context } from 'koa';
import { createKoaRouter, withKoaRouter } from 'next-ssr-middleware';
import { formatDate } from 'web-utility';

import { requestAkShareJSON } from '../../../lib/akshare';
import {
  buildSparkline,
  computeDailyChange,
  computeMaxDrawdown,
  computeOneYearReturn,
} from '../../../lib/finance';
import type {
  IndexFundDefinition,
  IndexFundSnapshot,
  IndexHistoryPoint,
} from '../../../types/finance';
import { safeAPI } from '../core';

const CACHE_TTL_MS = 60_000;
const HISTORY_ENDPOINT = 'stock_zh_index_daily_em';
const HISTORY_SPARKLINE_POINTS = 60;
const FALLBACK_HISTORY_POINTS = 180;

const PRESETS: IndexFundDefinition[] = [
  {
    symbol: 'sh000300',
    displayName: '沪深 300',
    description: '覆盖沪深两市 300 家大型蓝筹企业，代表 A 股核心资产。',
    category: 'broad',
    riskLevel: 'balanced',
    tags: ['宽基', '蓝筹'],
  },
  {
    symbol: 'sh000905',
    displayName: '中证 500',
    description: '中盘成长代表指数，覆盖 500 家中型企业，波动略高。',
    category: 'broad',
    riskLevel: 'balanced',
    tags: ['宽基', '成长'],
  },
  {
    symbol: 'sh000852',
    displayName: '中证 1000',
    description: '中小盘指数，覆盖 1000 家公司，适合进取型定投。',
    category: 'broad',
    riskLevel: 'aggressive',
    tags: ['宽基', '中小盘'],
  },
  {
    symbol: 'sh000016',
    displayName: '上证 50',
    description: '上海证券交易所市值前 50 大蓝筹股，偏防御。',
    category: 'broad',
    riskLevel: 'conservative',
    tags: ['宽基', '大盘'],
  },
  {
    symbol: 'sz399006',
    displayName: '创业板指',
    description: '创业板代表指数，成长性与波动并存。',
    category: 'theme',
    riskLevel: 'aggressive',
    tags: ['成长', '科技'],
  },
  {
    symbol: 'sz399330',
    displayName: '深证 100',
    description: '深交所龙头企业代表，兼具成长与稳健。',
    category: 'broad',
    riskLevel: 'balanced',
    tags: ['宽基', '成长'],
  },
  {
    symbol: 'sz399997',
    displayName: '中证白酒',
    description: '消费龙头行业指数，收益弹性大，行业集中度高。',
    category: 'sector',
    riskLevel: 'aggressive',
    tags: ['消费', '行业'],
  },
  {
    symbol: 'sh000932',
    displayName: '中证消费',
    description: '覆盖食品饮料、家电等消费龙头，稳健增长属性明显。',
    category: 'sector',
    riskLevel: 'balanced',
    tags: ['消费', '行业'],
  },
];

interface AkShareDailyRecord {
  date?: string;
  日期?: string;
  close?: number;
  收盘?: number;
}

interface AkShareListPayload<T> {
  data?: T[];
  result?: T[];
}

let cache: { timestamp: number; data: IndexFundSnapshot[] } | null = null;

const fallbackBasePrice: Record<string, number> = {
  sh000300: 3500,
  sh000905: 5000,
  sh000852: 6200,
  sh000016: 2900,
  sz399006: 1800,
  sz399330: 1900,
  sz399997: 8000,
  sh000932: 7000,
};

function unwrapAkShareRecords(payload: unknown): AkShareDailyRecord[] {
  if (Array.isArray(payload)) return payload as AkShareDailyRecord[];

  if (payload && typeof payload === 'object') {
    const { data, result } = payload as AkShareListPayload<AkShareDailyRecord>;

    if (Array.isArray(data)) return data;
    if (Array.isArray(result)) return result;
  }
  throw new Error('Unexpected AkShare payload format');
}

const normalizeHistory = (records: AkShareDailyRecord[]): IndexHistoryPoint[] =>
  records
    .map(({ date, 日期, close, 收盘 }) => {
      const normalizedDate = (date || 日期 || '').slice(0, 10);
      const value = Number(close ?? 收盘);
      if (normalizedDate && !Number.isNaN(value)) return { date: normalizedDate, value };
    })
    .filter((item): item is IndexHistoryPoint => !!item)
    .sort((a, b) => a.date.localeCompare(b.date));

const formatAkShareDate = (input: Date) => formatDate(input, 'YYYYMMDD');

async function fetchHistorySeries(symbol: string) {
  const end = new Date();
  const start = new Date();

  start.setFullYear(start.getFullYear() - 5);

  const payload = await requestAkShareJSON<unknown>(HISTORY_ENDPOINT, {
    symbol,
    start_date: formatAkShareDate(start),
    end_date: formatAkShareDate(end),
  });

  const history = normalizeHistory(unwrapAkShareRecords(payload));

  return history.slice(-720);
}

function seededRandom(symbol: string) {
  let seed = Array.from(symbol).reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return () => {
    seed = (seed * 9301 + 49297) % 233280;

    return seed / 233280;
  };
}

function buildSyntheticSparkline(symbol: string, points = FALLBACK_HISTORY_POINTS) {
  const random = seededRandom(symbol);
  const today = new Date();
  const base = fallbackBasePrice[symbol] ?? 3000 + random() * 2000;

  let value = base;

  const series: IndexHistoryPoint[] = [];

  for (let offset = points - 1; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - (points - 1 - offset));

    const noise = (random() - 0.5) * 0.04; // +/- 2%
    value = Math.max(0, value * (1 + noise));

    series.push({
      date: date.toISOString().slice(0, 10),
      value: Number(value.toFixed(2)),
    });
  }

  return series;
}

function buildSyntheticSnapshot(preset: IndexFundDefinition): IndexFundSnapshot {
  const sparkline = buildSyntheticSparkline(preset.symbol);

  const { value: latestValue = null, date: updatedAt = null } = (sparkline.at(-1) ||
    {}) as Partial<IndexHistoryPoint>;

  return {
    ...preset,
    latestValue,
    dailyChangePct: computeDailyChange(sparkline),
    oneYearReturnPct: computeOneYearReturn(sparkline),
    maxDrawdownPct: computeMaxDrawdown(sparkline),
    sparkline: buildSparkline(sparkline, HISTORY_SPARKLINE_POINTS),
    updatedAt,
    source: { historyEndpoint: `${HISTORY_ENDPOINT} (fallback)` },
    fallback: true,
  };
}

async function buildSnapshot(preset: IndexFundDefinition): Promise<IndexFundSnapshot> {
  try {
    const history = await fetchHistorySeries(preset.symbol);
    const latestValue = history.at(-1)?.value ?? null;

    return {
      ...preset,
      latestValue,
      dailyChangePct: computeDailyChange(history),
      oneYearReturnPct: computeOneYearReturn(history),
      maxDrawdownPct: computeMaxDrawdown(history),
      sparkline: buildSparkline(history, HISTORY_SPARKLINE_POINTS),
      updatedAt: history.at(-1)?.date ?? null,
      source: { historyEndpoint: HISTORY_ENDPOINT },
    };
  } catch (error) {
    console.warn(`[Finance] Using synthetic data for ${preset.symbol}:`, (error as Error).message);

    return buildSyntheticSnapshot(preset);
  }
}

async function loadSnapshots() {
  const snapshots = await Promise.all(PRESETS.map(buildSnapshot));

  cache = {
    timestamp: Date.now(),
    data: snapshots,
  };

  return snapshots;
}

async function getCachedSnapshots() {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) return cache.data;

  return loadSnapshots();
}

function applyFilters(
  data: IndexFundSnapshot[],
  {
    category,
    riskLevel,
    limit,
  }: Partial<Record<'category' | 'riskLevel' | 'limit', string | string[]>>,
) {
  const parsedCategory = Array.isArray(category) ? category[0] : category;
  const parsedRisk = Array.isArray(riskLevel) ? riskLevel[0] : riskLevel;
  const parsedLimit = Number(Array.isArray(limit) ? limit[0] : limit);

  let filtered = data;

  if (parsedCategory) filtered = filtered.filter(item => item.category === parsedCategory);
  if (parsedRisk) filtered = filtered.filter(item => item.riskLevel === parsedRisk);
  if (!Number.isNaN(parsedLimit) && parsedLimit > 0) filtered = filtered.slice(0, parsedLimit);

  return filtered;
}

export const config = { api: { bodyParser: false } };

const router = createKoaRouter(import.meta.url);

router.get('/', safeAPI, async (context: Context) => {
  const snapshots = await getCachedSnapshots();

  const filtered = applyFilters(snapshots, context.query);
  const cached =
    cache != null &&
    Date.now() - cache.timestamp < CACHE_TTL_MS &&
    filtered.length === snapshots.length;

  context.set('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  context.body = {
    data: filtered,
    meta: {
      total: snapshots.length,
      returned: filtered.length,
      cached,
      source: HISTORY_ENDPOINT,
    },
  };
});

export default withKoaRouter(router);
