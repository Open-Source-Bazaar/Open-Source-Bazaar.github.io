import type { NextApiRequest, NextApiResponse } from 'next';
import { AwardModel } from '../../../../models/Award';

const VALID_TRANSITIONS: Record<string, string[]> = {
  nominated: ['reviewing', 'declined'],
  reviewing: ['voting', 'declined'],
  voting: ['awarded'],
  awarded: [],
  declined: [],
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  const { status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ error: 'Missing id or status' });
  }

  try {
    const awardModel = new AwardModel();
    const awards = await awardModel.getAll();
    const award = awards.find((a) => a.id === id);

    if (!award) {
      return res.status(404).json({ error: 'Award not found' });
    }

    const currentStatus = (award.status ?? 'nominated') as string;
    const allowed = VALID_TRANSITIONS[currentStatus];

    if (!allowed || !allowed.includes(status)) {
      return res.status(400).json({
        error: `Invalid status transition: ${currentStatus} -> ${status}`,
        allowedTransitions: allowed,
      });
    }

    await awardModel.updateOne(id as string, { status });
    return res.status(200).json({ success: true, from: currentStatus, to: status });
  } catch (error) {
    return res.status(500).json({ error: String(error) });
  }
}