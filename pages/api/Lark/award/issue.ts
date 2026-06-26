import { Context } from 'koa';
import { createKoaRouter, withKoaRouter } from 'next-ssr-middleware';
import { AwardModel } from '../../../../models/Award';
import { safeAPI, verifyJWT } from '../../core';

export const config = { api: { bodyParser: true } };

const router = createKoaRouter(import.meta.url);

const EthereumAddressPattern = /^0x[a-fA-F0-9]{40}$/;

const getUserIds = (field: any): string[] => {
  if (!field) return [];
  if (Array.isArray(field)) {
    return field.map(u => (typeof u === 'object' && u ? u.id : String(u))).filter(Boolean);
  }
  if (typeof field === 'object' && field) {
    return [field.id].filter(Boolean);
  }
  return [String(field)];
};

const getUserNames = (field: any): string[] => {
  if (!field) return [];
  if (Array.isArray(field)) {
    return field
      .map(u => (typeof u === 'object' && u ? u.name || u.id : String(u)))
      .filter(Boolean);
  }
  if (typeof field === 'object' && field) {
    return [field.name || field.id].filter(Boolean);
  }
  return [String(field)];
};

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

  const nominators = getUserIds(award.nominator);
  const nomineeNames = getUserIds(award.nomineeName);
  const nominatorNames = getUserNames(award.nominator);
  const nomineeUserNames = getUserNames(award.nomineeName);
  const currentUserIdStr = String(currentUser.id);

  if (
    currentUser.id !== 0 && // Robot bypass by stable ID 0
    !nominators.includes(currentUserIdStr) &&
    !nomineeNames.includes(currentUserIdStr) &&
    !nominatorNames.includes(currentUser.name) &&
    !nomineeUserNames.includes(currentUser.name)
  ) {
    context.throw(403, 'You do not have permission to issue this award');
  }

  // 2. Concurrency Lock check
  if (award.transactionHash === 'ISSUING') {
    context.throw(409, 'An NFT issuance request is already in progress for this award');
  }

  // 3. Idempotency and Wallet binding check
  if (award.transactionHash && award.tokenId) {
    if (award.walletAddress && award.walletAddress !== walletAddress) {
      context.throw(409, 'This award has already been issued to a different wallet address');
    }
    context.body = {
      success: true,
      transactionHash: award.transactionHash as string,
      tokenId: award.tokenId as string,
    };
    return;
  }

  // 4. Acquire lock
  await awardModel.updateOne(
    {
      transactionHash: 'ISSUING',
      walletAddress,
    },
    recordId,
  );

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
    // Revert the concurrency lock on failure
    await awardModel
      .updateOne(
        {
          transactionHash: '',
        },
        recordId,
      )
      .catch(e => console.error('Failed to revert transaction lock:', e));

    const msg =
      (error as Error).name === 'AbortError'
        ? 'NFT issuance request timed out'
        : (error as Error).message || 'NFT issuance failed';
    return context.throw(502, msg);
  }

  // 5. Finalize the record with actual transaction details
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
