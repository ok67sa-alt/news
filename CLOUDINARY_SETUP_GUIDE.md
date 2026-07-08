# Cloudinary Setup Guide

Complete guide to set up Cloudinary for image and video storage.

---

## Why Cloudinary?

✅ **Free Tier:**
- 25 GB storage
- 25 GB bandwidth/month
- Image transformations
- Video hosting
- CDN included

✅ **Features:**
- Automatic image optimization
- Responsive images
- Video transcoding
- Built-in CDN
- Image transformations on-the-fly

---

## Step 1: Create Cloudinary Account

1. Go to https://cloudinary.com/users/register_free
2. Sign up with your email
3. Verify your email address
4. Complete the registration

---

## Step 2: Get Your Credentials

1. Go to **Dashboard**: https://console.cloudinary.com/
2. You'll see:
   ```
   Cloud Name: your-cloud-name
   API Key: 123456789012345
   API Secret: abcdefghijklmnopqrstuvwxyz123
   ```
3. **Copy these values** - you'll need them next

---

## Step 3: Configure Environment Variables

### For Local Development

Create `backend/.env.development`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/sudan_times"
JWT_SECRET="your-secret-key"
NODE_ENV="development"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="abcdefghijklmnopqrstuvwxyz123"
CLOUDINARY_FOLDER="sudan-news"
```

### For Railway Production

1. Go to Railway Dashboard → Your Project → Variables
2. Add these environment variables:

```
CLOUDINARY_CLOUD_NAME = your-cloud-name
CLOUDINARY_API_KEY = 123456789012345
CLOUDINARY_API_SECRET = abcdefghijklmnopqrstuvwxyz123
CLOUDINARY_FOLDER = sudan-news
```

3. Click **Deploy** to restart with new variables

---

## Step 4: Test the Upload

1. **Build and deploy the code:**
   ```bash
   npm run build
   git add -A
   git commit -m "Add Cloudinary integration"
   git push origin main
   ```

2. **Wait for Railway to deploy** (2-3 minutes)

3. **Test upload:**
   - Go to Admin Panel → Articles → New Article
   - Upload an image
   - Check the response in browser console

4. **Verify in Cloudinary:**
   - Go to https://console.cloudinary.com/media_library
   - Your uploaded images should appear in `sudan-news/` folder

---

## How It Works

### Storage Priority

The upload API automatically chooses:

1. **Cloudinary** (if configured) ← **Recommended**
2. **S3/R2** (if Cloudinary not configured but S3 is)
3. **Local filesystem** (fallback)

### Upload Flow

```
User uploads image
      ↓
Admin Panel
      ↓
POST /api/admin/uploads
      ↓
Check: Cloudinary configured?
      ↓
  ✅ YES → Upload to Cloudinary
  ❌ NO  → Check S3 → Upload to S3 or Local
      ↓
Return URL
      ↓
Save URL in database
      ↓
Display image on website
```

---

## Cloudinary Features You Can Use

### 1. Image Transformations

Cloudinary URLs support transformations:

```
Original:
https://res.cloudinary.com/your-cloud/image/upload/v1234/article.jpg

Resized to 800px wide:
https://res.cloudinary.com/your-cloud/image/upload/w_800/v1234/article.jpg

Thumbnail (300x200):
https://res.cloudinary.com/your-cloud/image/upload/w_300,h_200,c_fill/v1234/article.jpg

Auto format & quality:
https://res.cloudinary.com/your-cloud/image/upload/f_auto,q_auto/v1234/article.jpg
```

### 2. Video Hosting

Cloudinary automatically handles:
- Video transcoding
- Multiple formats (MP4, WebM)
- Adaptive bitrate streaming
- Video thumbnails

### 3. CDN

All files are automatically served via Cloudinary's global CDN for fast loading worldwide.

---

## Folder Structure in Cloudinary

Your uploads will be organized:

```
sudan-news/           ← CLOUDINARY_FOLDER
├── hero-image-1234.jpg
├── politics-article-5678.jpg
├── video-report-9012.mp4
└── ...
```

You can create subfolders by changing `CLOUDINARY_FOLDER`:
```env
CLOUDINARY_FOLDER="sudan-news/articles"
CLOUDINARY_FOLDER="sudan-news/videos"
```

---

## Troubleshooting

### Issue: "Cloudinary upload failed"

**Check:**
1. Credentials are correct in Railway environment variables
2. No typos in `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
3. Railway deployment completed successfully

