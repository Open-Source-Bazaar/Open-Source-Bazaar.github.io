import { createKoaRouter, withKoaRouter } from 'next-ssr-middleware';

import { safeAPI, verifyJWT } from '../../../core';
import { lark } from '../../core';

const router = createKoaRouter(import.meta.url);

router.get('/:type/:id', safeAPI, verifyJWT, async context => {
  const { type, id } = context.params;

  const markdown = await lark.downloadMarkdown(`${type}/${id}`);

  context.set('Content-Type', 'text/markdown; charset=utf-8');
  context.body = markdown;
});

export default withKoaRouter(router);
