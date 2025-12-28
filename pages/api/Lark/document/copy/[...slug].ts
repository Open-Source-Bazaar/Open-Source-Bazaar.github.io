import { Context } from 'koa';
import { createKoaRouter, withKoaRouter } from 'next-ssr-middleware';

import { safeAPI, verifyJWT } from '../../../core';
import { lark } from '../../core';

export const config = { api: { bodyParser: false } };

const router = createKoaRouter(import.meta.url);

router.post('/:type/:id', safeAPI, verifyJWT, async (context: Context) => {
  const { type, id } = context.params,
    { name, parentToken } = Reflect.get(context.request, 'body');

  context.body = await lark.copyFile(`${type as 'wiki'}/${id}`, name, parentToken);
});

export default withKoaRouter(router);
