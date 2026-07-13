import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { parseCookies, verifyToken } from '../../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id' });
  const nid = Number(id);
  const cookies = parseCookies(req as any);
  const token = cookies['st_token'];
  const payload = token ? verifyToken(token) : null;

  if (!payload || (payload.role !== 'ADMIN' && payload.role !== 'EDITOR')) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'PUT' || req.method === 'PATCH') {
    const { name, slug, subtitle, deskLead, deskEmail } = req.body || {};
    try {
      const updated = await prisma.category.update({ where: { id: nid }, data: { name, slug, subtitle, deskLead, deskEmail } });
      return res.status(200).json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update category' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.category.delete({ where: { id: nid } });
      return res.status(200).json({ deleted: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete category' });
    }
  }

  if (req.method === 'GET') {
    try {
      const cat = await prisma.category.findUnique({ where: { id: nid } });
      if (!cat) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(cat);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to load category' });
    }
  }

  return res.setHeader('Allow', 'GET,PUT,PATCH,DELETE').status(405).end('Method Not Allowed');
}
