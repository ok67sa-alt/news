# Admin Session Timeout Configuration

## Overview

Admin authentication sessions now expire after **8 hours of inactivity** to enhance security. Users will be automatically logged out when their session expires.

---

## Configuration

### Session Duration

Located in `backend/lib/auth.ts`:

```typescript
const MAX_AGE = 60 * 60 * 8; // 8 hours
```

You can adjust this value:
- **1 hour:** `60 * 60 * 1`
- **4 hours:** `60 * 60 * 4`
- **8 hours:** `60 * 60 * 8` (current)
- **24 hours:** `60 * 60 * 24`

---

## How It Works

### 1. Token Generation (`/api/auth/login`)
When a user logs in:
```typescript
{
  id: userId,
  email: userEmail,
  role: userRole,
  iat: 1234567890,  // issued at timestamp
  exp: 1234596690   // expires at timestamp (iat + 8 hours)
}
```

### 2. Token Verification (`verifyToken`)
Every request validates:
- Token signature is valid
- Token has not expired (`exp < now`)
- Token structure is correct

**If expired:**
- Returns `null`
- Cookie is cleared
- User is redirected to login

### 3. Frontend Auth Check (`withAuth` HOC)
Protected admin pages check authentication on mount:
```typescript
GET /api/auth/me
→ If 401 or user=null: redirect to /admin/login
→ If 200 and user exists: allow access
```

### 4. Session Refresh
**Important:** Sessions do NOT auto-refresh. Once 8 hours pass, the user must log in again.

To implement auto-refresh (optional):
```typescript
// In withAuth.tsx, add periodic refresh:
setInterval(async () => {
  const res = await fetch('/api/auth/refresh', { credentials: 'include' });
  if (!res.ok) router.replace('/admin/login');
}, 30 * 60 * 1000); // Check every 30 minutes
```

---

## Security Features

### ✅ HTTP-Only Cookies
Tokens are stored in HTTP-only cookies, preventing JavaScript access:
```typescript
httpOnly: true,  // Cannot be accessed by JavaScript
secure: true,    // Only sent over HTTPS in production
sameSite: 'lax', // CSRF protection
```

### ✅ Automatic Expiration
JWT tokens include expiration timestamp:
```typescript
exp: Math.floor(Date.now() / 1000) + MAX_AGE
```

### ✅ Cookie Cleanup
Expired tokens are automatically cleared:
```typescript
removeTokenCookie(res); // Sets cookie with maxAge: -1
```

### ✅ Frontend Protection
All admin pages use `withAuth` HOC:
```typescript
export default withAuth(AdminDashboard);
```

---

## User Experience

### Login Flow
1. User enters credentials
2. Server validates and creates token
3. Token stored in HTTP-only cookie
4. User redirected to admin dashboard

### Active Session
- User can navigate admin pages freely
- Token is sent automatically with each request
- Session remains valid for 8 hours from login

### Session Expiration
1. 8 hours pass since login
2. User navigates to any admin page
3. `withAuth` checks `/api/auth/me`
4. Server returns 401 (session expired)
5. User automatically redirected to `/admin/login`
6. User sees login page (no error message needed)

### Manual Logout
User clicks "Logout":
1. POST `/api/auth/logout`
2. Cookie cleared immediately
3. Redirect to login page

---

## Environment Variables

### Required
```env
JWT_SECRET=your-secret-key-here  # Change this in production!
```

**Generate a secure secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Optional
```env
NODE_ENV=production  # Enables secure cookies (HTTPS only)
```

---

## Testing

### Test Session Expiration

**Option 1: Reduce timeout temporarily**
```typescript
// In backend/lib/auth.ts
const MAX_AGE = 60; // 1 minute for testing
```

**Option 2: Manually expire token**
1. Login to admin panel
2. Open browser DevTools → Application → Cookies
3. Find `st_token` cookie
4. Delete it
5. Try navigating to any admin page
6. Should redirect to login

**Option 3: Use backend logging**
```typescript
// In backend/pages/api/auth/me.ts
console.log('Token payload:', payload);
console.log('Token expires:', new Date(payload.exp * 1000));
console.log('Current time:', new Date());
```

---

## Troubleshooting

### Issue: Users logged out too frequently
**Solution:** Increase `MAX_AGE` in `backend/lib/auth.ts`

### Issue: Users stay logged in too long
**Solution:** Decrease `MAX_AGE` in `backend/lib/auth.ts`

### Issue: Session doesn't expire at all
**Check:**
1. JWT_SECRET is set correctly
2. Server time is accurate
3. Token includes `exp` field
4. `verifyToken` is checking expiration

### Issue: Redirect loop (login → dashboard → login)
**Check:**
1. `/api/auth/me` returns correct response
2. `withAuth` HOC parses response correctly
3. Cookie is being sent with requests
4. JWT_SECRET matches between login and verification

---

## Production Deployment

### Checklist
- [ ] Set strong `JWT_SECRET` environment variable
- [ ] Set `NODE_ENV=production`
- [ ] Verify HTTPS is enabled (for secure cookies)
- [ ] Test session expiration behavior
- [ ] Document session duration for users

### Railway Configuration
```bash
# Add to Railway environment variables
JWT_SECRET=<your-generated-secret>
NODE_ENV=production
```

### VPS/Docker Configuration
```env
# .env.production
JWT_SECRET=<your-generated-secret>
NODE_ENV=production
DATABASE_URL=postgresql://...
```

---

## Summary

✅ **Sessions expire after 8 hours**  
✅ **Expired sessions redirect to login**  
✅ **Cookies cleared automatically**  
✅ **No persistent login across browser restarts**  
✅ **Secure token storage (HTTP-only cookies)**  
✅ **Easy to configure timeout duration**

Users will need to login again after 8 hours of inactivity, improving security without disrupting normal usage.
