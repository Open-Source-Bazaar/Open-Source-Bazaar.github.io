import { createKoaRouter, withKoaRouter } from 'next-ssr-middleware';

import { safeAPI } from '../core';

export const config = { api: { bodyParser: false } };

const router = createKoaRouter(import.meta.url);

router.post('/verification', safeAPI, async context => {
  const { algorithm, publicKey, value, signature } = Reflect.get(context.request, 'body');

  const rawAlgorithm = JSON.parse(atob(algorithm)),
    rawPublicKey = JSON.parse(atob(publicKey)),
    rawSignature = Buffer.from(signature, 'hex'),
    encodedValue = new TextEncoder().encode(value);

  const key = await crypto.subtle.importKey('jwk', rawPublicKey, rawAlgorithm, true, ['verify']);
  const verified = await crypto.subtle.verify(rawAlgorithm, key, rawSignature, encodedValue);

  context.status = verified ? 200 : 400;
  context.body = {};
});

export default withKoaRouter(router);
