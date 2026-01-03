import { Context } from 'koa';
import { createKoaRouter, withKoaRouter } from 'next-ssr-middleware';

import { safeAPI, verifyJWT } from '../../../core';
import { lark } from '../../core';

export const config = { api: { bodyParser: false } };

const router = createKoaRouter(import.meta.url);

router.get('/:id', safeAPI, verifyJWT, async (context: Context) => {
  const { id } = context.params,
    { type } = context.query;

  await lark.getAccessToken();

  const documentId = type !== 'wiki' ? id : (await lark.wiki2drive(id)).obj_token;

  context.body = await lark.getBiTableSchema(documentId);
});

export default withKoaRouter(router);
