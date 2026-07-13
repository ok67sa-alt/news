import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

// CORS headers
const setCorsHeaders = (res: NextApiResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
};

/**
 * GET /api/breaking
 * Returns all breaking news articles (published only)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.setHeader('Allow', 'GET,OPTIONS').status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const breakingNews = await prisma.article.findMany({
      where: {
        breaking: true,
        status: 'PUBLISHED'
      },
      orderBy: {
        publishedAt: 'desc'
      },
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      take: 10 // Limit to most recent 10 breaking news
    });

    return res.status(200).json(breakingNews);
  } catch (err: any) {
    console.error('GET /api/breaking error:', err);
    return res.status(500).json({ 
      error: 'Failed to fetch breaking news', 
      details: err.message 
    });
  }
}
