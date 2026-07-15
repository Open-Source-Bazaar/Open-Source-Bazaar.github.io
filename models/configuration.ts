import { parseCookie } from 'web-utility';

export const isServer = () => typeof window === 'undefined';

export const Name = process.env.NEXT_PUBLIC_SITE_NAME,
  Summary = process.env.NEXT_PUBLIC_SITE_SUMMARY,
  DefaultImage = process.env.NEXT_PUBLIC_LOGO!;

export const {
  CI,
  SMTP_HOST,
  SMTP_PORT = 465,
  SMTP_USER,
  SMTP_PASSWORD,
  VERCEL,
  VERCEL_URL,
  STRAPI_API_TOKEN,
} = process.env;

export const API_Host = isServer()
  ? VERCEL_URL
    ? `https://${VERCEL_URL}`
    : 'http://localhost:3000'
  : globalThis.location.origin;

export const CACHE_HOST = process.env.NEXT_PUBLIC_CACHE_HOST!;

export const STRAPI_API_HOST = process.env.NEXT_PUBLIC_STRAPI_API_HOST!;

export const LARK_API_HOST = `${API_Host}/api/Lark/`;

export const ProxyBaseURL = 'https://bazaar.fcc-cd.dev/proxy';

export const ContactEmail = 'team@fcc-cd.dev';
export const GitHubURL = 'https://github.com/Open-Source-Bazaar/Open-Source-Bazaar.github.io';
export const WeChatURL = 'https://open.weixin.qq.com/qr/code?username=gh_b8b06d05cfa6';

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
  ProjectTableId = process.env.NEXT_PUBLIC_PROJECT_TABLE_ID!,
  AwardTableId = process.env.NEXT_PUBLIC_AWARD_TABLE_ID!;

export const OpenLibraryCatalogURL =
  'https://open-source-bazaar.feishu.cn/share/base/view/shrcnvT0Lyk8LKS8KtPbO9HPPHb';
export const OpenLibraryBorrowFormURL =
  'https://open-source-bazaar.feishu.cn/share/base/form/shrcnNiKwb9ApzFFGI3YkCXDdwe?prefill_%E6%93%8D%E4%BD%9C=%E5%80%9F%E5%85%A5';
export const OpenLibraryHandoffFormURL =
  'https://open-source-bazaar.feishu.cn/share/base/form/shrcnuDb3oOuhMjSaXNIHEPA4Ef?prefill_%E6%93%8D%E4%BD%9C=%E5%80%9F%E5%87%BA';
export const OpenLibraryMembershipFormURL =
  'https://open-source-bazaar.feishu.cn/share/base/form/shrcngQgMrhjTh6ycO1zcaEWZld';
export const OpenLibraryReviewFormURL =
  'https://open-source-bazaar.feishu.cn/share/base/form/shrcnFAX8q7mnywCQOsVnIS5Dwb';
