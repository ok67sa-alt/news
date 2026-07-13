# Backend API Documentation

## Overview
This document describes all the backend APIs for managing articles, breaking news, images, and videos.

---

## Articles API

### 1. Get All Articles
**Endpoint:** `GET /api/articles`

**Description:** Retrieve all articles with optional filtering.

**Response:**
```json
[
  {
    "id": 1,
    "title": "Article Title",
    "slug": "article-title",
    "excerpt": "Short description",
    "content": "Full article content...",
    "readTime": "5 min read",
    "image": "/uploads/image.jpg",
    "featured": false,
    "breaking": false,
    "views": 150,
    "status": "PUBLISHED",
    "categoryId": 1,
    "category": { "id": 1, "name": "Politics", "slug": "politics" },
    "authorId": 1,
    "author": { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "EDITOR" },
    "publishedAt": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### 2. Create Article
**Endpoint:** `POST /api/articles`

**Description:** Create a new article.

**Request Body:**
```json
{
  "title": "Article Title",
  "slug": "article-title",
  "excerpt": "Short description",
  "content": "Full article content...",
  "image": "/uploads/image.jpg",
  "categoryId": 1,
  "featured": false,
  "breaking": false,
  "status": "DRAFT",
  "authorId": 1,
  "authorRole": "EDITOR"
}
```

**Required Fields:**
- `title` (string)
- `content` (string)

**Optional Fields:**
- `slug` (string) - Auto-generated from title if not provided
- `excerpt` (string) - Default: empty
- `image` (string) - Default: empty
- `readTime` (string) - Auto-calculated from content if not provided
- `categoryId` (number) - Default: null
- `authorId` (number) - Default: null
- `authorRole` (string) - Default: null
- `featured` (boolean) - Default: false
- `breaking` (boolean) - Default: false
- `status` (enum: 'DRAFT' | 'REVIEW' | 'PUBLISHED') - Default: 'DRAFT'
- `publishedAt` (ISO date string) - Auto-set when status is PUBLISHED

**Validation:**
- Title must not be empty
- Content must not be empty
- Slug must be unique (auto-modified if duplicate)
- CategoryId must exist in database
- AuthorId must exist in database

**Response:** Created article object (status 201)

**Errors:**
- 400: Missing required fields or validation failed
- 500: Server error

---

### 3. Get Single Article
**Endpoint:** `GET /api/articles/[id]`

**Description:** Retrieve a single article by ID.

**Response:** Article object (same structure as GET all)

**Errors:**
- 400: Invalid ID format
- 404: Article not found
- 500: Server error

---

### 4. Update Article
**Endpoint:** `PATCH /api/articles/[id]` or `PUT /api/articles/[id]`

**Description:** Update an existing article.

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "slug": "updated-slug",
  "excerpt": "Updated excerpt",
  "content": "Updated content...",
  "image": "/uploads/new-image.jpg",
  "categoryId": 2,
  "featured": true,
  "breaking": true,
  "status": "PUBLISHED"
}
```

**Auto-behaviors:**
- When `title` changes and `slug` not provided → slug auto-updated
- When `content` changes → readTime auto-calculated
- When `status` changes to 'PUBLISHED' → publishedAt auto-set to now
- When `status` changes to 'DRAFT' or 'REVIEW' → publishedAt cleared

**Validation:**
- Title cannot be empty
- Slug must be unique (excluding current article)
- CategoryId must exist if provided
- AuthorId must exist if provided

**Response:** Updated article object (status 200)

**Errors:**
- 400: Invalid data or validation failed
- 404: Article not found
- 500: Server error

---

### 5. Delete Article
**Endpoint:** `DELETE /api/articles/[id]`

**Description:** Delete an article by ID.

**Response:**
```json
{
  "message": "Article deleted successfully"
}
```

**Errors:**
- 404: Article not found
- 500: Server error

---

## Breaking News API

### Get Breaking News
**Endpoint:** `GET /api/breaking`

**Description:** Get all published breaking news articles (max 10, most recent first).

**Response:**
```json
[
  {
    "id": 5,
    "title": "Breaking News Title",
    "breaking": true,
    "status": "PUBLISHED",
    ...
  }
]
```

---

## Publish/Status Management API

### Manage Article Status
**Endpoint:** `POST /api/admin/articles/publish`

**Description:** Publish, unpublish, or toggle article features.

**Authentication:** Required (Admin or Editor role)

**Request Body:**
```json
{
  "id": 5,
  "action": "publish"
}
```

**Available Actions:**
- `publish` - Set status to PUBLISHED and set publishedAt
- `unpublish` - Set status to DRAFT and clear publishedAt
- `toggle-featured` - Toggle featured flag
- `toggle-breaking` - Toggle breaking flag
- `set-breaking` - Set breaking=true and publish if not already
- `unset-breaking` - Set breaking=false

**Response:** Updated article object

**Errors:**
- 400: Missing id or invalid action
- 401: Unauthorized (not logged in or insufficient permissions)
- 404: Article not found
- 500: Server error

