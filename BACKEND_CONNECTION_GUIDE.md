# 🚀 Backend Connection & Testing Guide

## Quick Start (5 Minutes)

### Step 1: Install & Setup
```bash
cd backend
npm install
```

### Step 2: Configure Database
1. Create `.env` file (copy from `.env.example`):
```bash
copy .env.example .env
```

2. Edit `.env` with your PostgreSQL credentials:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/sudan_times"
JWT_SECRET="change-this-secret-key"
```

### Step 3: Initialize Database
```bash
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
```

### Step 4: Start Server
```bash
npm run dev
```

✅ Server running at: **http://localhost:3000**

---

## 🧪 Testing Methods

### Method 1: Visual Testing Tool (Recommended)
1. Open `backend/test-api.html` in your browser
2. Click each test button to verify APIs
3. All results shown in real-time

**Tests included:**
- ✅ Get all articles
- ✅ Create article
- ✅ Create breaking news
- ✅ Get breaking news
- ✅ Upload image
- ✅ Update article

### Method 2: Admin UI
1. Open: `http://localhost:3000/admin/login`
2. Login with:
   - Email: `admin@local`
   - Password: `changeme`
3. Navigate through:
   - Dashboard (view stats)
   - Articles (create/edit)
   - Upload images
   - Set breaking news

### Method 3: Browser Console
Open `http://localhost:3000` and press F12 (DevTools):

```javascript
// Test 1: Get articles
fetch('/api/articles')
  .then(r => r.json())
  .then(console.log);

// Test 2: Create breaking news
fetch('/api/articles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'BREAKING: Test News',
    content: 'This is breaking news content...',
    excerpt: 'Summary',
    categoryId: 1,
    breaking: true,
    status: 'PUBLISHED'
  })
})
.then(r => r.json())
.then(console.log);

// Test 3: Get breaking news
fetch('/api/breaking')
  .then(r => r.json())
  .then(console.log);
```

---

## ✅ Verification Checklist

### Backend Running
- [ ] No errors in terminal
- [ ] Server shows: "ready - started server on 0.0.0.0:3000"
- [ ] Can access http://localhost:3000

### Database Connected
- [ ] Migrations ran successfully
- [ ] Seed completed without errors
- [ ] Default user created

### APIs Working
- [ ] GET `/api/articles` returns data
- [ ] POST `/api/articles` creates article
- [ ] GET `/api/breaking` returns breaking news
- [ ] POST `/api/admin/uploads` uploads files

### Admin UI Working
- [ ] Login page loads
- [ ] Can login successfully
- [ ] Dashboard shows stats
- [ ] Articles page displays list
- [ ] Can create new article
- [ ] Can upload images
- [ ] Can set breaking news

---

## 🎯 Testing Scenarios

### Scenario 1: Create & Publish Article
1. Open admin UI → Articles
2. Click "إضافة خبر جديد"
3. Fill form:
   - Title: "Test Article"
   - Content: (add some text)
   - Category: Select one
4. Click "نشر" (Publish)
5. ✅ Article appears in list

### Scenario 2: Create Breaking News
Using browser console:
```javascript
const res = await fetch('/api/articles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'BREAKING: Important',
    content: 'Breaking news content...',
    excerpt: 'Summary',
    categoryId: 1,
    breaking: true,
    status: 'PUBLISHED'
  })
});
const article = await res.json();
console.log('Created:', article);

// Verify it's in breaking news
const breaking = await fetch('/api/breaking').then(r => r.json());
console.log('Breaking news:', breaking);
```

### Scenario 3: Upload & Use Image
1. Create article in admin
2. Click file input under image section
3. Select image file
4. Wait for upload
5. ✅ Image URL appears in input
6. Save article
7. Verify image URL in article data

---

## 📊 Expected Results

### Successful Article Creation
```json
{
  "id": 1,
  "title": "Test Article",
  "slug": "test-article",
  "content": "...",
  "status": "PUBLISHED",
  "breaking": false,
  "categoryId": 1,
  "category": {
    "id": 1,
    "name": "Politics",
    "slug": "politics"
  },
  "readTime": "1 min read",
  "publishedAt": "2024-01-15T10:00:00.000Z"
}
```

### Successful Image Upload
```json
{
  "url": "/uploads/image-1234567890.jpg",
  "type": "image",
  "filename": "image.jpg",
  "size": 245760,
  "mimetype": "image/jpeg"
}
```

### Breaking News List
```json
[
  {
    "id": 5,
    "title": "BREAKING: News",
    "breaking": true,
    "status": "PUBLISHED",
    "category": {...},
    "publishedAt": "2024-01-15T10:00:00.000Z"
  }
]
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to database"
**Solution:**
```bash
# 1. Check PostgreSQL is running
# 2. Verify DATABASE_URL in .env
# 3. Create database if needed
createdb sudan_times

# 4. Run migrations again
npm run prisma:migrate
```

### Issue: "Prisma Client not found"
**Solution:**
```bash
npm run prisma:generate
```

### Issue: "No categories found"
**Solution:**
```bash
npm run db:seed
```

### Issue: "Upload failed"
**Solution:**
```bash
# Create uploads directory
mkdir public\uploads
```

### Issue: "React object rendering error"
**Solution:**
Already fixed! The cleanApiResponse helper removes nested objects.

---

## 📂 File Structure

```
backend/
├── pages/
│   ├── api/
│   │   ├── articles/           # Articles CRUD APIs
│   │   ├── breaking.ts          # Breaking news API
│   │   └── admin/
│   │       └── uploads.ts       # File upload API
│   └── admin/
│       ├── index.tsx            # Dashboard
│       ├── articles.tsx         # Articles list
│       └── articles/[id]/edit.tsx  # Article editor
├── lib/
│   └── cleanApiResponse.ts      # Helper for cleaning API responses
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.cjs                 # Database seeder
├── test-api.html                # Visual API testing tool
└── SETUP_AND_TEST.md            # Detailed setup guide
```

---

## 🔐 Default Credentials

After seeding:
- **Email:** `admin@local`
- **Password:** `changeme`

---

## 📞 Support Resources

- **Setup Guide:** `backend/SETUP_AND_TEST.md`
- **API Docs:** `backend/API_DOCUMENTATION.md`
- **API Reference:** `backend/API_QUICK_REFERENCE.md`
- **Testing Guide:** `backend/TEST_APIS.md`
- **Visual Tester:** `backend/test-api.html`

---

## ✨ Success Indicators

Everything working when:
- ✅ Server starts without errors
- ✅ Admin login works
- ✅ Dashboard loads with stats
- ✅ Can create articles
- ✅ Can upload images
- ✅ Breaking news API returns data
- ✅ No React errors in console

---

## 🎉 You're Ready!

1. Start backend: `npm run dev`
2. Open: `http://localhost:3000/admin`
3. Login and test
4. Or use `test-api.html` for quick testing

**Happy coding! 🚀**
