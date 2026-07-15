import { NextRequest } from 'next/server';

import { safeRoute, verifyJWT } from '../../../../../../lib/api/route-helper';
import { lark } from '../../../../../../lib/lark';

export const GET = safeRoute(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    verifyJWT(request);

    const { id } = await params;
    const type = request.nextUrl.searchParams.get('type');

    await lark.getAccessToken();

    const documentId = type !== 'wiki' ? id : (await lark.wiki2drive(id)).obj_token;

    return Response.json(await lark.getBiTableSchema(documentId));
  },
);
