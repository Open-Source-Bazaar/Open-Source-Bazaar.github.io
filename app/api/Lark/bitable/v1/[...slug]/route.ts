import { NextRequest } from 'next/server';

import {
  forwardedHeadersOf,
  requestBodyOf,
  safeRoute,
} from '../../../../../../lib/api/route-helper';
import { lark } from '../../../../../../lib/lark';

const handler = safeRoute(
  async (request: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) => {
    const { slug } = await params;

    await lark.getAccessToken();

    const method = request.method as 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    const { status, body } = await lark.client.request({
      method,
      path: `bitable/v1/${slug.join('/')}${request.nextUrl.search}`,
      headers: forwardedHeadersOf(request),
      body: await requestBodyOf(request),
    });

    if (request.method === 'HEAD') return new Response(null, { status });
    if (body instanceof ArrayBuffer) return new Response(body, { status });

    return Response.json(body ?? {}, { status });
  },
);

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const HEAD = handler;
export const OPTIONS = handler;
