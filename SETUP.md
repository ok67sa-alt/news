# Backend Setup Guide - Database Connection

This guide explains how to connect your database to the new Next.js backend (replacing Strapi).

## 1. Update Database Connection

Edit `backend/.env` with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/sudan_times"
JWT_SECRET="your-secret-key-here-change-in-production"
```

Replace:
- `user` - your PostgreSQL username
- `password` - your PostgreSQL password
- `localhost` - your database host (e.g., 127.0.0.1 for local, or remote host)
- `5432` - your PostgreSQL port (default is 5432)
- `sudan_times` - your database name

## 2. Install Backend Dependencies

```bash
cd backend
npm install
npm run prisma:generate
```

## 3. Run Database Migration

This will create/update the database schema based on `backend/prisma/schema.prisma`:

```bash
npm run prisma:migrate
```

When prompted, give the migration a name, e.g., `init`.

## 4. Seed Database from Existing News Data

If you have existing articles in `src/data/news.json`, seed them into the database:

```bash
# From root directory
npm run prisma:seed
# Or directly:
node backend/prisma/seed.cjs
```

This will:
- Read all articles from `src/data/news.json`
- Create categories
- Create a default admin user (email: `admin@local`, password: `changeme`)
- Import all articles with their metadata

## 5. Start Backend Dev Server

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:3000`

## 6. Start Frontend Dev Server

```bash
# From root directory
npm run dev
```

Frontend (Vite) will run on `http://localhost:5173` and will connect to the backend at `http://localhost:3000` (as set in `.env.local`).

## 7. Access Admin Panel

- URL: `http://localhost:3000/admin/login`
- Email: `admin@local`
- Password: `changeme` (change this immediately!)

## Configuration

### S3 Uploads (Optional)

If you want to store uploads on AWS S3 instead of locally, add to `backend/.env`:

```env
S3_BUCKET=your-bucket-name
S3_REGION=us-east-1
S3_KEY_PREFIX=uploads/
S3_PUBLIC_URL=https://your-bucket.s3.amazonaws.com/
```

Without S3, uploads are saved to `backend/public/uploads/`

### TinyMCE Editor (Optional)

For rich text editor, get an API key from https://www.tiny.cloud and add to `backend/.env`:

```env
NEXT_PUBLIC_TINYMCE_API_KEY=your-tinymce-api-key
```

## Verifying Connection

Check that:
1. ✅ Database is running (PostgreSQL)
2. ✅ `backend/.env` has `DATABASE_URL` set
3. ✅ `backend/pages/api/articles/index.ts` responds at `http://localhost:3000/api/articles`
4. ✅ Frontend `.env.local` has `VITE_API_URL=http://localhost:3000`
5. ✅ Frontend can fetch articles from the backend

If articles don't appear, check:
- Database is running: `psql -U user -d sudan_times -c "SELECT * FROM "Article";"`
- Backend logs: `npm run dev` in backend folder
- Frontend console: check for fetch errors in browser DevTools
