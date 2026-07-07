import jwt from 'jsonwebtoken';
import { serialize, parse } from 'cookie';

const TOKEN_NAME = 'st_token';
const SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
// Session expires after 8 hours of inactivity
const MAX_AGE = 60 * 60 * 8; // 8 hours

export function signToken(payload: object) {
  const now = Math.floor(Date.now() / 1000);
  return jwt.sign(
    { 
      ...payload, 
      iat: now, // issued at
      exp: now + MAX_AGE // expires at
    }, 
    SECRET
  );
}

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, SECRET) as any;
    
    // Double-check expiration manually
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      console.log('Token expired:', new Date(decoded.exp * 1000).toISOString());
      return null;
    }
    
    return decoded;
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      console.log('JWT Token expired');
    } else if (err.name === 'JsonWebTokenError') {
      console.log('JWT Token invalid');
    }
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
      return { valid: false, user: null, reason: 'No token provided' };
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return { valid: false, user: null, reason: 'Token expired or invalid' };
    }
    
    // Additional check: ensure token is not too old
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      return { valid: false, user: null, reason: 'Token expired' };
    }
    
    return { valid: true, user: decoded, reason: null };
  } catch (error) {
    return { valid: false, user: null, reason: 'Verification error' };
  }
}
