# API Testing Guide

## Quick Start Testing

### Prerequisites
1. Make sure your backend is running: `npm run dev`
2. Database should be set up and seeded
3. Have an admin account ready

---

## Testing with Browser (Simple)

### 1. Test GET Articles
Open in browser:
```
http://localhost:3000/api/articles
```

### 2. Test GET Breaking News
```
http://localhost:3000/api/breaking
```

### 3. Test GET Categories
```
http://localhost:3000/api/categories
```

---

## Testing with JavaScript Console

Open browser console and paste these:

### Create Article
```javascript
fetch('/api/articles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Test Article from Console',
    content: 'This is a test article created from the browser console. It has enough content to generate a read time estimate.',
    excerpt: 'A test article',
    categoryId: 1,
    status: 'DRAFT',
    featured: false,
    breaking: false
  })
})
.then(r => r.json())
.then(data => console.log('Created:', data))
.catch(err => console.error('Error:', err));
```

### Update Article (replace ID)
```javascript
fetch('/api/articles/1', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Updated Title',
    breaking: true,
    status: 'PUBLISHED'
  })
})
.then(r => r.json())
.then(data => console.log('Updated:', data))
.catch(err => console.error('Error:', err));
```

### Upload Image
```javascript
// First, create an input element
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
  console.log('Uploaded:', result);
  console.log('Use this URL:', result.url);
};
input.click();
```

---

## Testing with cURL

### Get All Articles
```bash
curl http://localhost:3000/api/articles
```

### Create Article
```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Article via cURL",
    "content": "This is test content for the article. It should be long enough to calculate read time properly.",
    "excerpt": "Test excerpt",
    "categoryId": 1,
    "status": "DRAFT",
    "featured": false,
    "breaking": false
  }'
```

### Update Article
```bash
curl -X PATCH http://localhost:3000/api/articles/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "status": "PUBLISHED"
  }'
```

### Get Single Article
```bash
curl http://localhost:3000/api/articles/1
```

### Delete Article
```bash
curl -X DELETE http://localhost:3000/api/articles/1
```

### Upload Image
```bash
curl -X POST http://localhost:3000/api/admin/uploads \
  -F "file=@/path/to/your/image.jpg"
```

### Get Breaking News
```bash
curl http://localhost:3000/api/breaking
```

### Publish Article (requires authentication)
```bash
curl -X POST http://localhost:3000/api/admin/articles/publish \
  -H "Content-Type: application/json" \
  -H "Cookie: st_token=YOUR_TOKEN_HERE" \
  -d '{
    "id": 1,
    "action": "publish"
  }'
```

---

## Testing with Postman/Insomnia

### Setup
1. Import the base URL: `http://localhost:3000`
2. Set default headers:
   - `Content-Type: application/json`

### Collection Structure

#### 1. Articles
- GET `/api/articles` - Get all
- GET `/api/articles/1` - Get single
- POST `/api/articles` - Create
- PATCH `/api/articles/1` - Update
- DELETE `/api/articles/1` - Delete

#### 2. Breaking News
- GET `/api/breaking` - Get breaking news

#### 3. Uploads
- POST `/api/admin/uploads`
  - Type: multipart/form-data
  - Key: file
  - Value: [select file]

#### 4. Publish (Auth Required)
- POST `/api/admin/articles/publish`
  - Body: `{ "id": 1, "action": "publish" }`

---

## Test Scenarios

### Scenario 1: Create and Publish Article
```javascript
// Step 1: Create draft
const createResponse = await fetch('/api/articles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My New Article',
    content: 'Article content here...',
    excerpt: 'Short description',
    categoryId: 1,
    status: 'DRAFT'
  })
});
const article = await createResponse.json();
console.log('Created article ID:', article.id);

// Step 2: Publish it
const publishResponse = await fetch('/api/articles/' + article.id, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status: 'PUBLISHED'
  })
});
const published = await publishResponse.json();
console.log('Published:', published);
```

### Scenario 2: Upload Image and Create Article
```javascript
// Step 1: Upload image
async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/admin/uploads', {
    method: 'POST',
    body: formData
  });
  
  return await response.json();
}

// Step 2: Create article with image
async function createArticleWithImage(imageFile) {
  const uploadResult = await uploadImage(imageFile);
  console.log('Image uploaded:', uploadResult.url);
  
  const response = await fetch('/api/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Article with Image',
      content: 'Content here...',
      excerpt: 'Description',
      image: uploadResult.url,
      categoryId: 1,
      status: 'PUBLISHED'
    })
  });
  
  return await response.json();
}
```