### Issue: Images still uploading to local storage

**Check:**
1. Environment variables are set in Railway (not just locally)
2. Railway restarted after adding variables
3. Check Railway logs: should see "☁️ Cloudinary configured"

### Issue: "Invalid API key"

**Fix:**
1. Go to Cloudinary Dashboard
2. Copy API Key again (don't copy spaces)
3. Update Railway environment variable
4. Redeploy

---

## Security Best Practices

✅ **DO:**
- Keep API Secret private
- Use environment variables (never hardcode)
- Set upload restrictions in Cloudinary dashboard
- Enable signed URLs for sensitive content

❌ **DON'T:**
- Commit `.env` files to Git
- Share API credentials publicly
- Use the same credentials for dev and production

---

## Monitoring Usage

Check your Cloudinary usage:

1. Go to https://console.cloudinary.com/
2. Dashboard shows:
   - Storage used
   - Bandwidth used
   - Transformations used
   - Credits remaining

**Free Tier Limits:**
- 25 GB storage
- 25 GB bandwidth/month
- 25,000 transformations/month

If you exceed limits, you'll need to upgrade or images will stop uploading.

---

## Migration from Local Storage

If you already have images in local storage:

### Option 1: Manual Upload
1. Download images from Railway (if accessible)
2. Upload to Cloudinary via dashboard
3. Update database URLs

### Option 2: Bulk Migration Script
```javascript
// backend/scripts/migrate-to-cloudinary.js
const prisma = require('@prisma/client');
const cloudinary = require('cloudinary').v2;

// Configure
cloudinary.config({...});

async function migrateImages() {
  const articles = await prisma.article.findMany();
  
  for (const article of articles) {
    if (article.image && article.image.startsWith('/uploads/')) {
      // Upload local image to Cloudinary
      const result = await cloudinary.uploader.upload(
        `./public${article.image}`,
        { folder: 'sudan-news' }
      );
      
      // Update database
      await prisma.article.update({
        where: { id: article.id },
        data: { image: result.secure_url }
      });
      
      console.log(`Migrated: ${article.title}`);
    }
  }
}
```

---

## Cost Optimization Tips

1. **Use Auto Format & Quality:**
   - Saves bandwidth
   - Smaller file sizes
   - Better performance

2. **Delete Unused Images:**
   - Regularly clean up old images
   - Free up storage space

3. **Set Upload Limits:**
   - Limit image resolution
   - Compress before upload
   - Use appropriate formats

4. **Monitor Bandwidth:**
   - Track usage in dashboard
   - Optimize popular images
   - Use lazy loading on frontend

---

## Alternative: Cloudflare R2

If you prefer S3-compatible storage:

**Cloudflare R2 (Free 10GB):**
```env
S3_BUCKET=your-r2-bucket
S3_REGION=auto
AWS_ACCESS_KEY_ID=your-r2-key
AWS_SECRET_ACCESS_KEY=your-r2-secret
S3_PUBLIC_URL=https://pub-xyz.r2.dev/
```

But Cloudinary is recommended for:
- Automatic image optimization
- Built-in transformations
- Video transcoding
- Simpler setup

---

## Summary

✅ **Cloudinary Setup Complete!**

1. Create account → Get credentials
2. Add to Railway environment variables
3. Deploy code
4. Test upload
5. Images now stored in Cloudinary ☁️

**Next Steps:**
- Upload test images
- Check Cloudinary dashboard
- Monitor usage
- Optimize images using transformations

**Support:**
- Cloudinary Docs: https://cloudinary.com/documentation
- Dashboard: https://console.cloudinary.com/
- Support: https://support.cloudinary.com/
