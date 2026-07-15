import { NextRequest } from 'next/server';

import { githubClient } from '../../../../models/Base';
import {
  forwardedHeadersOf,
  requestBodyOf,
  safeRoute,
  verifyJWT,
} from '../../../../lib/api/route-helper';

const handler = safeRoute(async (request: NextRequest, { params }: { params: { slug: string[] } }) => {
  const { slug } = params;

  if (request.method !== 'GET') verifyJWT(request);

  const path = `${slug.join('/')}${request.nextUrl.search}`;
  const { status, body } = await githubClient.request<unknown>({
    method: request.method,
    path,
    headers: forwardedHeadersOf(request),
    body: await requestBodyOf(request),
  });

  if (request.method === 'HEAD') return new Response(null, { status });
  if (body instanceof ArrayBuffer) return new Response(body, { status });

  return Response.json(body ?? {}, { status });
});

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const HEAD = handler;
export const OPTIONS = handler;
