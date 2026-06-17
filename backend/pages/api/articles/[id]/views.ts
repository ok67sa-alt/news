import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import prisma from '../../../../lib/prisma';
import { setCorsHeaders } from '../../../../lib/cors';

const DATA_PATH = path.resolve(process.cwd(), '..', '..', 'src', 'data', 'news.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers for all requests
  setCorsHeaders(res);

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id' });
  const nid = Number(id);

  if (isNaN(nid)) {
    return res.status(400).json({ error: 'Invalid id format' });
  }

  if (req.method === 'POST') {
    try {
      const body = req.body;
      const newViews = typeof body.views === 'number' ? body.views : undefined;

      if (process.env.DATABASE_URL) {
        const updated = await prisma.article.update({ 
          where: { id: nid }, 
          data: { views: newViews } 
        });
        return res.status(200).json(updated);
      }

      // Fallback: attempt to update JSON in place (best-effort)
      const raw = fs.readFileSync(DATA_PATH, 'utf-8');
      const data = JSON.parse(raw);
      const idx = data.findIndex((a: any) => a.id === nid);
      if (idx === -1) return res.status(404).json({ error: 'Not found' });
      if (typeof newViews === 'number') data[idx].views = newViews;
      fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
      return res.status(200).json(data[idx]);
    } catch (err) {
      console.error('Error updating views:', err);
      return res.status(500).json({ error: 'Failed to update views' });
    }
  }

  return res.setHeader('Allow', 'POST,OPTIONS').status(405).json({ error: 'Method Not Allowed' });
}
