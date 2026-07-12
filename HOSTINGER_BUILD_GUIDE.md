# 🏗️ Hostinger Build Configuration Guide

## 📊 Project Architecture

Your Sudan Times project is a **full-stack application** with:

```
sudan-times/
├── src/                    # Frontend (React + Vite)
├── backend/                # Backend (Next.js + Prisma)
├── package.json            # Root build orchestrator
├── copy-frontend.js        # Copies frontend build to backend
└── dist/                   # Frontend build output (created during build)
```

---

## 🔨 Build Process Explained

### Step 1: Frontend Build (Vite)
```bash
npm run build:frontend
```
**What it does:**
- Builds React app with Vite
- Creates `dist/` folder with:
  - `index.html`
  - `assets/` (JS, CSS, images)
- Runs `copy-frontend.js` to copy to `backend/public/`

### Step 2: Backend Build (Next.js)
```bash
cd backend && npm run build
```
**What it does:**
- Builds Next.js backend
- Creates `backend/.next/` folder
- Generates Prisma Client
- Ensures uploads directory exists

### Complete Build (Both)
```bash
npm run build
```
**What it does:**
1. ✅ Builds frontend (Vite)
2. ✅ Copies frontend to `backend/public/`
3. ✅ Installs backend dependencies
4. ✅ Generates Prisma Client
5. ✅ Builds Next.js backend

---

## ⚙️ Hostinger Configuration

### Hostinger Node.js App Settings

