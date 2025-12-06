export type IndexFundCategory = 'broad' | 'sector' | 'theme';

export type IndexRiskLevel = 'conservative' | 'balanced' | 'aggressive';

export interface IndexFundDefinition {
  /**
   * AkShare 指数代码，形如 sh000300 / sz399006
   */
  symbol: string;
  /**
   * 页面展示名称，如「沪深 300」
   */
  displayName: string;
  /**
   * 页面描述/卖点
   */
  description?: string;
  category: IndexFundCategory;
  riskLevel: IndexRiskLevel;
  tags?: string[];
}

export interface IndexHistoryPoint {
  date: string;
  value: number;
}

export interface IndexFundSnapshot extends IndexFundDefinition {
  latestValue: number | null;
  dailyChangePct: number | null;
  oneYearReturnPct: number | null;
  maxDrawdownPct: number | null;
  updatedAt: string | null;
  /**
   * 最近 N 天的点位序列，用于 sparkline
   */
  sparkline: IndexHistoryPoint[];
  source: {
    historyEndpoint: string;
  };
  fallback?: boolean;
}
