import 'core-js/full/array/from-async';

import { HTTPClient } from 'koajax';
import { TableCellAttachment, TableCellMedia, TableCellValue } from 'mobx-lark';

import { LARK_API_HOST } from './configuration';

export const larkClient = new HTTPClient({
  baseURI: LARK_API_HOST,
  responseType: 'json',
});

export function fileURLOf(field: TableCellValue, cache = false) {
  if (!(field instanceof Array) || !field[0]) return field + '';

  const file = field[0] as TableCellMedia | TableCellAttachment;

  let URI = `/api/Lark/file/${'file_token' in file ? file.file_token : file.attachmentToken}/${file.name}`;

  if (cache) URI += '?cache=1';

  return URI;
}
