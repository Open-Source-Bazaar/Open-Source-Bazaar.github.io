import { IndexFundCategory, IndexRiskLevel } from '../types/finance';
import zhCN from '../translation/zh-CN';

export type FinanceLabelKey = keyof typeof zhCN;

export const INDEX_CATEGORY_LABEL_KEYS: Record<IndexFundCategory, FinanceLabelKey> = {
  broad: 'index_category_broad',
  sector: 'index_category_sector',
  theme: 'index_category_theme',
};

export const INDEX_RISK_LABEL_KEYS: Record<IndexRiskLevel, FinanceLabelKey> = {
  conservative: 'index_risk_conservative',
  balanced: 'index_risk_balanced',
  aggressive: 'index_risk_aggressive',
};
