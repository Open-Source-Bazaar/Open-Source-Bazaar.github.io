import { NextRequest } from 'next/server';

import { safeRoute, verifyJWT } from '../../../../../../lib/api/route-helper';
import { lark } from '../../../../../../pages/api/Lark/core';

export const GET = safeRoute(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    verifyJWT(request);

    const { id } = params;
    const type = request.nextUrl.searchParams.get('type');

    await lark.getAccessToken();

    const documentId = type !== 'wiki' ? id : (await lark.wiki2drive(id)).obj_token;

    return Response.json(await lark.getBiTableSchema(documentId));
  },
);
