import { fileTypeFromStream } from 'file-type';
import MIME from 'mime';
import { NextRequest } from 'next/server';
import { parseJSON } from 'web-utility';

import { CACHE_HOST } from '../../../../../../models/configuration';
import { safeRoute } from '../../../../../../lib/api/route-helper';
import { lark } from '../../../../../../lib/lark';

const handler = safeRoute(
  async (request: NextRequest, { params }: { params: Promise<{ id: string; name: string }> }) => {
    const { id, name } = await params;

    if (request.nextUrl.searchParams.get('cache'))
      return Response.redirect(new URL(request.nextUrl.pathname, CACHE_HOST));

    const token = await lark.getAccessToken();

    const response = await fetch(lark.client.baseURI + `drive/v1/medias/${id}/download`, {
      headers: { Authorization: 'Bearer ' + token },
    });
    const { ok, status, headers, body } = response;

    if (!ok)
      return Response.json(parseJSON(await response.text()), {
        status,
      });

    const mime = headers.get('Content-Type');

    if (!body) return new Response(null, { status, headers });

    const [stream1, stream2] = body.tee();

    const contentType =
      !mime || mime.startsWith('application/octet-stream')
        ? MIME.getType(name + '') || (await fileTypeFromStream(stream1))?.mime
        : mime;

    const responseHeaders = new Headers();

    responseHeaders.set('Content-Type', contentType || 'application/octet-stream');
    responseHeaders.set('Content-Disposition', headers.get('Content-Disposition') || '');
    responseHeaders.set('Content-Length', headers.get('Content-Length') || '');

    return new Response(request.method === 'GET' ? stream2 : null, {
      status,
      headers: responseHeaders,
    });
  },
);

export const GET = handler;
export const HEAD = handler;
