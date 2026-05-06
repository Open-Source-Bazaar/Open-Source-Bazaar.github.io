import {
  BiDataQueryOptions,
  BiDataTable,
  BiSearch,
  BiTableSchema,
  LarkPageData,
  makeSimpleFilter,
  normalizeText,
  TableCellLink,
  TableCellRelation,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';
import { toggle } from 'mobx-restful';
import { HTTPError } from 'koajax';
import { buildURLData } from 'web-utility';

import { LarkBase, larkClient } from './Base';
import { ActivityTableId, LarkBitableId } from './configuration';

export type Activity = LarkBase &
  Record<
    | 'name'
    | 'alias'
    | 'type'
    | 'tags'
    | 'summary'
    | 'image'
    | 'cardImage'
    | `${'start' | 'end'}Time`
    | 'city'
    | 'location'
    | 'host'
    | 'link'
    | 'liveLink'
    | `database${'' | 'Schema'}`,
    TableCellValue
  > & {
    databaseSchema: BiTableSchema;
  };

export class ActivityModel extends BiDataTable<Activity>() {
  client = larkClient;

  queryOptions: BiDataQueryOptions = { text_field_as_array: false };

  constructor(appId = LarkBitableId, tableId = ActivityTableId) {
    super(appId, tableId);
  }

  static getLink = ({
    id,
    type,
    alias,
    link,
    database,
  }: Pick<Activity, 'id' | 'type' | 'alias' | 'link' | 'database'>) =>
    database ? `/${type?.toString().toLowerCase() || 'activity'}/${alias || id}` : link + '';

  extractFields({
    id,
    fields: { host, city, link, database, databaseSchema, ...fields },
  }: TableRecord<Activity>) {
    return {
      ...fields,
      id: id!,
      host: (host as TableCellRelation[])?.map(normalizeText),
      city: (city as TableCellRelation[])?.map(normalizeText),
      link: (link as TableCellLink)?.link,
      database: (database as TableCellLink)?.link,
      databaseSchema: databaseSchema && JSON.parse(databaseSchema as string),
    };
  }

  @toggle('downloading')
  async getOneByAlias(alias: string) {
    const path = `${this.baseURI}?${buildURLData({ filter: makeSimpleFilter({ alias }, '=') })}`;

    const { body } = await this.client.get<LarkPageData<TableRecord<Activity>>>(path);

    const [item] = body!.data!.items || [];

    if (!item)
      throw new HTTPError(
        `Activity "${alias}" is not found`,
        { method: 'GET', path },
        { status: 404, statusText: 'Not found', headers: {} },
      );
    return (this.currentOne = this.extractFields(item));
  }

  @toggle('downloading')
  async getOne(id: string) {
    try {
      await super.getOne(id);
    } catch {
      await this.getOneByAlias(id);
    }
    return this.currentOne;
  }
}

export class SearchActivityModel extends BiSearch<Activity>(ActivityModel) {
  searchKeys = ['name', 'alias', 'type', 'tags', 'summary', 'city', 'location', 'host'];
}
