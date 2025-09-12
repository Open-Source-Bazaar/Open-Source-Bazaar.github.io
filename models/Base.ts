import 'core-js/full/array/from-async';

import { HTTPClient } from 'koajax';
import { githubClient } from 'mobx-github';
import { DataObject } from 'mobx-restful';
import { isEmpty } from 'web-utility';

import {
  API_Host,
  GithubToken,
  isServer,
  ProxyBaseURL,
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

// Strapi client for China NGO Database
export const strapiClient = new HTTPClient({
  baseURI: 'https://china-ngo-db.onrender.com/api/',
  responseType: 'json',
});
