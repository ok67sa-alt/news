import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { parseCookies, verifyToken } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = parseCookies(req as any);
  const token = cookies['st_token'];
  const payload = token ? verifyToken(token) : null;

  if (req.method === 'GET') {
    // only allow admins to list users
    if (!payload || (payload.role !== 'ADMIN' && payload.role !== 'EDITOR')) return res.status(401).json({ error: 'Unauthorized' });
    try {
      if (!process.env.DATABASE_URL) return res.status(500).json({ error: 'Database not configured' });
      const users = await prisma.user.findMany({ select: { id: true, email: true, name: true, role: true, createdAt: true } });
      return res.status(200).json(users);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to load users' });
    }
  }

  if (req.method === 'POST') {
    // create user (admin or self-registration if no DB?)
    const { email, password, name, role } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
    try {
      if (!process.env.DATABASE_URL) return res.status(500).json({ error: 'Database not configured' });
      const hash = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({ data: { email, password: hash, name, role: role || 'EDITOR' } });
      return res.status(201).json({ id: user.id, email: user.email, name: user.name, role: user.role });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create user' });
    }
  }

  return res.setHeader('Allow', 'GET,POST').status(405).end('Method Not Allowed');
}
