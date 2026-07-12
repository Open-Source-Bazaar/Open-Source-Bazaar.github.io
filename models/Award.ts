import { BiDataQueryOptions, BiDataTable, BiSearch, TableCellValue, TableRecord, normalizeTextArray } from 'mobx-lark';

import { LarkBase, larkClient } from './Base';
import { AwardTableId, LarkBitableId } from './configuration';

export type AwardStatus = 'nominated' | 'reviewing' | 'voting' | 'awarded' | 'declined';

export type Award = LarkBase &
  Record<
    | 'awardName'
    | `nominee${'Name' | 'Desc' | 'Email' | 'GitHub'}`
    | 'videoUrl'
    | 'reason'
    | 'nominator'
    | 'nominatorEmail'
    | 'status'
    | 'votes'
    | 'tokenId'
    | 'tokenTxHash'
    | 'awardedAt',
    TableCellValue
  >;

export class AwardModel extends BiDataTable<Award>() {
  client = larkClient;

  queryOptions: BiDataQueryOptions = { text_field_as_array: false };

  constructor(appId = LarkBitableId, tableId = AwardTableId) {
    super(appId, tableId);
  }
}

export class SearchAwardModel extends BiSearch<Award>(AwardModel) {
  searchKeys = [
    'awardName',
    'nomineeName',
    'nomineeDesc',
    'nomineeGitHub',
    'reason',
    'nominator',
  ];
}
