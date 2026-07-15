import { HTTPClient } from 'koajax';
import {
  BiDataQueryOptions,
  BiDataTable,
  BiSearch,
  normalizeText,
  normalizeTextArray,
  TableCellLink,
  TableCellRelation,
  TableCellText,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';
import { toggle } from 'mobx-restful';
import { countBy, groupBy } from 'web-utility';

import { NGO_API_HOST } from './configuration';
import { SearchableFilter } from './System';
import { observable } from 'mobx';

export type Organization = Record<
  | 'id'
  | 'verified'
  | 'name'
  | 'code'
  | 'entityType'
  | 'tags'
  | 'startDate'
  | 'startYear'
  | 'city'
  | 'email'
  | 'link'
  | 'codeLink'
  | 'website'
  | 'wechatPublic'
  | 'logos'
  | 'description'
  | 'coverageArea'
  | 'services',
  TableCellValue
>;

export type OrganizationStatistic = Record<
  'year' | 'city' | 'entityType' | 'serviceCategory',
  Record<string, number>
>;

export const NGO_BASE_ID = process.env.NEXT_PUBLIC_NGO_BASE_ID!,
  NGO_TABLE_ID = process.env.NEXT_PUBLIC_NGO_TABLE_ID!;

export const sortStatistic = (data: Record<string, number>, sortValue = true) =>
  Object.entries(data)
    .map(([key, count]) => [key, count] as const)
    .sort(([kX, vX], [kY, vY]) => (sortValue ? vY - vX : kY.localeCompare(kX)));

export const ngoLarkClient = new HTTPClient({
  baseURI: NGO_API_HOST,
  responseType: 'json',
});

export class OrganizationModel extends BiDataTable<Organization>() {
  client = ngoLarkClient;

  constructor(appId = NGO_BASE_ID, tableId = NGO_TABLE_ID) {
    super(appId, tableId);
  }

  keyMap = {
    name: '常用名称',
    code: '机构信用代码',
    entityType: '实体类型',
    startDate: '成立时间',
    startYear: '成立年份',
    city: '城市',
    website: '机构官网',
    wechatPublic: '机构微信公众号',
    description: '机构／项目简介',
    coverageArea: '机构／项目辐射范围',
    services: '关于行业类服务对象',
  };

  requiredKeys = ['name', 'entityType', 'city', 'description'] as const;

  queryOptions: BiDataQueryOptions = { text_field_as_array: false };

  @observable
  accessor typeMap: Record<string, Organization[]> = {};

  extractFields({
    fields: { city, entityType, tags, website, codeLink, ...fields },
    ...meta
  }: TableRecord<Organization>) {
    return {
      ...meta,
      ...fields,
      city: (city as TableCellRelation[])?.map(normalizeText),
      entityType: (entityType as TableCellRelation[])?.map(normalizeText),
      tags: (tags as TableCellRelation[])?.map(normalizeText).toString().split(','),
      website: (website as TableCellLink)?.link,
      codeLink: (codeLink as TableCellLink)?.link,
    };
  }

  @toggle('downloading')
  async getYearRange() {
    const yearStore = new OrganizationYearStatisticModel();

    const years = await yearStore.getAll();

    const [{ name: start } = {}] = years.sort(
      ({ name: a }, { name: b }) => (a as number) - (b as number),
    );
    const [{ name: end } = {}] = years.sort(
      ({ name: a }, { name: b }) => (b as number) - (a as number),
    );
    return [start, end] as [number, number];
  }

  async getStatistic(filter?: SearchableFilter<Organization>) {
    const list = await this.getAll(filter);

    const statistic = Object.fromEntries(
      (['city', 'entityType'] as (keyof Organization)[]).map(key => [
        key,
        countBy(list, ({ [key]: value }) => value?.toString() || 'unknown'),
      ]),
    );
    const serviceCategory = countBy(
      list,
      ({ services }) => (services as string[])?.map(service => service).filter(Boolean) || [],
    );
    return (this.statistic = { ...statistic, serviceCategory } as OrganizationStatistic);
  }

  async groupAllByType(filter?: SearchableFilter<Organization>) {
    const allData = await this.getAll(filter);

    return (this.typeMap = groupBy(allData, 'entityType'));
  }
}

export type OrganizationStatisticItem = Record<
  'name' | `${'organization' | 'activity'}Count`,
  TableCellValue
>;

export const NGO_YEAR_STATISTIC_TABLE_ID = process.env.NEXT_PUBLIC_NGO_YEAR_STATISTIC_TABLE_ID!,
  NGO_CITY_STATISTIC_TABLE_ID = process.env.NEXT_PUBLIC_NGO_CITY_STATISTIC_TABLE_ID!,
  NGO_TYPE_STATISTIC_TABLE_ID = process.env.NEXT_PUBLIC_NGO_TYPE_STATISTIC_TABLE_ID!;

export abstract class OrganizationStatisticModel extends BiDataTable<OrganizationStatisticItem>() {
  client = ngoLarkClient;

  requiredKeys = ['name'] as const;

  queryOptions = { text_field_as_array: false };

  countAll = async ([key = 'organizationCount']: (keyof OrganizationStatisticItem)[] = []) => {
    const list = await this.getAll();
    const group = list.map(({ name, [key]: count }) => count && [name, count]).filter(Boolean) as [
      string,
      number,
    ][];

    return Object.fromEntries(group);
  };
}

export class OrganizationYearStatisticModel extends OrganizationStatisticModel {
  constructor(appId = NGO_BASE_ID, tableId = NGO_YEAR_STATISTIC_TABLE_ID) {
    super(appId, tableId);
  }

  keyMap = {
    name: '年份',
    organizationCount: '机构数',
  };
}

export class OrganizationCityStatisticModel extends OrganizationStatisticModel {
  constructor(appId = NGO_BASE_ID, tableId = NGO_CITY_STATISTIC_TABLE_ID) {
    super(appId, tableId);
  }

  keyMap = {
    name: '区县',
    organizationCount: '机构数',
  };
}

export class OrganizationTypeStatisticModel extends OrganizationStatisticModel {
  constructor(appId = NGO_BASE_ID, tableId = NGO_TYPE_STATISTIC_TABLE_ID) {
    super(appId, tableId);
  }

  keyMap = {
    name: '类型',
    organizationCount: '机构数',
  };
}

export class SearchOrganizationModel extends BiSearch<Organization>(OrganizationModel) {
  searchKeys = [
    'name',
    'description',
    'city',
    'email',
    'website',
    'codeLink',
    'wechatPublic',
  ] as const;
}

export default new OrganizationModel();
