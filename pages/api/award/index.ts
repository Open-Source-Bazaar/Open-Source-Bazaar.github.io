import type { NextApiRequest, NextApiResponse } from 'next';
import { AwardModel } from '../../../models/Award';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const awardModel = new AwardModel();

  switch (req.method) {
    case 'GET': {
      const awards = await awardModel.getAll();
      return res.status(200).json(awards);
    }
    case 'POST': {
      const body = req.body;
      try {
        const result = await awardModel.createOne(body);
        return res.status(201).json(result);
      } catch (error) {
        return res.status(400).json({ error: String(error) });
      }
    }
    case 'PUT': {
      const { id, ...data } = req.body;
      try {
        await awardModel.updateOne(id, data);
        return res.status(200).json({ success: true });
      } catch (error) {
        return res.status(400).json({ error: String(error) });
      }
    }
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}
