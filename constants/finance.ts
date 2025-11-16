import { IndexFundCategory, IndexRiskLevel } from '../types/finance';

export const INDEX_CATEGORY_LABELS: Record<IndexFundCategory, string> = {
  broad: '宽基',
  sector: '行业',
  theme: '主题',
};

export const INDEX_RISK_LABELS: Record<IndexRiskLevel, string> = {
  conservative: '保守',
  balanced: '稳健',
  aggressive: '进取',
};
