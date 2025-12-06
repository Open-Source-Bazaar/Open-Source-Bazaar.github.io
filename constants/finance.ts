import { IndexFundCategory, IndexRiskLevel } from '../types/finance';
import { I18nKey } from '../models/Translation';

export const INDEX_CATEGORY_LABEL_KEYS: Record<IndexFundCategory, I18nKey> = {
  broad: 'index_category_broad',
  sector: 'index_category_sector',
  theme: 'index_category_theme',
};

export const INDEX_RISK_LABEL_KEYS: Record<IndexRiskLevel, I18nKey> = {
  conservative: 'index_risk_conservative',
  balanced: 'index_risk_balanced',
  aggressive: 'index_risk_aggressive',
};