### Scenario 3: Create Breaking News
```javascript
const response = await fetch('/api/articles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'BREAKING: Important News',
    content: 'Breaking news content...',
    excerpt: 'Breaking news summary',
    categoryId: 1,
    breaking: true,
    status: 'PUBLISHED'
  })
});

const breakingArticle = await response.json();
console.log('Breaking news created:', breakingArticle.id);

// Verify it appears in breaking news endpoint
const breakingResponse = await fetch('/api/breaking');
const breakingList = await breakingResponse.json();
console.log('Breaking news list:', breakingList);
```

---

## Expected Responses

### Success - Create Article (201)
```json
{
  "id": 1,
  "title": "Test Article",
  "slug": "test-article",
  "content": "Content...",
  "status": "DRAFT",
  "createdAt": "2024-01-15T10:00:00.000Z",
  ...
}
```

### Success - Upload Image (201)
```json
{
  "url": "/uploads/image-1234567890.jpg",
  "type": "image",
  "filename": "original.jpg",
  "size": 245760,
  "mimetype": "image/jpeg"
}
```

### Error - Validation Failed (400)
```json
{
  "error": "Title is required"
}
```

### Error - Not Found (404)
```json
{
  "error": "Article not found"
}
```

### Error - Server Error (500)
```json
{
  "error": "Failed to create article",
  "details": "Additional error details"
}
```

---

## Validation Tests

### Test Invalid Data
```javascript
// Missing required field
fetch('/api/articles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    excerpt: 'Only excerpt, no title or content'
  })
})
.then(r => r.json())
.then(data => console.log('Should fail:', data));

// Empty title
fetch('/api/articles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: '',
    content: 'Some content'
  })
})
.then(r => r.json())
.then(data => console.log('Should fail:', data));

// Invalid category ID
fetch('/api/articles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Test',
    content: 'Content',
    categoryId: 999999
  })
})
.then(r => r.json())
.then(data => console.log('Should fail:', data));
```

---

## Performance Testing

### Bulk Create Articles (Load Test)
```javascript
async function createMultipleArticles(count) {
  const results = [];
  
  for (let i = 0; i < count; i++) {
    const response = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `Test Article ${i + 1}`,
        content: `This is test article number ${i + 1} with some content.`,
        excerpt: `Test ${i + 1}`,
        categoryId: 1,
        status: 'DRAFT'
      })
    });
    
    const article = await response.json();
    results.push(article);
    console.log(`Created ${i + 1}/${count}`);
  }
  
  return results;
}

// Create 10 test articles
createMultipleArticles(10).then(results => {
  console.log('All articles created:', results.length);
});
```

---

## Troubleshooting

### Issue: CORS Error
**Solution:** Make sure CORS headers are set in API responses. Already implemented in `/api/articles` and `/api/breaking`.

### Issue: 413 Payload Too Large
**Solution:** File too big. Images max 10MB, videos max 100MB.

### Issue: 401 Unauthorized
**Solution:** Login first via `/api/auth/login` to get authentication cookie.

### Issue: Prisma Error P2002
**Solution:** Duplicate slug. Change the slug or let it auto-generate.

### Issue: Prisma Error P2025
**Solution:** Record not found. Check if ID exists.

---

## Cleanup After Testing

### Delete Test Articles
```javascript
// Get all articles
const response = await fetch('/api/articles');
const articles = await response.json();

// Delete all test articles
for (const article of articles) {
  if (article.title.includes('Test')) {
    await fetch(`/api/articles/${article.id}`, { method: 'DELETE' });
    console.log(`Deleted: ${article.title}`);
  }
}
```

### Reset Breaking News
```javascript
// Get all articles
const response = await fetch('/api/articles');
const articles = await response.json();

// Unset breaking for all
for (const article of articles) {
  if (article.breaking) {
    await fetch(`/api/articles/${article.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ breaking: false })
    });
    console.log(`Unset breaking: ${article.title}`);
  }
}
```

---

## Next Steps

After testing APIs:
1. ✅ Verify all CRUD operations work
2. ✅ Test file uploads (images and videos)
3. ✅ Test breaking news endpoint
4. ✅ Test validation and error handling
5. ✅ Test with frontend integration
6. 🔄 Monitor logs for any errors
7. 🔄 Set up automated tests (optional)

Good luck with testing! 🚀
