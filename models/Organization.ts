import { observable } from 'mobx';
import { Base, Searchable, SearchableFilter, StrapiListModel } from 'mobx-strapi';
import { changeMonth, formatDate, groupBy } from 'web-utility';

import { Organization } from '@open-source-bazaar/china-ngo-database';
import { strapiClient } from './Base';

export type OrganizationStatistic = Record<
  'coverageArea' | 'locale' | 'entityType',
  Record<string, number>
>;

export class OrganizationModel extends Searchable<Organization & Base>(StrapiListModel) {
  baseURI = 'organizations';
  client = strapiClient;

  searchKeys = ['name', 'description', 'coverageArea'] as const;

  @observable
  accessor categoryMap: Record<string, Organization[]> = {};

  makeFilter(
    pageIndex: number,
    pageSize: number,
    { keywords, ...filter }: SearchableFilter<Organization & Base>,
  ) {
    if (keywords) return super.makeFilter(pageIndex, pageSize, { keywords, ...filter });

    const meta = super.makeFilter(pageIndex, pageSize, filter);

    const { establishedDate } = filter;

    const timeRangeFilter =
      establishedDate?.length === 4
        ? { $gte: `${establishedDate}-01-01`, $lt: `${+establishedDate + 1}-01-01` }
        : establishedDate?.length === 7
          ? {
              $gte: `${establishedDate}-01`,
              $lte: `${formatDate(changeMonth(establishedDate, 1), 'YYYY-MM')}-01`,
            }
          : {};
    return { ...meta, filters: { ...meta.filters, establishedDate: timeRangeFilter } };
  }

  async groupAllByTags() {
    const allData = await this.getAll();

    return (this.categoryMap = groupBy(
      allData,
      ({ services }) => services?.flatMap(({ serviceCategory }) => serviceCategory!) || [],
    ));
  }
}
export default new OrganizationModel();
