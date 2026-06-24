import jwt from 'jsonwebtoken';
import { serialize, parse } from 'cookie';

const TOKEN_NAME = 'st_token';
const SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function signToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: MAX_AGE });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as any;
  } catch (err) {
    return null;
  }
}

export function setTokenCookie(res: any, token: string) {
  const cookie = serialize(TOKEN_NAME, token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });
  res.setHeader('Set-Cookie', cookie);
}

export function removeTokenCookie(res: any) {
  const cookie = serialize(TOKEN_NAME, '', {
    maxAge: -1,
    path: '/',
  });
  res.setHeader('Set-Cookie', cookie);
}

export function parseCookies(req: any) {
  if (!req.headers || !req.headers.cookie) return {};
  return parse(req.headers.cookie);
}

export function verifyAuth(req: any) {
  try {
    const cookies = parse(req.headers.cookie || '');
    const token = cookies[TOKEN_NAME];
    
    if (!token) {
      return { valid: false, user: null };
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return { valid: false, user: null };
    }
    
    return { valid: true, user: decoded };
  } catch (error) {
    return { valid: false, user: null };
  }
}
