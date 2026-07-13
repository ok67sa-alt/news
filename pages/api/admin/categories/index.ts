import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { parseCookies, verifyToken } from '../../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = parseCookies(req as any);
  const token = cookies['st_token'];
  const payload = token ? verifyToken(token) : null;

  if (req.method === 'GET') {
    try {
      if (!process.env.DATABASE_URL) return res.status(500).json({ error: 'Database not configured' });
      const cats = await prisma.category.findMany();
      return res.status(200).json(cats);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to load categories' });
    }
  }

  // Create category (admin/editor)
  if (req.method === 'POST') {
    if (!payload || (payload.role !== 'ADMIN' && payload.role !== 'EDITOR')) return res.status(401).json({ error: 'Unauthorized' });
    const { name, slug, subtitle, deskLead, deskEmail } = req.body || {};
    if (!name || !slug) return res.status(400).json({ error: 'Missing fields' });
    try {
      if (!process.env.DATABASE_URL) return res.status(500).json({ error: 'Database not configured' });
      const cat = await prisma.category.create({ data: { name, slug, subtitle, deskLead, deskEmail } });
      return res.status(201).json(cat);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create category' });
    }
  }

  return res.setHeader('Allow', 'GET,POST').status(405).end('Method Not Allowed');
}
