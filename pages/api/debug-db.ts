import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 1. Check environment variables
    const envVars = {
      hasDbUrl: !!process.env.DATABASE_URL,
      dbUrlLength: process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0,
      dbUrlStart: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 15) + '...' : 'none',
      nodeEnv: process.env.NODE_ENV
    };

    // 2. Try to connect/query
    const userCount = await prisma.user.count();

    return res.status(200).json({
      status: 'success',
      message: 'Database connection successful!',
      env: envVars,
      userCount
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: 'Database connection or query failed',
      error: error.message || String(error),
      stack: error.stack
    });
  }
}