---

## File Upload API

### Upload Image or Video
**Endpoint:** `POST /api/admin/uploads`

**Description:** Upload an image or video file.

**Content-Type:** `multipart/form-data`

**Request:**
- Field name: `file` or `files`
- File types:
  - **Images:** jpeg, jpg, png, gif, webp, svg (max 10MB)
  - **Videos:** mp4, webm, ogg, quicktime (max 100MB)

**Example (JavaScript):**
```javascript
const formData = new FormData();
formData.append('file', fileObject);

const response = await fetch('/api/admin/uploads', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result.url); // Use this URL in article
```

**Response:**
```json
{
  "url": "/uploads/image-1234567890.jpg",
  "type": "image",
  "filename": "original-filename.jpg",
  "size": 245760,
  "mimetype": "image/jpeg"
}
```

**Storage:**
- Default: Local storage in `/public/uploads/`
- Optional: AWS S3 (if configured with environment variables)

**Environment Variables for S3:**
```env
S3_BUCKET=your-bucket-name
S3_REGION=us-east-1
S3_KEY_PREFIX=uploads/
S3_PUBLIC_URL=https://cdn.example.com/
```

**Errors:**
- 400: Invalid file type, file too large, or no file provided
- 500: Upload failed

---

## Categories API

### Get All Categories
**Endpoint:** `GET /api/categories`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Politics",
    "slug": "politics",
    "subtitle": "Political News",
    "deskLead": "John Doe",
    "deskEmail": "politics@example.com"
  }
]
```

---

### Manage Categories (Admin)
**Endpoint:** `GET /api/admin/categories`

**Endpoint:** `POST /api/admin/categories` (create)

**Endpoint:** `PATCH /api/admin/categories/[id]` (update)

**Endpoint:** `DELETE /api/admin/categories/[id]` (delete)

---

## Users API

### Get All Users
**Endpoint:** `GET /api/users`

**Response:**
```json
[
  {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "ADMIN",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## Authentication APIs

### Login
**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "ADMIN"
  }
}
```

**Sets Cookie:** `st_token` (JWT)

---

### Get Current User
**Endpoint:** `GET /api/auth/me`

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "ADMIN"
  }
}
```

---

### Logout
**Endpoint:** `POST /api/auth/logout`

**Response:**
```json
{
  "message": "Logged out"
}
```

---

## Article Views Tracking

### Increment Article Views
**Endpoint:** `POST /api/articles/[id]/views`

**Description:** Increment the view count for an article.

**Response:**
```json
{
  "views": 151
}
```

---

## Data Model

### Article Schema
```typescript
{
  id: number (auto)
  title: string (required)
  slug: string (unique, required)
  excerpt: string
  content: string (required)
  readTime: string
  featured: boolean (default: false)
  breaking: boolean (default: false)
  views: number (default: 0)
  image: string
  categoryId: number (nullable)
  authorId: number (nullable)
  authorRole: string (nullable)
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED' (default: 'DRAFT')
  publishedAt: DateTime (nullable)
  createdAt: DateTime (auto)
  updatedAt: DateTime (auto)
}
```

---

## Best Practices

### Creating an Article
1. Upload image/video first → get URL
2. Create article with status='DRAFT'
3. Edit and preview
4. When ready, update status='PUBLISHED' or use publish endpoint

### Handling Breaking News
1. Create/update article with breaking=true
2. Or use `/api/admin/articles/publish` with action='set-breaking'
3. Fetch breaking news via `/api/breaking` endpoint
4. Display prominently on frontend

### Error Handling
All APIs return consistent error format:
```json
{
  "error": "Error message",
  "details": "Additional details (optional)"
}
```

### CORS
All public APIs support CORS for frontend access.

---

## Testing Examples

### Create Article (cURL)
```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Article",
    "content": "This is test content",
    "excerpt": "Test excerpt",
    "categoryId": 1,
    "status": "PUBLISHED"
  }'
```

### Upload Image (cURL)
```bash
curl -X POST http://localhost:3000/api/admin/uploads \
  -F "file=@/path/to/image.jpg"
```

### Get Breaking News
```bash
curl http://localhost:3000/api/breaking
```

---

## Environment Variables Summary

```env
# Database (required)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Optional: AWS S3 for file uploads
S3_BUCKET=your-bucket-name
S3_REGION=us-east-1
S3_KEY_PREFIX=uploads/
S3_PUBLIC_URL=https://cdn.example.com/

# Optional: TinyMCE API Key (for rich text editor)
NEXT_PUBLIC_TINYMCE_API_KEY=your-tinymce-key
```

---

## Notes

- All dates are in ISO 8601 format
- File uploads support both local and S3 storage
- Slugs are auto-generated but can be customized
- ReadTime is auto-calculated but can be overridden
- Breaking news is limited to 10 most recent items
- Authentication uses JWT tokens stored in httpOnly cookies
