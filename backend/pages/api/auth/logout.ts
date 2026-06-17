import type { NextApiRequest, NextApiResponse } from 'next';
import { removeTokenCookie } from '../../../lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  removeTokenCookie(res);
  res.status(200).json({ loggedOut: true });
}
