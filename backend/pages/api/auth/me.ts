import type { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies, verifyToken, removeTokenCookie } from '../../../lib/auth';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = parseCookies(req as any);
  const token = cookies['st_token'];
  
  if (!token) {
    return res.status(200).json({ user: null });
  }
  
  const payload = verifyToken(token);
  
  // If token is invalid or expired, clear the cookie
  if (!payload) {
    removeTokenCookie(res);
    return res.status(401).json({ user: null, message: 'Session expired' });
  }
  
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(200).json({ 
        user: { 
          id: payload.id, 
          email: payload.email, 
          name: payload.name, 
          role: payload.role 
        } 
      });
    }
    
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    
    if (!user) {
      removeTokenCookie(res);
      return res.status(401).json({ user: null, message: 'User not found' });
    }
    
    return res.status(200).json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      } 
    });
  } catch (err) {
    console.error('Auth verification error:', err);
    return res.status(500).json({ user: null });
  }
}
