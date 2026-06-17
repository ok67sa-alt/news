# Vercel Deployment Setup Guide

## 🚀 Quick Deploy to Vercel

Your project is now ready for unified deployment on Vercel!

## ⚙️ Vercel Project Settings

### 1. Framework Preset
```
Next.js
```

### 2. Root Directory
```
backend
```
**IMPORTANT:** Set this to `backend` folder!

### 3. Build & Development Settings

**Build Command:**
```bash
cd .. && npm install && npm run build
```

**Output Directory:**
```
.next
```

**Install Command:**
```bash
npm install
```

**Development Command:**
```bash
npm run dev
```

### 4. Environment Variables

Add these in Vercel project settings → Environment Variables:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database_name

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this

# AWS S3 (Optional - for file uploads)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Node Environment
NODE_ENV=production
```

## 📋 Step-by-Step Deployment

### Step 1: Go to Vercel Dashboard
Visit [vercel.com/dashboard](https://vercel.com/dashboard)

### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Import your GitHub repository: `ok67sa-alt/news`
3. Click "Import"

### Step 3: Configure Project
**Framework Preset:** Next.js

**Root Directory:** 
- Click "Edit" next to Root Directory
- Select `backend` folder
- Click "Continue"

**Build Settings:**
- Build Command: `cd .. && npm install && npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### Step 4: Add Environment Variables
Click "Environment Variables" and add all the variables listed above.

### Step 5: Deploy!
Click "Deploy" button.

## 🔧 After First Deployment

### Setup Database
Your Vercel deployment needs a PostgreSQL database. Options:

#### Option 1: Vercel Postgres (Recommended)
1. Go to Vercel Dashboard → Storage
2. Create → Postgres Database
3. Copy the `DATABASE_URL`
4. Add it to your environment variables
5. Redeploy

#### Option 2: External Database (Supabase, Neon, etc.)
1. Create database on your preferred provider
2. Copy connection string
3. Add as `DATABASE_URL` environment variable
4. Redeploy

### Run Database Migrations
After database is connected:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Make sure `DATABASE_URL` is set
3. Go to Deployments → Latest Deployment → More Menu → Redeploy
4. Or manually run migrations:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login
   vercel login
   
   # Pull environment
   vercel env pull
   
   # Run migrations
   cd backend
   npx prisma migrate deploy
   ```

### Seed Initial Data (Optional)
```bash
cd backend
npx prisma db seed
```

## 🌐 Custom Domain Setup

### Add Your Domain
1. Go to Project Settings → Domains
2. Add `sudannewstoday.com`
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

### DNS Configuration
Add these records to your domain DNS:

**For root domain (sudannewstoday.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## ✅ Verify Deployment

After deployment, test these URLs:

- ✅ Frontend: `https://your-project.vercel.app/`
- ✅ Admin: `https://your-project.vercel.app/admin`
- ✅ API: `https://your-project.vercel.app/api/categories`

## 🐛 Troubleshooting

### Build Fails

**Error: "Cannot find module prisma"**
- Solution: Make sure `DATABASE_URL` is set in environment variables

**Error: "Build failed"**
- Check build logs in Vercel dashboard
- Common issue: Missing environment variables
- Solution: Add all required env vars and redeploy

### Runtime Errors

**Error: "Database connection failed"**
- Check if `DATABASE_URL` is correct
- Make sure database allows connections from Vercel IPs
- Run `npx prisma migrate deploy`

**Error: "Frontend not loading"**
- Check if frontend was built: Look for `backend/public/index.html`
- Rebuild locally: `npm run build`
- Push and redeploy

### Old Version Still Showing

**Problem: Deployed version shows old code**

**Solution:**
1. Push latest changes to GitHub
2. Go to Vercel Dashboard
3. Click "Deployments"
4. Click "..." on latest deployment
5. Click "Redeploy"

Or force redeploy:
```bash
vercel --prod --force
```

## 📦 Build Process Explained

What happens during Vercel build:

1. **Install root dependencies**: `npm install` (root package.json)
2. **Build frontend**: `vite build` (creates dist/ folder)
3. **Copy frontend to backend**: `node copy-frontend.js` (copies to backend/public/)
4. **Install backend dependencies**: `cd backend && npm install`
5. **Build backend**: `next build` (creates backend/.next/)
6. **Deploy**: Vercel serves everything from backend/.next/

## 🔄 Continuous Deployment

Once set up, every push to `main` branch automatically deploys to Vercel!

```bash
git add .
git commit -m "Update feature"
git push origin main
# Vercel automatically deploys! 🚀
```

## 📊 Monitor Deployment

### Check Build Logs
Vercel Dashboard → Deployments → Click on deployment → View Build Logs

### Check Runtime Logs  
Vercel Dashboard → Project → Logs

### Analytics
Vercel Dashboard → Analytics (usage, performance, errors)

## 🎉 Success!

Once deployed, your unified application runs on:

```
https://sudannewstoday.com/              → News Website (Frontend)
https://sudannewstoday.com/admin         → Admin Panel
https://sudannewstoday.com/api/articles  → API Endpoints
```

All from one domain, one deployment! 🚀
