# Backend Setup and Testing Guide

## 🚀 Quick Start

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Environment
1. Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```

2. Edit `.env` file with your database credentials:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/sudan_times"
JWT_SECRET="your-secret-key-change-this"
NEXT_PUBLIC_TINYMCE_API_KEY=""
```

### Step 3: Setup Database
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations (creates tables)
npm run prisma:migrate

# Seed database with initial data
npm run db:seed
```

### Step 4: Start Backend Server
```bash
npm run dev
```

Server will start at: **http://localhost:3000**

---

## 🧪 Testing the APIs

### Method 1: Using Browser Console

Open your browser to `http://localhost:3000/admin/login` and open DevTools Console (F12).

#### Test 1: Create an Article
```javascript
// Create a draft article
const response = await fetch('/api/articles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Test Article',
    content: 'This is a test article with some content to calculate read time properly.',
    excerpt: 'A test article',
    categoryId: 1,
    status: 'DRAFT'
  })
});

const article = await response.json();
console.log('Created article:', article);
```

#### Test 2: Create Breaking News
```javascript
// Create a breaking news article
const response = await fetch('/api/articles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'BREAKING: Important News',
    content: 'This is breaking news content that should appear prominently.',
    excerpt: 'Breaking news summary',
    categoryId: 1,
    breaking: true,
    status: 'PUBLISHED'
  })
});

const breakingArticle = await response.json();
console.log('Created breaking news:', breakingArticle);

// Verify it appears in breaking news endpoint
const breakingRes = await fetch('/api/breaking');
const breakingList = await breakingRes.json();
console.log('All breaking news:', breakingList);
```

#### Test 3: Upload Image
```javascript
// Create file input to select image
const input = document.createElement('input');
input.type = 'file';
input.accept = 'image/*';
input.onchange = async (e) => {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/admin/uploads', {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  console.log('Uploaded image:', result);
  console.log('Image URL:', result.url);
  
  // Now create article with this image
  const articleRes = await fetch('/api/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Article with Image',
      content: 'Content here...',
      excerpt: 'Description',
      image: result.url,
      categoryId: 1,
      status: 'PUBLISHED'
    })
  });
  
  const article = await articleRes.json();
  console.log('Article with image:', article);
};
input.click();
```

#### Test 4: Update Article to Breaking
```javascript
// Get article ID (replace 1 with actual ID)
const articleId = 1;

const response = await fetch(`/api/articles/${articleId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    breaking: true,
    status: 'PUBLISHED'
  })
});

const updated = await response.json();
console.log('Updated to breaking:', updated);
```

### Method 2: Using Admin UI

1. **Login**
   - Go to: `http://localhost:3000/admin/login`
   - Default credentials (after seeding):
     - Email: `admin@example.com`
     - Password: `admin123`

2. **Create Article**
   - Go to: `http://localhost:3000/admin/articles`
   - Click "إضافة خبر جديد" (Add New Article)
   - Fill in the form:
     - Title: "My Test Article"
     - Content: Add some text
     - Select a category
     - Check "Breaking" if needed
   - Click "نشر" (Publish)

3. **Upload Image**
   - In the article editor
   - Click file input under "الصورة المميزة" (Featured Image)
   - Select an image file
   - Wait for upload to complete
   - Image URL will be automatically set

4. **View Breaking News**
   - Open browser console
   - Run: `fetch('/api/breaking').then(r => r.json()).then(console.log)`

### Method 3: Using cURL (PowerShell)

#### Create Article
```powershell
$body = @{
    title = "Test Article"
    content = "Test content here"
    excerpt = "Test excerpt"
    categoryId = 1
    status = "PUBLISHED"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/articles" -Method Post -Body $body -ContentType "application/json"
```

#### Get All Articles
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/articles" -Method Get
```

#### Get Breaking News
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/breaking" -Method Get
```

---

## 🔍 Verification Checklist

After starting the backend, verify these endpoints:

### Public Endpoints (No Auth Required)
- [ ] `GET http://localhost:3000/api/articles` - Returns article list
- [ ] `GET http://localhost:3000/api/articles/1` - Returns single article
- [ ] `GET http://localhost:3000/api/breaking` - Returns breaking news
- [ ] `GET http://localhost:3000/api/categories` - Returns categories

### Admin Endpoints (Auth Required)
- [ ] `POST http://localhost:3000/api/articles` - Creates article
- [ ] `PATCH http://localhost:3000/api/articles/1` - Updates article
- [ ] `DELETE http://localhost:3000/api/articles/1` - Deletes article
- [ ] `POST http://localhost:3000/api/admin/uploads` - Uploads file

