import { observable } from 'mobx';
import { ListModel } from 'mobx-restful';
import { buildURLData } from 'web-utility';

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

  @observable accessor pageSize = 8;

  async loadPage(page = this.pageIndex, limit = this.pageSize, filter: IndexFundFilter = {}) {
    const { body } = await this.client.get<IndexFundAPIResponse>(
      `${this.baseURI}?${buildURLData({ ...filter, limit })}`,
    );
    const pageData = body?.data || [];
    const totalCount = body?.meta?.total ?? pageData.length;

    return { pageData, totalCount };
  }
}

export const indexFundStore = new IndexFundModel();
