import { BiDataQueryOptions, BiDataTable, BiSearch, TableCellValue } from 'mobx-lark';

import { larkClient } from './Base';
import { AwardTableId, LarkBitableId } from './configuration';

export type Award = Record<
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
}

export class SearchAwardModel extends BiSearch<Award>(AwardModel) {
  searchKeys = ['awardName', 'nomineeName', 'nomineeDesc', 'reason', 'nominator'];
}
