# Sudan News Today - Deployment Guide

This guide explains how to deploy both the frontend and backend as a single application.

## 🏗️ Architecture

The project now runs as a unified Next.js application:
- **Frontend (React + Vite)**: Served at `https://sudannewstoday.com/`
- **Backend (Next.js Admin Panel)**: Served at `https://sudannewstoday.com/admin`
- **API Routes**: Available at `https://sudannewstoday.com/api`

## 📋 Prerequisites

1. Node.js 18+ installed
2. PostgreSQL database (or your chosen database)
3. Environment variables configured

## 🚀 Development

### Running in Development Mode

#### Option 1: Run Frontend and Backend Separately (Recommended for Development)

```bash
# Terminal 1 - Run Frontend (React app with Vite)
npm run dev

# Terminal 2 - Run Backend (Next.js admin panel)
npm run dev:backend
```

- Frontend runs on: `http://localhost:5173`
- Backend runs on: `http://localhost:3000`
- API calls from frontend are proxied to backend automatically

#### Option 2: Run as Unified App (Production-like)

```bash
# Build frontend and copy assets
npm run build:frontend

# Run backend (which now serves both frontend and admin)
cd backend
npm run dev
```

Everything runs on: `http://localhost:3000`

## 📦 Building for Production

### Full Build Process

```bash
# Build everything (frontend + backend)
npm run build
```

This command:
1. Builds the React frontend with Vite → creates `dist/` folder
2. Copies frontend assets to `backend/public/assets/`
3. Builds the Next.js backend → creates `.next/` folder

### Manual Build Steps

If you prefer to build separately:

```bash
# Step 1: Build frontend
npm run build:frontend

# Step 2: Build backend
npm run build:backend
```

## 🌐 Running in Production

After building, start the production server:

```bash
npm start
```

Or directly from the backend folder:

```bash
cd backend
npm start
```

The server will run on port 3000 by default. Both frontend and admin panel are served from the same server.

## 🔧 Environment Variables

### Root `.env` (Frontend)
```env
VITE_API_URL=http://localhost:3000/api
```

### Backend `.env` (Backend)
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-bucket"
```

### Production Environment Variables

For production, update `VITE_API_URL`:
```env
VITE_API_URL=https://sudannewstoday.com/api
```

## 🚢 Deployment Platforms

### Vercel (Recommended)

1. **Connect your repository to Vercel**

2. **Configure Build Settings:**
   - **Framework Preset**: Next.js
   - **Root Directory**: `backend`
   - **Build Command**: 
     ```bash
     cd .. && npm run build
     ```
   - **Output Directory**: `.next`
   - **Install Command**: 
     ```bash
     npm install && cd backend && npm install
     ```

3. **Environment Variables:**
   - Add all environment variables from `backend/.env`
   - Set `VITE_API_URL` to your domain: `https://sudannewstoday.com/api`

4. **Deploy!** Vercel will automatically:
   - Build your frontend
   - Copy assets to backend
   - Build Next.js
   - Deploy everything

### Other Platforms (Netlify, Railway, Render, etc.)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Set the start command:**
   ```bash
   npm start
   ```

3. **Set root directory** to `backend` or configure to run from root

4. **Configure environment variables** as shown above

## 📁 Project Structure After Build

```
.
├── dist/                      # Frontend build output (Vite)
│   ├── index.html
│   └── assets/
│       ├── index-[hash].js
│       └── index-[hash].css
│
├── backend/
│   ├── .next/                 # Next.js build output
│   ├── public/
│   │   └── assets/            # Frontend assets copied here
│   ├── pages/
│   │   ├── [[...slug]].tsx    # Catches all routes for frontend SPA
│   │   ├── admin/             # Admin panel pages
│   │   └── api/               # API routes
│   └── package.json
│
└── package.json
```

## 🔀 How Routing Works

The Next.js server handles routing with these priorities:

1. **API Routes** (`/api/*`) → Next.js API handlers
2. **Admin Routes** (`/admin/*`) → Next.js admin pages
3. **Static Assets** (`/assets/*`) → Served from `backend/public/assets/`
4. **Everything Else** (`/*`) → React SPA (served by `[[...slug]].tsx`)

This means:
- `https://sudannewstoday.com/` → Frontend React app
- `https://sudannewstoday.com/category/politics` → Frontend React app (client-side routing)
- `https://sudannewstoday.com/admin` → Backend admin panel
- `https://sudannewstoday.com/api/articles` → Backend API

## 🧪 Testing the Build Locally

```bash
# Build everything
npm run build

# Start production server
npm start

# Open browser
# Frontend: http://localhost:3000
# Admin: http://localhost:3000/admin
# API: http://localhost:3000/api/articles
```

## ⚠️ Important Notes

1. **Build Order**: Always build frontend BEFORE backend (the build script handles this)
2. **Environment Variables**: Make sure to update `VITE_API_URL` for production
3. **Database**: Run Prisma migrations before deploying:
   ```bash
   cd backend
   npx prisma migrate deploy
   ```
4. **Static Files**: Frontend is served as a SPA - all client-side routing handled by React Router

## 🐛 Troubleshooting

### "Frontend Not Built" message
- Run `npm run build:frontend` before starting the backend

### API calls failing
- Check `VITE_API_URL` in root `.env`
- Make sure backend is running on the correct port

### Admin panel not loading
- Check that `/admin` routes in `backend/pages/admin/` are not conflicting

### Assets (CSS/JS) not loading
- Make sure `copy-frontend.js` ran successfully
- Check `backend/public/assets/` contains the files
- Verify Next.js config rewrites are correct

## 📝 Additional Commands

```bash
# Install all dependencies (root + backend)
npm install && cd backend && npm install && cd ..

# Run Prisma migrations
cd backend && npx prisma migrate dev

# Generate Prisma client
cd backend && npx prisma generate

# Seed database
npm run prisma:seed
```

## 🎉 Success!

Once deployed, your site should be accessible at:
- Main site: `https://sudannewstoday.com`
- Admin panel: `https://sudannewstoday.com/admin`
- API: `https://sudannewstoday.com/api/*`

All running from a single deployment! 🚀
