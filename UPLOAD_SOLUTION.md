# Image Upload Issue & Solution

## Problem

When you upload images in Railway (or any cloud platform), the images are stored in `/public/uploads/` which is **ephemeral storage**. This means:

❌ Images are **deleted** when Railway redeploys your app  
❌ Images appear **broken** after redeployment  
❌ Cannot scale to multiple instances (each instance has its own filesystem)

## Solution Options

### Option 1: Use AWS S3 (Recommended for Production) ☁️

AWS S3 provides permanent, scalable cloud storage for your images.

**Setup Steps:**

1. **Create an AWS S3 Bucket**
   - Go to AWS Console → S3
   - Create a new bucket (e.g., `sudannews-uploads`)
   - Enable public access for uploaded files
   - Set CORS policy to allow uploads from your domain

2. **Get AWS Credentials**
   - Go to AWS Console → IAM
   - Create a new user with S3 access
   - Save the Access Key ID and Secret Access Key

3. **Add Environment Variables in Railway**
   ```
   S3_BUCKET=sudannews-uploads
   S3_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your-access-key-id
   AWS_SECRET_ACCESS_KEY=your-secret-access-key
   S3_PUBLIC_URL=https://sudannews-uploads.s3.us-east-1.amazonaws.com/
   ```

4. **Deploy** - Railway will automatically use S3 instead of local storage!

**Cost:** AWS S3 Free Tier includes:
- 5GB storage free for 12 months
- Very cheap after that (~$0.023/GB/month)

---

### Option 2: Use Cloudflare R2 (S3-Compatible, Cheaper) 💰

Cloudflare R2 is S3-compatible but with no egress fees.

**Setup Steps:**

1. Create Cloudflare R2 bucket
2. Get R2 Access Key and Secret
3. Add to Railway environment variables (same as S3 above)
4. Set `S3_REGION=auto` for R2

**Cost:** 
- 10GB storage free/month
- No egress fees (free bandwidth!)

---

### Option 3: Temporary Local Storage (Current Setup) ⚠️

**Status:** Currently active but **NOT RECOMMENDED** for production

**Limitations:**
- ❌ Images deleted on every redeployment
- ❌ Not suitable for production use
- ✅ Good for testing/development only

---

## Recommended Action

**For Production:** Set up AWS S3 or Cloudflare R2 **immediately** to avoid losing uploaded images.

**For Testing:** Current local storage is fine, but remember images will be lost on redeploy.

---

## How It Works

The upload API automatically detects S3 configuration:

```typescript
if (process.env.S3_BUCKET && process.env.S3_REGION) {
  // Upload to S3 (permanent storage)
  url = await saveToS3(file);
} else {
  // Upload to local filesystem (ephemeral)
  url = await saveToLocal(file);
}
```

Once you add S3 variables, uploads will automatically go to S3!
