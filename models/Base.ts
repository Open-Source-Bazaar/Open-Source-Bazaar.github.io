import 'core-js/full/array/from-async';

import { HTTPClient } from 'koajax';

export const isServer = () => typeof window === 'undefined';

const VercelHost = process.env.VERCEL_URL,
  GithubToken = process.env.GITHUB_TOKEN;

const API_Host = isServer()
  ? VercelHost
    ? `https://${VercelHost}`
    : 'http://localhost:3000'
  : globalThis.location.origin;

export const larkClient = new HTTPClient({
  baseURI: `${API_Host}/api/Lark/`,
  responseType: 'json',
});
