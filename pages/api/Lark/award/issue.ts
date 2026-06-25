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

  let transactionHash: string;
  let tokenId: string;

  try {
    const mintApiUrl = process.env.NFT_MINT_API || 'https://api.octoken.org/mint';
    const response = await fetch(mintApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress, recordId }),
    });

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
    return context.throw(502, (error as Error).message || 'NFT issuance failed');
  }

  const awardModel = new AwardModel();
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