### Admin UI Pages
- [ ] `http://localhost:3000/admin/login` - Login page loads
- [ ] `http://localhost:3000/admin` - Dashboard loads with stats
- [ ] `http://localhost:3000/admin/articles` - Articles list loads
- [ ] `http://localhost:3000/admin/articles/new` - New article form
- [ ] `http://localhost:3000/admin/articles/1/edit` - Edit article form

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to database"
**Solution:**
1. Make sure PostgreSQL is running
2. Check DATABASE_URL in `.env` file
3. Verify database exists: `psql -U postgres -c "CREATE DATABASE sudan_times;"`
4. Run migrations: `npm run prisma:migrate`

### Issue: "Module not found"
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Prisma Client not generated"
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
1. Check if `public/uploads` directory exists
2. Create it manually if needed: `mkdir public\uploads`
3. Ensure write permissions

### Issue: "CORS error"
**Solution:**
CORS headers are already set in APIs. If still issues, check browser console for specific error.

---

## 📊 Database Schema

### Articles Table
```sql
- id (int, primary key)
- title (string)
- slug (string, unique)
- excerpt (string)
- content (text)
- readTime (string)
- featured (boolean)
- breaking (boolean)
- views (int)
- image (string)
- categoryId (int, foreign key)
- authorId (int, foreign key)
- status (enum: DRAFT, REVIEW, PUBLISHED)
- publishedAt (datetime, nullable)
- createdAt (datetime)
- updatedAt (datetime)
```

### Categories Table
```sql
- id (int, primary key)
- name (string, unique)
- slug (string, unique)
- subtitle (string, nullable)
- deskLead (string, nullable)
- deskEmail (string, nullable)
```

### Users Table
```sql
- id (int, primary key)
- email (string, unique)
- password (string, hashed)
- name (string, nullable)
- role (string, default: EDITOR)
- createdAt (datetime)
- updatedAt (datetime)
```

---

## 🔐 Default Credentials (After Seeding)

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

**Editor Account:**
- Email: `editor@example.com`
- Password: `editor123`

---

## 📝 Testing Scenarios

### Scenario 1: Complete Article Workflow
1. Login to admin panel
2. Navigate to Articles
3. Click "Add New Article"
4. Fill in title, content
5. Upload an image
6. Select category
7. Check "Breaking" checkbox
8. Click "Publish"
9. Verify article appears in list
10. Open browser console
11. Run: `fetch('/api/breaking').then(r=>r.json()).then(console.log)`
12. Verify article appears in breaking news

### Scenario 2: Create via API, View in UI
1. Open browser console
2. Create article via API (see Test 2 above)
3. Go to admin articles page
4. Verify article appears in list
5. Click edit
6. Verify all fields are populated correctly

### Scenario 3: Upload and Display
1. Create article with image upload
2. Verify image appears in article editor
3. Publish article
4. Open `/api/articles` in browser
5. Verify article has image URL
6. Copy image URL and open in new tab
7. Verify image loads

---

## 🎯 Expected Results

### After Creating Article
```json
{
  "id": 1,
  "title": "Test Article",
  "slug": "test-article",
  "content": "...",
  "status": "PUBLISHED",
  "breaking": false,
  "featured": false,
  "categoryId": 1,
  "category": {
    "id": 1,
    "name": "Politics",
    "slug": "politics"
  },
  "readTime": "1 min read",
  "views": 0,
  "publishedAt": "2024-01-15T10:00:00.000Z",
  ...
}
```

### After Uploading Image
```json
{
  "url": "/uploads/image-1234567890.jpg",
  "type": "image",
  "filename": "original.jpg",
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
    "author": {...}
  }
]
```

---

## 📞 Support

If you encounter any issues:
1. Check browser console for errors
2. Check backend terminal for error logs
3. Verify database connection
4. Check `.env` configuration
5. Refer to `API_DOCUMENTATION.md` for detailed API specs

---

## ✅ Success Indicators

You'll know everything is working when:
- ✅ Backend starts without errors
- ✅ Admin login works
- ✅ Dashboard loads with correct stats
- ✅ Can create articles via UI
- ✅ Can upload images
- ✅ Breaking news endpoint returns correct data
- ✅ Articles list displays properly
- ✅ No React errors in console

---

**Ready to test? Start with Step 1! 🚀**
