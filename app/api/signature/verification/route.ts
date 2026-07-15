import { safeRoute } from '../../../../lib/api/route-helper';

export const POST = safeRoute(async request => {
  const { algorithm, publicKey, value, signature } = (await request.json()) as {
    algorithm: string;
    publicKey: string;
    value: string;
    signature: string;
  };

  const rawAlgorithm = JSON.parse(atob(algorithm)),
    rawPublicKey = JSON.parse(atob(publicKey)),
    rawSignature = Buffer.from(signature, 'hex'),
    encodedValue = new TextEncoder().encode(value);

  const key = await crypto.subtle.importKey('jwk', rawPublicKey, rawAlgorithm, true, ['verify']);
  const verified = await crypto.subtle.verify(rawAlgorithm, key, rawSignature, encodedValue);

  return Response.json({}, { status: verified ? 200 : 400 });
});
