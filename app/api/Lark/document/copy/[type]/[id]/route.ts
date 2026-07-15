import { LarkDocumentPathType } from 'mobx-lark';
import { NextRequest } from 'next/server';

import { safeRoute, verifyJWT } from '../../../../../../../lib/api/route-helper';
import { lark } from '../../../../../../../pages/api/Lark/core';

export const POST = safeRoute(
  async (request: NextRequest, { params }: { params: { type: string; id: string } }) => {
    verifyJWT(request);

    const { type, id } = params;
    const { name, parentToken, ownerType, ownerId } = (await request.json()) as {
      name: string;
      parentToken?: string;
      ownerType?: string;
      ownerId?: string;
    };

    const copiedFile =
      type === 'wiki'
        ? await lark.copyFile(`${type as 'wiki'}/${id}`, name, parentToken)
        : await lark.copyFile(`${type as LarkDocumentPathType}/${id}`, name, parentToken);

    const newId = 'token' in copiedFile ? copiedFile.token : copiedFile.node_token;

    if (ownerType && ownerId)
      try {
        await lark.driveFileStore.transferOwner(type, newId, {
          member_type: ownerType,
          member_id: ownerId,
        });
      } catch (error) {
        console.error(JSON.stringify(error, null, 2));
      }

    return Response.json(copiedFile);
  },
);
