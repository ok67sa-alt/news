import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userCount = await prisma.user.count();
    return res.status(200).json({
      status: 'success',
      message: 'Database connection successful!',
      userCount
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message || String(error)
    });
  }
}
