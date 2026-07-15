import { verify } from 'jsonwebtoken';
import { HTTPError } from 'koajax';
import { NextRequest } from 'next/server';

import { LarkAppMeta } from '../../models/configuration';

const cookieValueOf = (cookie: string, key: string) =>
  cookie
    .split(';')
    .map(item => item.trim())
    .find(item => item.startsWith(`${key}=`))
    ?.slice(key.length + 1);

export const verifyJWT = (request: NextRequest) => {
  const token = request.cookies.get('token')?.value || cookieValueOf(request.headers.get('cookie') || '', 'token');

  if (!token) throw new Error('JWT token is required');

  return verify(token, LarkAppMeta.secret);
};

export const requestBodyOf = async (request: NextRequest) => {
  if (request.method === 'GET' || request.method === 'HEAD') return;

  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('application/json')) return request.json();
  if (contentType.includes('application/x-www-form-urlencoded'))
    return Object.fromEntries(new URLSearchParams(await request.text()));
  if (contentType.includes('text/')) return request.text();

  const body = await request.arrayBuffer();

  return body.byteLength ? body : undefined;
};

export const forwardedHeadersOf = (
  request: NextRequest,
  hidden = ['host', 'authorization', 'content-length'],
) => {
  const hiddenSet = new Set(hidden.map(key => key.toLowerCase()));

  return Object.fromEntries(
    [...request.headers.entries()].filter(([key]) => !hiddenSet.has(key.toLowerCase())),
  );
};

const normalizedBodyOf = async (error: HTTPError) => {
  let body = error.response.body;

  if (body instanceof ArrayBuffer)
    try {
      body = JSON.parse(new TextDecoder().decode(body));
    } catch {
      // no-op
    }

  return body;
};

export const safeRoute =
  <P>(handler: (request: NextRequest, context: P) => Promise<Response> | Response) =>
  async (request: NextRequest, context: P) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof HTTPError) {
        const body = await normalizedBodyOf(error);

        console.error(JSON.stringify(body, null, 2));

        return Response.json(body, {
          status: error.response.status,
          statusText: error.message,
        });
      }

      console.error(error);

      return Response.json(
        { message: (error as Error).message },
        { status: Number((error as { status?: number })?.status) || 400 },
      );
    }
  };
