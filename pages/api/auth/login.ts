import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken, setTokenCookie } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.setHeader('Allow', 'POST').status(405).end('Method Not Allowed');
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });

  try {
    if (!process.env.DATABASE_URL) return res.status(500).json({ error: 'Database not configured' });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    let ok = false;
    if (user.password && user.password.startsWith('$2')) {
      ok = await bcrypt.compare(password, user.password);
    } else {
      // Legacy plaintext password: accept and re-hash to secure storage
      if (password === user.password) {
        ok = true;
        const hashed = await bcrypt.hash(password, 10);
        await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
      }
    }
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
    setTokenCookie(res, token);
    return res.status(200).json({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (err: any) {
    console.error("LOGIN ERROR:", err);

    return res.status(500).json({
      error: err.message,
      stack: process.env.NODE_ENV !== "production" ? err.stack : undefined
    });
  }
}
