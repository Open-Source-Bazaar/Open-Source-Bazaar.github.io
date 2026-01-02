import { Context } from 'koa';
import { LarkDocumentPathType } from 'mobx-lark';
import { createKoaRouter, withKoaRouter } from 'next-ssr-middleware';

import { safeAPI, verifyJWT } from '../../../core';
import { lark } from '../../core';

export const config = { api: { bodyParser: false } };

const router = createKoaRouter(import.meta.url);

router.post('/:type/:id', safeAPI, verifyJWT, async (context: Context) => {
  const { type, id } = context.params,
    { name, parentToken, ownerType, ownerId } = Reflect.get(context.request, 'body');

  const copiedFile =
    type === 'wiki'
      ? await lark.copyFile(`${type as 'wiki'}/${id}`, name, parentToken)
      : await lark.copyFile(`${type as LarkDocumentPathType}/${id}`, name, parentToken);

  const newId = 'token' in copiedFile ? copiedFile.token : copiedFile.obj_token;

  if (ownerType && ownerId)
    try {
      await lark.driveFileStore.transferOwner(type, newId, {
        member_type: ownerType,
        member_id: ownerId,
      });
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
    }
  context.body = copiedFile;
});

export default withKoaRouter(router);
