import { parseCookie } from 'web-utility';

export const isServer = () => typeof window === 'undefined';

export const Name = process.env.NEXT_PUBLIC_SITE_NAME,
  Summary = process.env.NEXT_PUBLIC_SITE_SUMMARY,
  DefaultImage = process.env.NEXT_PUBLIC_LOGO!;

export const { VERCEL, VERCEL_URL, STRAPI_API_TOKEN } = process.env;

export const API_Host = isServer()
  ? VERCEL_URL
    ? `https://${VERCEL_URL}`
    : 'http://localhost:3000'
  : globalThis.location.origin;

export const CACHE_HOST = process.env.NEXT_PUBLIC_CACHE_HOST!;

export const STRAPI_API_HOST = process.env.NEXT_PUBLIC_STRAPI_API_HOST!;

export const LARK_API_HOST = `${API_Host}/api/Lark/`;

export const ProxyBaseURL = 'https://bazaar.fcc-cd.dev/proxy';

export const GithubToken = (globalThis.document && parseCookie().token) || process.env.GH_PAT;

export const LarkAppMeta = {
  host: process.env.NEXT_PUBLIC_LARK_API_HOST,
  id: process.env.NEXT_PUBLIC_LARK_APP_ID!,
  secret: process.env.LARK_APP_SECRET!,
};
const { hostname, pathname } = new URL(process.env.NEXT_PUBLIC_LARK_WIKI_URL!);

export const LarkWikiDomain = hostname;
export const LarkWikiId = pathname.split('/').pop()!;

export const LarkBitableId = process.env.NEXT_PUBLIC_LARK_BITABLE_ID!,
  ActivityTableId = process.env.NEXT_PUBLIC_ACTIVITY_TABLE_ID!,
  ProjectTableId = process.env.NEXT_PUBLIC_PROJECT_TABLE_ID!;
