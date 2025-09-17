import { observable } from 'mobx';
import { toggle } from 'mobx-restful';
import { Base, Searchable, SearchableFilter, StrapiListModel } from 'mobx-strapi';
import { countBy, groupBy } from 'web-utility';

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

  sort = { establishedDate: 'asc' } as const;

  dateKeys = ['establishedDate'] as const;

  searchKeys = ['name', 'description', 'coverageArea'] as const;

  @observable
  accessor statistic = {} as OrganizationStatistic;

  @observable
  accessor typeMap: Record<string, Organization[]> = {};

  @toggle('downloading')
  async getYearRange() {
    const now = Date.now(),
      organizationStore = new OrganizationModel();

    const [{ establishedDate: start } = {}] = await organizationStore.getList({}, 1, 1);

    Object.assign(organizationStore, { sort: { establishedDate: 'desc' } });

    const [{ establishedDate: end } = {}] = await organizationStore.getList({}, 1, 1);

    const startYear = new Date(start || now).getFullYear(),
      endYear = new Date(end || now).getFullYear();

    return [startYear, endYear] as const;
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
        services?.map(({ serviceCategory }) => serviceCategory!).filter(Boolean) || [],
    );
    return (this.statistic = { ...statistic, serviceCategory } as OrganizationStatistic);
  }

  async groupAllByType(filter?: SearchableFilter<Organization & Base>) {
    const allData = await this.getAll(filter);

    return (this.typeMap = groupBy(allData, 'entityType'));
  }
}
export default new OrganizationModel();
