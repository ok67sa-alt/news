# API Quick Reference Card

## 📝 Articles

### Create
```javascript
POST /api/articles
{
  "title": "Article Title",
  "content": "Content...",
  "excerpt": "Description",
  "categoryId": 1,
  "breaking": false,
  "featured": false,
  "status": "DRAFT"
}
```

### Update
```javascript
PATCH /api/articles/5
{
  "title": "New Title",
  "breaking": true,
  "status": "PUBLISHED"
}
```

### Get All
```javascript
GET /api/articles
```

### Get One
```javascript
GET /api/articles/5
```

### Delete
```javascript
DELETE /api/articles/5
```

---

## 📸 File Upload

```javascript
const formData = new FormData();
formData.append('file', fileObject);

const res = await fetch('/api/admin/uploads', {
  method: 'POST',
  body: formData
});

const { url } = await res.json();
// Use url in article.image
```

**Limits:**
- Images: 10MB (jpg, png, gif, webp, svg)
- Videos: 100MB (mp4, webm, ogg)

---

## 🔴 Breaking News

### Get Breaking News
```javascript
GET /api/breaking
```

### Set as Breaking
```javascript
PATCH /api/articles/5
{ "breaking": true, "status": "PUBLISHED" }
```

### Or use publish API
```javascript
POST /api/admin/articles/publish
{ "id": 5, "action": "set-breaking" }
```

---

## 📤 Publish Management

```javascript
POST /api/admin/articles/publish
{ "id": 5, "action": "publish" }
```

**Actions:**
- `publish` - Publish article
- `unpublish` - Unpublish article  
- `toggle-featured` - Toggle featured
- `toggle-breaking` - Toggle breaking
- `set-breaking` - Set breaking + publish
- `unset-breaking` - Remove breaking

---

## ✅ Auto-Features

- **Slug**: Auto-generated from title
- **ReadTime**: Auto-calculated from content
- **PublishedAt**: Auto-set when publishing
- **Unique Slugs**: Auto-resolved if duplicate

---

## ⚠️ Required Fields

### Create Article
- ✅ `title` (string, not empty)
- ✅ `content` (string, not empty)

### Update Article
- All fields optional
- But `title` can't be empty if provided

---

## 🔐 Authentication

Required for:
- `/api/admin/uploads`
- `/api/admin/articles/publish`

Cookie: `st_token` (set via `/api/auth/login`)

---

## 📊 Response Format

### Success
```json
{
  "id": 1,
  "title": "...",
  "category": { "id": 1, "name": "Politics" },
  "author": { "id": 1, "name": "John Doe" },
  ...
}
```

### Error
```json
{
  "error": "Error message",
  "details": "Additional info"
}
```

---

## 🎯 Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad request (validation error)
- `401` - Unauthorized
- `404` - Not found
- `405` - Method not allowed
- `500` - Server error

---

## 🔥 Quick Examples

### Complete Article Flow
```javascript
// 1. Upload image
const formData = new FormData();
formData.append('file', imageFile);
const uploadRes = await fetch('/api/admin/uploads', {
  method: 'POST',
  body: formData
});
const { url } = await uploadRes.json();

// 2. Create article
const createRes = await fetch('/api/articles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My Article',
    content: 'Content here...',
    excerpt: 'Description',
    image: url,
    categoryId: 1,
    breaking: true,
    status: 'PUBLISHED'
  })
});
const article = await createRes.json();
console.log('Created:', article.id);
```

### Get Breaking News
```javascript
const res = await fetch('/api/breaking');
const breaking = await res.json();
console.log(`${breaking.length} breaking news`);
```

### Toggle Featured
```javascript
await fetch('/api/articles/5', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ featured: true })
});
```

---

## 🛠️ Validation Rules

| Field | Type | Rules |
|-------|------|-------|
| title | string | Required, not empty |
| content | string | Required, not empty |
| slug | string | Unique, auto-generated |
| excerpt | string | Optional |
| image | string | Optional, URL |
| categoryId | number | Must exist in DB |
| authorId | number | Must exist in DB |
| featured | boolean | Default: false |
| breaking | boolean | Default: false |
| status | enum | DRAFT, REVIEW, PUBLISHED |

---

## 💡 Tips

1. **Always upload images first**, then create article with URL
2. **Let slug auto-generate** unless you need a specific one
3. **ReadTime auto-calculates**, no need to set manually
4. **Breaking news auto-publishes** when using `set-breaking` action
5. **Status changes auto-manage publishedAt**
6. **All relations auto-included** in responses

---

## 🐛 Common Errors

### "Title is required"
→ Add title to request body

### "An article with this slug already exists"
→ Change slug or leave empty for auto-generation

### "Invalid categoryId"
→ Use a valid category ID from `/api/categories`

### "File too large"
→ Images max 10MB, videos max 100MB

### "Invalid file type"
→ Use allowed types (jpg, png, gif, webp, svg, mp4, webm)

---

## 📞 Need Help?

- Full docs: `API_DOCUMENTATION.md`
- Testing guide: `TEST_APIS.md`
- Summary: `API_FIXES_SUMMARY.md`

---

**Last Updated:** December 2024  
**Version:** 2.0  
**Status:** ✅ Production Ready