| Setting | Value | Notes |
|---------|-------|-------|
| **Build Directory** | `./` | Root directory (NOT editable, that's fine!) |
| **Build Command** | `npm install && npm run build` | Builds both frontend + backend |
| **Start Command** | `npm start` | Starts backend (which serves frontend) |
| **Node Version** | `18.x` or `20.x` | Use latest LTS |
| **Entry Point** | `backend/server.js` or auto-detect | Next.js handles this |

### Alternative: Manual Build Command

If Hostinger's build doesn't work, use this custom build command:

```bash
npm install && npm run build:frontend && cd backend && npm install && npx prisma generate && npm run build
```

---

## 📂 What Gets Built?

### After `npm run build`, you'll have:

```
sudan-times/
├── dist/                   # Frontend build (temporary)
│   ├── index.html
│   └── assets/
│       ├── index-abc123.js
│       └── index-xyz789.css
│
└── backend/
    ├── .next/              # Next.js build (backend)
    │   ├── server/
    │   └── static/
    │
    └── public/             # Frontend copied here
        ├── index.html      # Main entry point
        └── assets/         # JS, CSS, images
```

### How It Serves:

1. **Frontend routes** (`/`, `/category/politics`, etc.)
   - Served from `backend/public/index.html`
   - React Router handles client-side routing

2. **API routes** (`/api/articles`, `/api/auth/login`, etc.)
   - Served by Next.js from `backend/pages/api/`

3. **Admin panel** (`/admin/login`, `/admin/articles`, etc.)
   - Served by Next.js from `backend/pages/admin/`

---

## 🚀 Deployment Steps for Hostinger

### Option 1: Using Hostinger Node.js App (Recommended)

1. **Login to Hostinger hPanel**
2. Go to **"Advanced" → "Node.js"**
3. Click **"Create Application"**
4. Fill in settings:
   ```
   Application Name: Sudan Times
   Application Root: public_html/sudan-times (or custom path)
   Application URL: your-domain.com
   Node.js Version: 20.x
   
   Build Command: npm install && npm run build
   Start Command: npm start
   
   Environment Variables:
   DATABASE_URL=mysql://u408915236_admin:Awab3100@localhost:3306/u408915236_sudannews
   JWT_SECRET=your-production-secret
   CLOUDINARY_CLOUD_NAME=utdfxckm
   CLOUDINARY_API_KEY=742197721758692
   CLOUDINARY_API_SECRET=JSiuuOoTEN_jf-mLcNEZp-HUK7o
   CLOUDINARY_FOLDER=sudan-news
   ```

5. **Deploy via Git:**
   - Connect your GitHub repository: `https://github.com/ok67sa-alt/news`
   - Select branch: `main`
   - Click **"Deploy"**

6. **Wait for build to complete** (may take 5-10 minutes)

7. **Run database migrations** (SSH required):
   ```bash
   ssh u408915236@your-domain.com
   cd ~/public_html/sudan-times/backend
   npx prisma migrate deploy
   node prisma/seed.cjs
   ```

---

### Option 2: Manual SSH Deployment

```bash
# 1. SSH into Hostinger
ssh u408915236@your-domain.com

# 2. Navigate to web root
cd ~/public_html

# 3. Clone repository
git clone https://github.com/ok67sa-alt/news.git sudan-times
cd sudan-times

# 4. Create production .env
cat > backend/.env << 'EOF'
DATABASE_URL="mysql://u408915236_admin:Awab3100@localhost:3306/u408915236_sudannews"
JWT_SECRET="your-production-secret-change-this"
CLOUDINARY_CLOUD_NAME="utdfxckm"
CLOUDINARY_API_KEY="742197721758692"
CLOUDINARY_API_SECRET="JSiuuOoTEN_jf-mLcNEZp-HUK7o"
CLOUDINARY_FOLDER="sudan-news"
EOF

# 5. Build everything
npm install
npm run build

# 6. Run database migrations
cd backend
npx prisma migrate deploy
node prisma/seed.cjs

# 7. Start with PM2
npm install -g pm2
pm2 start npm --name "sudan-times" -- start
pm2 save
pm2 startup

# 8. Check status
pm2 status
pm2 logs sudan-times
```

---

## 🌐 Domain Configuration

### If using subdomain or main domain:

1. **Point domain to Hostinger** (if not already)
2. **Setup Nginx reverse proxy:**

```nginx
# /etc/nginx/sites-available/your-domain.com
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. **Enable SSL:**
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## ✅ Verification Checklist

After deployment, test these URLs:

- [ ] **Frontend:** `https://your-domain.com`
  - Should show homepage with articles

- [ ] **API:** `https://your-domain.com/api/articles`
  - Should return JSON array of articles

- [ ] **Admin Login:** `https://your-domain.com/admin/login`
  - Should show login form

- [ ] **Category Page:** `https://your-domain.com/category/politics`
  - Should show politics articles

- [ ] **Article Detail:** `https://your-domain.com/article/[slug]`
  - Should show full article

---

## 🐛 Troubleshooting

### Build Fails: "Cannot find module"

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules backend/node_modules
npm install
npm run build
```

### Build Fails: "Vite: command not found"

**Solution:**
```bash
# Install dependencies first
npm install
npm run build:frontend
```

### Frontend Shows 404

**Problem:** Frontend not copied to backend/public

**Solution:**
```bash
npm run build:frontend  # Rebuilds and copies frontend
```

### API Returns 500 Error

**Problem:** Database not migrated

**Solution:**
```bash
cd backend
npx prisma migrate deploy
node prisma/seed.cjs
```

### "Module not found: @prisma/client"

**Solution:**
```bash
cd backend
npx prisma generate
npm start
```

---

## 📦 Build Output Structure

### What Hostinger should see after build:

```
sudan-times/
├── node_modules/           ✅ Installed
├── backend/
│   ├── node_modules/       ✅ Installed
│   ├── .next/              ✅ Built (Next.js)
│   ├── public/
│   │   ├── index.html      ✅ Frontend copied
│   │   └── assets/         ✅ Frontend assets
│   ├── prisma/
│   │   └── seed.cjs        ✅ Ready to seed
│   └── .env                ✅ Production config
└── dist/                   ✅ Frontend build (temporary)
```

---

## 🎯 Key Points

1. **Build directory `./` is correct** - Root directory contains both frontend and backend
2. **`npm run build`** builds BOTH frontend and backend
3. **Frontend is copied** to `backend/public/` automatically
4. **Backend serves everything** - Frontend + APIs + Admin
5. **All requests** go through Next.js on port 3000
6. **Frontend routing** handled by React Router (client-side)
7. **Backend routing** handled by Next.js (server-side)

---

## 📝 Summary

- ✅ Build directory: `./` (root)
- ✅ Build command: `npm install && npm run build`
- ✅ Start command: `npm start`
- ✅ Port: 3000 (default Next.js)
- ✅ Frontend served from: `backend/public/`
- ✅ APIs served from: `backend/pages/api/`
- ✅ Admin served from: `backend/pages/admin/`

Everything is configured correctly! Just deploy and run migrations.

**Next:** Follow `HOSTINGER_DEPLOY_STEPS.md` for deployment
