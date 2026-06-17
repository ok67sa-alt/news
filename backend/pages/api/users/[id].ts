import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { parseCookies, verifyToken } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id' });
  const nid = Number(id);
  const cookies = parseCookies(req as any);
  const token = cookies['st_token'];
  const payload = token ? verifyToken(token) : null;

  if (!payload || payload.role !== 'ADMIN') return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({ where: { id: nid }, select: { id: true, email: true, name: true, role: true, createdAt: true } });
      if (!user) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to load user' });
    }
  }

  if (req.method === 'PUT' || req.method === 'PATCH') {
    const { email, password, name, role } = req.body || {};
    try {
      const data: any = {};
      if (email) data.email = email;
      if (name) data.name = name;
      if (role) data.role = role;
      if (password) data.password = await bcrypt.hash(password, 10);
      const updated = await prisma.user.update({ where: { id: nid }, data });
      return res.status(200).json({ id: updated.id, email: updated.email, name: updated.name, role: updated.role });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update user' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.user.delete({ where: { id: nid } });
      return res.status(200).json({ deleted: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete user' });
    }
  }

  return res.setHeader('Allow', 'GET,PUT,PATCH,DELETE').status(405).end('Method Not Allowed');
}
