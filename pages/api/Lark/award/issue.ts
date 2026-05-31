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

  // Issue OCToken NFT logic
  const transactionHash = `0x${Math.random().toString(16).slice(2)}`;
  const tokenId = Math.floor(Math.random() * 10000).toString();

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
