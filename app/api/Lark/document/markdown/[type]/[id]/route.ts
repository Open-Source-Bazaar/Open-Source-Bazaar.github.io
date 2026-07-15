import { NextRequest } from 'next/server';

import { safeRoute, verifyJWT } from '../../../../../../../lib/api/route-helper';
import { lark } from '../../../../../../../lib/lark';

export const GET = safeRoute(
  async (request: NextRequest, { params }: { params: Promise<{ type: string; id: string }> }) => {
    verifyJWT(request);

    const { type, id } = await params;
    const markdown = await lark.downloadMarkdown(`${type}/${id}`);

    return new Response(markdown, {
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    });
  },
);
