# Railway Environment Variables Check

## Problem
Image uploaded to `/uploads/...` instead of Cloudinary URL.
This means Cloudinary is NOT configured on Railway.

---

## Check Railway Variables

1. **Go to**: https://railway.app/project/[your-project-id]
2. **Click on your backend service** (not the database)
3. **Click "Variables" tab**
4. **Verify these 4 variables exist**:

```
CLOUDINARY_CLOUD_NAME=utdfxckm
CLOUDINARY_API_KEY=742197721758692
CLOUDINARY_API_SECRET=JSiuuOoTEN_jf-mLcNEZp-HUK7o
CLOUDINARY_FOLDER=sudan-news
```

---

## Common Mistakes

### ❌ Wrong: Added to Database Service
If you added the variables to the **Postgres service**, they won't work.
You need to add them to the **backend/app service**.

### ❌ Wrong: Not Redeployed
After adding variables, Railway should auto-redeploy.
If it didn't, click "Deploy" button manually.

### ❌ Wrong: Typo in Variable Names
Make sure variable names are EXACT:
- `CLOUDINARY_CLOUD_NAME` (not `CLOUDINARY_NAME`)
- `CLOUDINARY_API_KEY` (not `CLOUDINARY_KEY`)
- `CLOUDINARY_API_SECRET` (not `CLOUDINARY_SECRET`)

---

## Check Deployment Logs

1. **Go to Railway Dashboard**
2. **Click on backend service**
3. **Go to "Deployments" tab**
4. **Click on latest deployment**
5. **Check logs for**:

### ✅ Good - Should see:
```
☁️  Cloudinary configured: utdfxckm
```

### ❌ Bad - If you see:
```
📦 Storage: Local Filesystem
```
This means Cloudinary variables are NOT set.

---

## Force Redeploy

If variables are set but still not working:

1. **Go to Railway Dashboard**
2. **Click backend service**
3. **Go to "Settings" tab**
4. **Scroll down**
5. **Click "Restart Deployment"**

Wait 2-3 minutes, then try uploading again.

---

## Test After Fix

After setting variables correctly:

1. **Go to admin panel**
2. **Upload a test image**
3. **Check the URL in the preview**:

### ✅ Success - URL should be:
```
https://res.cloudinary.com/utdfxckm/image/upload/v1234567/sudan-news/test-1234567.png
```

### ❌ Still failing - URL is:
```
https://news-production-a6e2.up.railway.app/uploads/test-1234567.png
```

---

## Alternative: Use Railway CLI

If web dashboard isn't working, use CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Set variables
railway variables set CLOUDINARY_CLOUD_NAME=utdfxckm
railway variables set CLOUDINARY_API_KEY=742197721758692
railway variables set CLOUDINARY_API_SECRET=JSiuuOoTEN_jf-mLcNEZp-HUK7o
railway variables set CLOUDINARY_FOLDER=sudan-news

# Check variables
railway variables

# Force redeploy
railway up
```

---

## Screenshot Guide

If still not working, send me:

1. **Screenshot of Railway Variables tab** (blur sensitive values if needed)
2. **Screenshot of Railway Deployment logs** (first 50 lines)
3. **Screenshot of browser console** when uploading image

This will help me diagnose the exact issue.
