import {
  BiDataQueryOptions,
  BiDataTable,
  BiSearch,
  normalizeText,
  TableCellLink,
  TableCellRelation,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';

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
  >;

export class ActivityModel extends BiDataTable<Activity>() {
  client = larkClient;

  queryOptions: BiDataQueryOptions = { text_field_as_array: false };

  constructor(appId = LarkBitableId, tableId = ActivityTableId) {
    super(appId, tableId);
  }

  static getLink = ({
    id,
    alias,
    link,
    database,
  }: Pick<Activity, 'id' | 'alias' | 'link' | 'database'>) =>
    database ? `/activity/${alias || id}` : link + '';

  extractFields({ id, fields: { host, city, link, database, ...fields } }: TableRecord<Activity>) {
    return {
      ...fields,
      id: id!,
      host: (host as TableCellRelation[])?.map(normalizeText),
      city: (city as TableCellRelation[])?.map(normalizeText),
      link: (link as TableCellLink)?.link,
      database: (database as TableCellLink)?.link,
    };
  }
}

export class SearchActivityModel extends BiSearch<Activity>(ActivityModel) {
  searchKeys = ['name', 'alias', 'type', 'tags', 'summary', 'city', 'location', 'host'];
}
