# Cloudinary 404 Fix Guide

## Problem
- Getting 404 errors when trying to load images
- Cloudinary folder doesn't exist
- Railway can't find images

---

## Solution Steps

### Step 1: Configure Railway Environment Variables

1. **Go to Railway Dashboard**: https://railway.app/
2. **Select your project**: `news-production-a6e2`
3. **Click on your service** (the one running the backend)
4. **Go to "Variables" tab**
5. **Add these environment variables**:

```
CLOUDINARY_CLOUD_NAME=utdfxckm
CLOUDINARY_API_KEY=742197721758692
CLOUDINARY_API_SECRET=JSiuuOoTEN_jf-mLcNEZp-HUK7o
CLOUDINARY_FOLDER=sudan-news
```

6. **Click "Deploy"** or wait for auto-redeploy

---

### Step 2: Verify Cloudinary Configuration

1. **Log into Cloudinary**: https://cloudinary.com/users/login
2. **Go to Dashboard**: https://console.cloudinary.com/console
3. **Verify credentials match**:
   - Cloud Name: `utdfxckm`
   - API Key: `742197721758692`
   - API Secret: `JSiuuOoTEN_jf-mLcNEZp-HUK7o`

---

### Step 3: Test Upload Locally

1. **Start the backend server locally**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Open admin panel**: http://localhost:3000/admin/login
3. **Login with your admin credentials**
4. **Go to "Articles" → "Create New Article"**
5. **Upload a test image**
6. **Check console output** - you should see:
   ```
   ☁️  Cloudinary configured: utdfxckm
   ☁️  Uploading to Cloudinary: test-image.jpg
   ✅ Cloudinary upload successful: https://res.cloudinary.com/utdfxckm/image/upload/...
   ```

---

### Step 4: Check Cloudinary Media Library

1. **Go to Media Library**: https://console.cloudinary.com/console/media_library
2. **Look for "sudan-news" folder** - it will appear after first upload
3. **Verify images are uploaded correctly**

---

### Step 5: Test on Railway

After setting environment variables:

1. **Wait 2-3 minutes** for Railway to redeploy
2. **Go to your admin panel**: https://news-production-a6e2.up.railway.app/admin/login
3. **Upload a new image**
4. **Verify it uploads to Cloudinary**
5. **Check the article page** - image should display correctly

---

## Troubleshooting

### Problem: Still getting 404 on Railway

**Check Railway Logs:**
1. Go to Railway Dashboard
2. Click on your service
3. Go to "Deployments" tab
4. Click on latest deployment
5. Check logs for errors

**Look for:**
```
☁️  Cloudinary configured: utdfxckm
```

If you DON'T see this, environment variables are not set correctly.

### Problem: Cloudinary folder not appearing

**This is NORMAL!** The folder only appears after you upload your first file.

1. Upload one test image via admin panel
2. Refresh Cloudinary Media Library
3. Folder should now appear

### Problem: Old images still showing 404

**Existing images need to be re-uploaded** because they were saved locally on Railway's ephemeral storage.

**Options:**

1. **Quick Fix**: Re-upload featured images via admin panel
2. **Database Update**: Update image URLs in database to point to Cloudinary URLs

---

## Important Notes

### 🚨 Railway Ephemeral Storage
- Railway's filesystem is **temporary** - files reset on redeploy
- Any images uploaded before Cloudinary setup are **lost**
- **Solution**: Use Cloudinary for all production uploads

### ✅ Cloudinary Free Tier
- 25GB storage
- 25GB bandwidth/month
- More than enough for your news site

### 📦 Storage Priority
The upload API uses this priority:
1. **Cloudinary** (if configured) ← Recommended for production
2. **S3/R2** (if configured)
3. **Local filesystem** (fallback for development)

---

## Quick Verification Checklist

After setting up, verify:

- [ ] Railway environment variables are set
- [ ] Backend redeployed successfully
- [ ] Can log into admin panel on Railway
- [ ] Upload test image in admin panel
- [ ] Console shows "Cloudinary configured"
- [ ] Console shows "Cloudinary upload successful"
- [ ] Image appears in Cloudinary Media Library
- [ ] Image displays correctly on frontend
- [ ] No 404 errors in browser console

---

## Next Steps

Once Cloudinary is working:

1. **Re-upload hero images** for featured articles
2. **Re-upload category thumbnails** for better homepage appearance
3. **Upload video content** (Cloudinary supports videos too!)

---

## Need Help?

If you're still getting 404 errors after following this guide:

1. **Copy Railway logs** (Deployments → Latest → Logs)
2. **Copy browser console errors** (F12 → Console tab)
3. **Share both** so I can diagnose the specific issue

The most common cause is forgetting to set the environment variables in Railway!
