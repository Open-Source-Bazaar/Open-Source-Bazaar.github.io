import {
  BiDataQueryOptions,
  BiDataTable,
  BiSearch,
  TableCellLink,
  TableCellRelation,
  TableCellUser,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';

import { larkClient } from './Base';
import { AwardTableId, LarkBitableId } from './configuration';

// cspell:ignore bilibili

const bilibiliLinkOf = (value: TableCellValue) => {
  const { link = '', text = '' } = (value || {}) as Partial<TableCellLink>,
    rawValue = `${link} ${text}`.trim() || value?.toString() || '';

  return (
    rawValue.match(/https:\/\/(?:[\w-]+\.)?bilibili\.com\/\S+|https:\/\/b23\.tv\/\S+/i)?.[0] ||
    rawValue
  );
};

const relationCountOf = (value: TableCellValue) => {
  if (!(value instanceof Array)) return value;

  return value.reduce(
    (count, relation) =>
      count + (((relation as TableCellRelation)?.record_ids || []) as string[]).length,
    0,
  );
};

export type Award = Record<
  | 'id'
  | 'awardName'
  | `nominee${'Name' | 'Desc'}`
  | 'videoUrl'
  | 'reason'
  | 'nominator'
  | 'createdAt'
  | 'votes',
  TableCellValue
>;

export class AwardModel extends BiDataTable<Award>() {
  client = larkClient;

  queryOptions: BiDataQueryOptions = { text_field_as_array: false };

  constructor(appId = LarkBitableId, tableId = AwardTableId) {
    super(appId, tableId);
  }

  extractFields({
    id,
    created_time,
    fields: { videoUrl, nominator, votes, createdAt, ...fields },
  }: TableRecord<Award>) {
    return {
      ...fields,
      id,
      createdAt: createdAt ?? created_time,
      nominator: (nominator as TableCellUser)?.name || nominator,
      videoUrl: bilibiliLinkOf(videoUrl),
      votes: relationCountOf(votes),
    };
  }
}

export class SearchAwardModel extends BiSearch<Award>(AwardModel) {
  searchKeys = ['awardName', 'nomineeName', 'nomineeDesc', 'reason', 'nominator'];
}
