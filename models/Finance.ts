import { ListModel } from 'mobx-restful';

import { ownClient } from './Base';
import { IndexFundSnapshot, IndexFundCategory, IndexRiskLevel } from '../types/finance';

export interface IndexFundFilter {
  category?: IndexFundCategory;
  riskLevel?: IndexRiskLevel;
}

interface IndexFundAPIResponse {
  data: IndexFundSnapshot[];
  meta?: { total?: number };
}

export class IndexFundModel extends ListModel<IndexFundSnapshot, IndexFundFilter> {
  client = ownClient;
  baseURI = 'finance/index-funds';

  constructor() {
    super();
    this.pageSize = 8;
  }

  async loadPage(page = this.pageIndex, perPage = this.pageSize, filter: IndexFundFilter = {}) {
    const search = new URLSearchParams();

    if (filter.category) search.set('category', filter.category);
    if (filter.riskLevel) search.set('riskLevel', filter.riskLevel);

    search.set('limit', String(perPage));

    const query = search.toString();
    const path = query ? `${this.baseURI}?${query}` : this.baseURI;

    const { body } = await this.client.get<IndexFundAPIResponse>(path);

    const data = body?.data || [];
    const totalCount = body?.meta?.total ?? data.length;

    return {
      pageData: data,
      totalCount,
    };
  }
}

export const indexFundStore = new IndexFundModel();
