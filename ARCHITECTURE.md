# 🏗️ Sudan Times Architecture

## 📊 How Your Project is Structured

```
┌─────────────────────────────────────────────────────────────┐
│                    SUDAN TIMES PROJECT                       │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────────┐
│   FRONTEND (React)   │         │  BACKEND (Next.js)       │
│   Port: Dev only     │────────▶│  Port: 3000              │
│   Build: Vite        │  copies │  Serves: Everything      │
└──────────────────────┘         └──────────────────────────┘
         │                                    │
         │ npm run build:frontend            │
         │                                    │
         ▼                                    ▼
    ┌─────────┐                    ┌──────────────────┐
    │  dist/  │─────────────────▶  │ backend/public/  │
    └─────────┘  copy-frontend.js  └──────────────────┘
                                             │
                                             │
                    ┌────────────────────────┴────────────────┐
                    │                                         │
                    ▼                                         ▼
            ┌──────────────┐                      ┌─────────────────┐
            │   Frontend   │                      │   Admin Panel   │
            │   /          │                      │   /admin/*      │
            │   /category  │                      │                 │
            │   /article   │                      │   + API Routes  │
            └──────────────┘                      │   /api/*        │
                                                  └─────────────────┘
```

---

## 🔄 Build Process Flow

```
START: npm run build
│
├─▶ Step 1: vite build
│   └─▶ Compiles React app
│       └─▶ Creates dist/
│           ├── index.html
│           └── assets/
│               ├── index-abc123.js
│               └── index-xyz789.css
│
├─▶ Step 2: node copy-frontend.js
│   └─▶ Copies dist/ to backend/public/
│       └─▶ backend/public/
│           ├── index.html  ✅ Copied
│           └── assets/     ✅ Copied
│
├─▶ Step 3: cd backend && npm install
│   └─▶ Installs backend dependencies
│
├─▶ Step 4: npx prisma generate
│   └─▶ Generates Prisma Client
│
└─▶ Step 5: npm run build (in backend/)
    └─▶ Builds Next.js
        └─▶ Creates backend/.next/
            ├── server/     (Server-side code)
            └── static/     (Static assets)

END: Ready to deploy!
```

---

## 🌐 Request Flow (Production)

```
User visits https://your-domain.com
│
└─▶ Nginx (port 80/443)
    │
    └─▶ Reverse proxy to localhost:3000
        │
        └─▶ Next.js Server (backend/)
            │
            ├─▶ Request: /
            │   └─▶ Serves: backend/public/index.html
            │       └─▶ React app loads
            │           └─▶ Client-side routing
            │
            ├─▶ Request: /api/articles
            │   └─▶ Next.js API route
            │       └─▶ backend/pages/api/articles/index.ts
            │           └─▶ Prisma query to MySQL
            │               └─▶ Returns JSON
            │
            ├─▶ Request: /admin/login
            │   └─▶ Next.js page
            │       └─▶ backend/pages/admin/login.tsx
            │           └─▶ Returns HTML
            │
            └─▶ Request: /category/politics
                └─▶ Serves: backend/public/index.html
                    └─▶ React Router handles routing
                        └─▶ Fetches /api/articles?category=politics
```

---

## 🗂️ Directory Structure

```
sudan-times/
│
├── src/                          # Frontend source code
│   ├── pages/
│   │   ├── Home.tsx              # Homepage
│   │   ├── CategoryPage.tsx      # Category pages
│   │   └── ArticlePage.tsx       # Article detail
│   ├── components/
│   ├── utils/
│   └── App.tsx
│
├── backend/                      # Backend source code
│   ├── pages/
│   │   ├── api/                  # API routes
│   │   │   ├── articles/
│   │   │   ├── categories/
│   │   │   └── auth/
│   │   └── admin/                # Admin panel
│   │       ├── login.tsx
│   │       ├── articles.tsx
│   │       └── [id]/edit.tsx
│   │
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   ├── seed.cjs              # Database seeding
│   │   └── migrations/           # Database migrations
│   │
│   ├── public/                   # Static files
│   │   ├── index.html            # Frontend (copied from dist/)
│   │   ├── assets/               # Frontend assets
│   │   └── uploads/              # Uploaded images (local)
│   │
│   ├── .next/                    # Next.js build output
│   └── .env                      # Environment variables
│
├── dist/                         # Vite build output (temporary)
├── copy-frontend.js              # Copies dist/ to backend/public/
├── package.json                  # Root build orchestrator
└── README_DEPLOYMENT.md          # Deployment guide
```

---

## 🎯 Key Concepts

### 1. **Why Two Build Steps?**
- **Frontend (React/Vite)**: Fast, modern SPA
- **Backend (Next.js)**: Server-side rendering + APIs
- **Result**: One unified application

### 2. **Why Copy Frontend to Backend?**
- Next.js serves everything from one server
- Frontend becomes "static files" served by backend
- Simplifies deployment (one server, one port)

### 3. **How Routing Works?**
- **Client-side** (React Router): `/`, `/category/*`, `/article/*`
- **Server-side** (Next.js): `/api/*`, `/admin/*`
- **Fallback**: All non-API routes → `index.html` → React Router

### 4. **Where is the Database?**
- **MySQL** on Hostinger (localhost:3306)
- **Prisma** connects from backend
- **Migrations** run from backend directory

---

## 🚀 Deployment Summary

### Hostinger Configuration

| Setting | Value | Explanation |
|---------|-------|-------------|
| **Build Directory** | `./` | Root contains both frontend & backend |
| **Build Command** | `npm run build` | Builds both frontend and backend |
| **Start Command** | `npm start` | Starts Next.js server (port 3000) |
| **Node Version** | 18.x or 20.x | LTS recommended |

### What Happens:
1. ✅ Hostinger runs `npm install` (root)
2. ✅ Hostinger runs `npm run build`:
   - Builds frontend with Vite → `dist/`
   - Copies frontend to `backend/public/`
   - Installs backend deps
   - Generates Prisma Client
   - Builds Next.js backend
3. ✅ Hostinger runs `npm start`:
   - Starts Next.js on port 3000
   - Serves frontend from `backend/public/`
   - Handles API requests
   - Handles admin panel

---

## ✅ Why This Architecture?

### ✅ Pros:
- ✅ **Single deployment** (one server)
- ✅ **No CORS issues** (same origin)
- ✅ **SEO friendly** (Next.js can SSR)
- ✅ **Fast frontend** (Vite build)
- ✅ **Powerful backend** (Next.js + Prisma)
- ✅ **Easy deployment** (one command)

### ⚠️ Considerations:
- Build takes longer (builds both)
- Requires Node.js hosting
- Frontend rebuild = full rebuild

---

## 🔍 How to Verify Build is Correct

After `npm run build`, check:

```bash
# 1. Frontend built?
ls -la dist/
# Should see: index.html, assets/

# 2. Frontend copied to backend?
ls -la backend/public/
# Should see: index.html, assets/

# 3. Backend built?
ls -la backend/.next/
# Should see: server/, static/

# 4. Prisma generated?
ls -la backend/node_modules/.prisma/client/
# Should exist

# All good? ✅ Ready to deploy!
```

---

## 📚 Related Documentation

- `HOSTINGER_BUILD_GUIDE.md` - Build configuration details
- `HOSTINGER_DEPLOY_STEPS.md` - Deployment instructions
- `README_DEPLOYMENT.md` - Quick reference
- `MYSQL_MIGRATION_GUIDE.md` - Database setup

---

**Architecture is solid! Ready for Hostinger deployment! 🚀**
