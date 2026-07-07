# CORS Error Fix Guide

## Problem

You were seeing these errors:
```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at http://localhost:1337/api/articles
```

## Root Cause

The `.env` file still had **Strapi configuration** pointing to `http://localhost:1337`, but:
1. Strapi is no longer running
2. The project now uses **Next.js backend** with Prisma database
3. Frontend and backend are merged into one unified application

## Solution Applied

### 1. Disabled Strapi Configuration

**File: `.env`**

**BEFORE:**
```env
VITE_STRAPI_API_URL=http://localhost:1337
VITE_STRAPI_API_TOKEN=84a30504f4aa275d...
```

**AFTER:**
```env
# Strapi is no longer used - we now use Next.js backend API
# VITE_STRAPI_API_URL=
# VITE_STRAPI_API_TOKEN=
```

### 2. How It Works Now

The `fetchAPI` function in `src/utils/api.ts` checks:

```typescript
if (STRAPI_URL) {
  return fetchFromStrapi(path, params);  // ❌ Old Strapi method
}

// ✅ New Next.js backend method
const baseUrl = API_URL || window.location.origin;
const url = new URL(`${baseUrl}/api${path}`);
```

**With Strapi URL removed:**
- Frontend uses Next.js backend API routes
- No CORS issues (same origin)
- All data comes from Prisma database

---

## Environment Configuration

### Development (Local)

**Option 1: Same Origin (Recommended)**
```env
# .env.local
VITE_API_URL=
```
Frontend uses `window.location.origin` automatically.

**Option 2: Explicit URL**
```env
# .env.local
VITE_API_URL=http://localhost:3000
```

### Production (Railway/VPS)

```env
# .env.production
VITE_API_URL=
```
Leave empty - frontend and backend are on the same domain.

---

## How to Run the Application

### Development Mode

**Terminal 1: Start Backend (Next.js)**
```bash
cd backend
npm run dev
```
Backend runs on: `http://localhost:3000`

**Terminal 2: Start Frontend (Vite)**
```bash
npm run dev
```
Frontend runs on: `http://localhost:5173`

Frontend proxies API requests to backend automatically.

### Production Build

```bash
# Build backend
cd backend
npm run build

# Build frontend
npm run build

# Start (serves both frontend and backend)
npm start
```

Everything runs on: `http://localhost:3000`

---

## API Routes Available

All routes are in `backend/pages/api/`:

### Public Routes
- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get single article
- `POST /api/articles/:id/views` - Increment views
- `GET /api/categories` - Get all categories
- `GET /api/breaking` - Get breaking news

### Admin Routes (Auth Required)
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/me` - Check auth status
- `POST /api/admin/uploads` - Upload images
- `GET /api/admin/stats` - Dashboard statistics
- `POST /api/admin/articles/publish` - Publish article
- CRUD operations for articles, categories, users

---

## Troubleshooting

### Issue: Still seeing CORS errors

**Solution:**
1. Stop all running servers
2. Delete `.env.local` if it has Strapi config
3. Restart servers:
   ```bash
   # Terminal 1
   cd backend && npm run dev
   
   # Terminal 2 (new terminal)
   npm run dev
   ```

### Issue: API returns 404

**Check:**
1. Backend is running on port 3000
2. API route exists in `backend/pages/api/`
3. Database is connected (check `DATABASE_URL`)

### Issue: Frontend can't connect to backend

**Check:**
1. `VITE_API_URL` in `.env.local`:
   - Either empty (uses same origin)
   - Or `http://localhost:3000`
2. Backend is running
3. No firewall blocking port 3000

### Issue: Images still show 404

**Check:**
1. Uploads directory exists: `backend/public/uploads/`
2. Files are in the directory
3. Next.js rewrite is active (in `backend/next.config.mjs`)
4. API route exists: `backend/pages/api/uploads/[...path].ts`

---

## Migration from Strapi to Next.js

### What Changed

| Feature | Before (Strapi) | After (Next.js + Prisma) |
|---------|----------------|--------------------------|
| **Database** | Strapi SQLite | PostgreSQL via Prisma |
| **API** | `http://localhost:1337` | `http://localhost:3000/api` |
| **Admin Panel** | Strapi Admin | Custom Next.js Admin |
| **File Uploads** | Strapi Media | Local/S3 via API route |
| **Auth** | Strapi Auth | JWT with HTTP-only cookies |

### Data Migration

Articles were migrated using:
```bash
node backend/prisma/seed.cjs
```

This script:
1. Reads from old Strapi database
2. Transforms data to Prisma schema
3. Imports into PostgreSQL

---

## Environment Variables Reference

### Frontend (.env)
```env
VITE_API_URL=                    # Backend URL (empty = same origin)
```

### Backend (backend/.env.development)
```env
DATABASE_URL=postgresql://...    # PostgreSQL connection
JWT_SECRET=your-secret           # Auth token secret
NODE_ENV=development             # Environment mode
```

---

## Success Checklist

After applying this fix:

✅ No CORS errors in browser console  
✅ Articles load on homepage  
✅ Breaking news ticker works  
✅ Category pages display articles  
✅ Article detail pages work  
✅ View counter increments  
✅ Images display correctly  
✅ Admin panel accessible  

---

## Summary

The CORS issue was caused by leftover Strapi configuration. Now:

1. ✅ Frontend uses Next.js backend API
2. ✅ No cross-origin requests (same domain)
3. ✅ All data from Prisma database
4. ✅ Unified deployment (one server)
5. ✅ No CORS configuration needed

Your application now works as a unified full-stack Next.js + React app with PostgreSQL database.
