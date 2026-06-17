# 🚀 START HERE - Quick Launch Guide

## ⚡ 3-Minute Setup

### Step 1: Install Dependencies (1 min)
```bash
cd backend
npm install
```

### Step 2: Configure Database (30 sec)
```bash
# Copy environment file
copy .env.example .env

# Edit .env file - set your PostgreSQL connection:
# DATABASE_URL="postgresql://user:password@localhost:5432/sudan_times"
```

### Step 3: Initialize Database (1 min)
```bash
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
```

### Step 4: Start Server (30 sec)
```bash
npm run dev
```

✅ **Done!** Server running at http://localhost:3000

---

## 🧪 Quick Test (30 seconds)

### Option 1: Visual Tester (Easiest)
Open in browser: `backend/test-api.html`
Click test buttons → See results

### Option 2: Admin UI
1. Go to: http://localhost:3000/admin/login
2. Login: `admin@local` / `changeme`
3. Create article
4. Set breaking news

### Option 3: Console Test
Open http://localhost:3000, press F12:
```javascript
// Create breaking news
fetch('/api/articles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'BREAKING: Test',
    content: 'Content...',
    categoryId: 1,
    breaking: true,
    status: 'PUBLISHED'
  })
}).then(r => r.json()).then(console.log);

// Get breaking news
fetch('/api/breaking').then(r => r.json()).then(console.log);
```

---

## 📚 Documentation

- **Setup Guide:** `backend/SETUP_AND_TEST.md`
- **Connection Guide:** `BACKEND_CONNECTION_GUIDE.md`
- **API Docs:** `backend/API_DOCUMENTATION.md`
- **Quick Reference:** `backend/API_QUICK_REFERENCE.md`
- **Complete Summary:** `backend/COMPLETE_SUMMARY.md`

---

## ✅ Success Checklist

- [ ] Server started without errors
- [ ] Can access http://localhost:3000
- [ ] Can login to admin panel
- [ ] Dashboard loads with stats
- [ ] Can create article
- [ ] Can upload image
- [ ] Breaking news API works

---

## 🆘 Quick Troubleshooting

**Database error?**
```bash
# Create database
createdb sudan_times
# Run migrations
npm run prisma:migrate
```

**Missing dependencies?**
```bash
npm install
```

**Prisma error?**
```bash
npm run prisma:generate
```

---

## 🎯 What's Working

✅ **Admin UI** - Modern, responsive, RTL-ready
✅ **Articles API** - Create, read, update, delete
✅ **Breaking News** - Dedicated endpoint
✅ **File Upload** - Images & videos
✅ **Database** - Fully configured
✅ **Documentation** - Comprehensive guides

---

## 🎉 You're Ready!

Start testing and building amazing features! 🚀

**Questions?** Check the documentation files above.
