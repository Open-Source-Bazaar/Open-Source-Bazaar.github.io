import { fileTypeFromBuffer } from 'file-type';
import { NextRequest } from 'next/server';
import { githubClient } from 'mobx-github';

import { forwardedHeadersOf, requestBodyOf, safeRoute } from '../../../../../lib/api/route-helper';

const handler = safeRoute(
  async (request: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) => {
    const { slug } = await params;

    const path = `https://raw.githubusercontent.com/${slug.join('/')}${request.nextUrl.search}`;
    const method = request.method as 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    const { status, body } = await githubClient.request<ArrayBuffer>({
      method,
      path,
      // Keep authorization header for private raw GitHub content access.
      headers: forwardedHeadersOf(request, ['host', 'content-length']),
      body: await requestBodyOf(request),
      responseType: 'arraybuffer',
    });
    const { mime } = (body && (await fileTypeFromBuffer(body))) || {};

    return new Response(request.method === 'HEAD' ? null : body, {
      status,
      headers: { 'Content-Type': mime || 'application/octet-stream' },
    });
  },
);

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const HEAD = handler;
export const OPTIONS = handler;
