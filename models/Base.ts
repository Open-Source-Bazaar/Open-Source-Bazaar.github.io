import 'core-js/full/array/from-async';

import { HTTPClient } from 'koajax';
import { githubClient } from 'mobx-github';
import { TableCellAttachment, TableCellMedia, TableCellValue } from 'mobx-lark';
import { DataObject } from 'mobx-restful';
import { isEmpty } from 'web-utility';

import {
  API_Host,
  GithubToken,
  isServer,
  ProxyBaseURL,
  LARK_API_HOST,
} from './configuration';

export const ownClient = new HTTPClient({
  baseURI: `${API_Host}/api/`,
  responseType: 'json',
});

if (!isServer()) githubClient.baseURI = `${API_Host}/api/GitHub/`;

githubClient.use(({ request }, next) => {
  if (GithubToken)
    request.headers = {
      authorization: `Bearer ${GithubToken}`,
      ...request.headers,
    };
  return next();
});

export { githubClient };

export const githubRawClient = new HTTPClient({
  baseURI: `${ProxyBaseURL}/raw.githubusercontent.com/`,
  responseType: 'arraybuffer',
});

export interface GithubSearchData<T> {
  total_count: number;
  incomplete_results: boolean;
  items: T[];
}

export const makeGithubSearchCondition = (queryMap: DataObject) =>
  Object.entries(queryMap)
    .filter(([, value]) => !isEmpty(value))
    .map(([key, value]) => `${key}:${value}`)
    .join(' ');

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
