import { Context } from 'koa';
import { createKoaRouter, withKoaRouter } from 'next-ssr-middleware';
import { AwardModel } from '../../../../models/Award';
import { safeAPI, verifyJWT } from '../../core';

export const config = { api: { bodyParser: true } };

const router = createKoaRouter(import.meta.url);

const EthereumAddressPattern = /^0x[a-fA-F0-9]{40}$/;

router.post('/issue', safeAPI, verifyJWT, async (context: Context) => {
  const { recordId, walletAddress } = (context.request as any).body;

  if (!recordId || !walletAddress) {
    context.throw(400, 'recordId and walletAddress are required');
  }

  if (typeof walletAddress !== 'string' || !EthereumAddressPattern.test(walletAddress)) {
    context.throw(400, 'walletAddress must be a valid Ethereum address');
  }

  // 1. Fetch award and check authorization
  const awardModel = new AwardModel();
  const award = await awardModel.getOne(recordId);

  if (!award) {
    context.throw(404, 'Award record not found');
  }

  const currentUser = (context.state as any).user;
  if (!currentUser) {
    context.throw(401, 'Unauthorized');
  }

  if (
    currentUser.name !== 'Robot' &&
    currentUser.name !== award.nominator &&
    currentUser.name !== award.nomineeName
  ) {
    context.throw(403, 'You do not have permission to issue this award');
  }

  // 2. Idempotency Check
  if (award.transactionHash && award.tokenId) {
    context.body = {
      success: true,
      transactionHash: award.transactionHash as string,
      tokenId: award.tokenId as string,
    };
    return;
  }

  let transactionHash: string;
  let tokenId: string;

  try {
    const mintApiUrl = process.env.NFT_MINT_API || 'https://api.octoken.org/mint';
    const timeoutVal = parseInt(process.env.NFT_MINT_TIMEOUT || '10000', 10);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutVal);

    const response = await fetch(mintApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress, recordId }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    if (!response.ok) {
      throw new Error(`NFT issuance failed with status ${response.status}`);
    }

    const data = await response.json();
    transactionHash = data.transactionHash;
    tokenId = data.tokenId;

    if (!transactionHash || !tokenId) {
      throw new Error('Invalid response from minting service');
    }
  } catch (error) {
    const msg =
      (error as Error).name === 'AbortError'
        ? 'NFT issuance request timed out'
        : (error as Error).message || 'NFT issuance failed';
    return context.throw(502, msg);
  }

  await awardModel.updateOne(
    {
      transactionHash,
      tokenId,
      walletAddress,
    },
    recordId,
  );

  context.body = { success: true, transactionHash, tokenId };
});

export default withKoaRouter(router);
