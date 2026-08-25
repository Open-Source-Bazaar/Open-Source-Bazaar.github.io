import {
  BiDataQueryOptions,
  BiDataTable,
  BiSearch,
  TableCellLink,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';

import { LarkBase, larkClient } from './Base';
import { LarkBitableId, ProjectTableId } from './configuration';

export type Project = LarkBase &
  Record<
    | 'name'
    | 'type'
    | 'sourceLink'
    | 'link'
    | 'license'
    | 'languages'
    | 'tags'
    | 'summary'
    | 'logo'
    | 'status'
    | 'reason',
    TableCellValue
  >;

export class ProjectModel extends BiDataTable<Project>() {
  client = larkClient;

  queryOptions: BiDataQueryOptions = { text_field_as_array: false };

  constructor(appId = LarkBitableId, tableId = ProjectTableId) {
    super(appId, tableId);
  }

  extractFields({
    fields: { sourceLink, link, languages, tags, ...fields },
    ...meta
  }: TableRecord<Project>) {
    return {
      ...meta,
      ...fields,
      sourceLink: (sourceLink as TableCellLink)?.link,
      link: (link as TableCellLink)?.link,
      languages: languages?.toString().split(/\s*,\s*/) || [],
      tags: tags?.toString().split(/\s*,\s*/) || [],
    };
  }
}

export class SearchProjectModel extends BiSearch<Project>(ProjectModel) {
  searchKeys = [
    'name',
    'type',
    'sourceLink',
    'link',
    'license',
    'languages',
    'tags',
    'summary',
    'status',
    'reason',
  ];
}
