import { observable } from 'mobx';
import { Base, Searchable, SearchableFilter, StrapiListModel } from 'mobx-strapi';
import { changeMonth, countBy, formatDate, groupBy } from 'web-utility';

import { Organization } from '@open-source-bazaar/china-ngo-database';
import { strapiClient } from './Base';

export type OrganizationStatistic = Record<
  'coverageArea' | 'locale' | 'entityType' | 'serviceCategory',
  Record<string, number>
>;

export const sortStatistic = (data: Record<string, number>, sortValue = true) =>
  Object.entries(data)
    .map(([key, count]) => [key, count] as const)
    .sort(([kX, vX], [kY, vY]) => (sortValue ? vY - vX : kY.localeCompare(kX)));

export class OrganizationModel extends Searchable<Organization & Base>(StrapiListModel) {
  baseURI = 'organizations';
  client = strapiClient;

  searchKeys = ['name', 'description', 'coverageArea'] as const;

  @observable
  accessor statistic = {} as OrganizationStatistic;

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

  async getStatistic(filter?: SearchableFilter<Organization & Base>) {
    const list = await this.getAll(filter);

    const statistic = Object.fromEntries(
      (['coverageArea', 'locale', 'entityType'] as (keyof Organization)[]).map(key => [
        key,
        countBy(list, ({ [key]: value }) => value?.toString() || 'unknown'),
      ]),
    );
    const serviceCategory = countBy(
      list,
      ({ services }) =>
        services
          ?.map(({ serviceCategory }) => serviceCategory!)
          .flat()
          .filter(Boolean) || [],
    );
    return (this.statistic = { ...statistic, serviceCategory } as OrganizationStatistic);
  }

  async groupAllByTags(filter?: SearchableFilter<Organization & Base>) {
    const allData = await this.getAll(filter);

    return (this.categoryMap = groupBy(
      allData,
      ({ services }) =>
        services
          ?.map(({ serviceCategory }) => serviceCategory!)
          .flat()
          .filter(Boolean) || [],
    ));
  }
}
export default new OrganizationModel();
