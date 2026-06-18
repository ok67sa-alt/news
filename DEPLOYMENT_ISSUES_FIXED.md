# Railway Deployment Issues & Fixes

## Issue 1: 405 Method Not Allowed when clicking "تحرير" or "إلغاء النشر" ❌

### Problem
When clicking Edit or Unpublish buttons in the admin panel, you get a `405 Method Not Allowed` error.

### Root Cause
The API endpoint `/api/articles/[id]` supports `PATCH` method locally, but Railway might not have the correct build deployed or there's a caching issue.

### Solution

**Step 1: Verify the deployment**
1. Check Railway logs to see if the build includes all API files
2. Make sure `backend/pages/api/articles/[id]/index.ts` exists in the deployment

**Step 2: Clear cache and redeploy**
```bash
# From your local machine
git add .
git commit -m "Fix: Ensure all API endpoints are deployed"
git push origin main
```

**Step 3: Force restart Railway service**
1. Go to Railway dashboard
2. Click your service
3. Settings → Restart

### Quick Test
Try accessing this URL directly in your browser:
```
https://news-production-a6e2.up.railway.app/api/articles/1
```

If it returns article data (not 404), the endpoint is working.

---

## Issue 2: Broken Images After Upload 🖼️

### Problem
When you upload images from your phone to the admin panel:
- Images appear broken
- Images show as broken in the upload preview

### Root Cause
Images are being saved to `/public/uploads/` which is **ephemeral storage** in Railway. This means:
- Images are deleted when Railway redeploys
- Images don't persist across instances
- This is NOT suitable for production

### Current Status
✅ Image upload API is working correctly  
❌ Images are stored in ephemeral storage (will be lost on redeploy)

### Solution: Use AWS S3 (Permanent Storage)

**Why S3?**
- ✅ Permanent storage (images never deleted)
- ✅ Scales automatically
- ✅ Fast CDN delivery
- ✅ Free tier: 5GB storage for 12 months

**Setup Steps:**

#### 1. Create AWS S3 Bucket
```
1. Go to https://aws.amazon.com/s3/
2. Sign in to AWS Console
3. Search for "S3" → Create bucket
4. Bucket name: sudannews-uploads (must be unique globally)
5. Region: Choose closest to your users (e.g., us-east-1)
6. UNCHECK "Block all public access" (we need public access for images)
7. Create bucket
```

#### 2. Set Bucket Policy (Make Images Public)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::sudannews-uploads/*"
    }
  ]
}
```

#### 3. Set CORS Policy
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

#### 4. Create IAM User with S3 Access
```
1. Go to AWS Console → IAM → Users → Create User
2. User name: sudannews-uploader
3. Attach policy: AmazonS3FullAccess (or create custom policy for just this bucket)
4. Create access key → Save the Access Key ID and Secret Access Key
```

#### 5. Add Environment Variables to Railway
```
S3_BUCKET=sudannews-uploads
S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...your-key-id
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_PUBLIC_URL=https://sudannews-uploads.s3.us-east-1.amazonaws.com/
```

#### 6. Redeploy (Railway will auto-redeploy when you add variables)

**That's it!** All future uploads will automatically go to S3 instead of local storage.

---

## Alternative: Cloudflare R2 (Cheaper Option)

Cloudflare R2 is S3-compatible but with **zero egress fees** (free bandwidth).

**Cost Comparison:**
- AWS S3: $0.023/GB/month storage + egress fees
- Cloudflare R2: $0.015/GB/month storage + **FREE egress**

**Setup:**
1. Go to Cloudflare Dashboard → R2
2. Create bucket: sudannews-uploads
3. Create R2 API token
4. Add to Railway:
   ```
   S3_BUCKET=sudannews-uploads
   S3_REGION=auto
   AWS_ACCESS_KEY_ID=your-r2-access-key
   AWS_SECRET_ACCESS_KEY=your-r2-secret-key
   S3_PUBLIC_URL=https://your-public-url.r2.dev/
   ```

---

## Testing the Fixes

### Test Image Upload:
1. Login to admin: https://news-production-a6e2.up.railway.app/admin/login
2. Go to Articles → Create New Article
3. Upload an image
4. Check if image URL starts with:
   - ❌ `/uploads/...` → Still using local storage (will be lost on redeploy)
   - ✅ `https://sudannews-uploads.s3...` → Using S3 (permanent!)

### Test Edit/Unpublish:
1. Go to Articles list
2. Click "تحرير" (Edit) on any article
3. Should open edit page (not 405 error)
4. Click "إلغاء النشر" (Unpublish) on a published article
5. Should change status to Draft (not 405 error)

---

## Summary

### Immediate Actions Needed:

1. ✅ **Push current code to fix 405 error**
   ```bash
   git add .
   git commit -m "Fix API endpoints and add S3 storage support"
   git push origin main
   ```

2. ⚠️ **Set up S3 or R2 for permanent image storage** (CRITICAL for production)
   - Without this, all uploaded images will be lost on next redeploy
   - Follow the S3 setup steps above

3. ✅ **Test both fixes** once deployed

---

## Need Help?

If you encounter any issues:
1. Check Railway logs for errors
2. Test API endpoints directly in browser
3. Verify environment variables are set correctly in Railway dashboard
