# UPLOAD 404 DIAGNOSIS PLAN

## Current Status
✅ Pushed diagnostic changes to Railway  
⏳ Waiting for Railway deployment

---

## STEP-BY-STEP TESTING PROCEDURE

### STEP 1: Check Railway Logs After Deployment

After Railway completes the deployment, check the runtime logs for:

```bash
# Look for these environment indicators:
🌍 Environment: production
🚂 Railway Env: true
📦 Storage: Local (Ephemeral)
🔒 Production mode: true
```

### STEP 2: Test Image Upload

1. **Go to admin panel:** `https://your-railway-url.railway.app/admin/articles/new`
2. **Upload an image**
3. **Check Railway logs** for these diagnostic lines:

```bash
📤 Upload request received
📁 CWD: /app/backend
📁 Uploads Directory: /app/backend/public/uploads
📁 Directory exists: true/false
📁 Creating uploads directory...
📁 Saving to: /app/backend/public/uploads/filename-timestamp.png
✅ File saved: true Size: 12345 bytes
```

### STEP 3: Analyze the Response

Check the upload API response in browser Network tab:

**Expected Success Response:**
```json
{
  "url": "/uploads/Screenshot-2026-01-14-123456789.png",
  "type": "image",
  "filename": "Screenshot.png",
  "size": 123456,
  "mimetype": "image/png",
  "storage": "local"
}
```

**If you get 503:**
```json
{
  "error": "File uploads are not available",
  "code": "STORAGE_NOT_CONFIGURED"
}
```
→ This means the production block is still active (shouldn't happen with latest code)

###STEP 4: Test Image URL Directly

Take the returned URL and test it directly:

```bash
# Test in browser:
https://your-railway-url.railway.app/uploads/filename-123456789.png

# Expected: Image displays ✅
# If 404: File not being served correctly ❌
```

### STEP 5: Determine Root Cause

Based on the logs and tests above, identify which scenario applies:

#### **SCENARIO A: Upload succeeds, but /uploads returns 404**

**Symptoms:**
- ✅ File saved to disk (logs show: "File saved: true")
- ❌ `/uploads/file.png` returns 404

**Root Cause:** Next.js not serving the uploads directory

**Fix:** The `/api/uploads/[...path].ts` route I created should handle this

**Test the API route:**
```bash
https://your-railway-url.railway.app/api/uploads/filename-123456789.png
```

If this works, update `imageResolver.ts` to use `/api/uploads/` instead of `/uploads/`

---

#### **SCENARIO B: Upload blocked by production check**

**Symptoms:**
- ❌ 503 Service Unavailable
- Error: `STORAGE_NOT_CONFIGURED`

**Root Cause:** Production blocker still active

**Fix:** Already disabled in latest code. If still happening:
1. Check Railway environment variables
2. Verify NODE_ENV is not set to "production"
3. Or configure S3/R2

---

#### **SCENARIO C: File saves but disappears after restart**

**Symptoms:**
- ✅ Upload succeeds immediately
- ✅ Image displays right after upload
- ❌ After Railway redeploy/restart, image returns 404
- Logs show file was saved successfully

**Root Cause:** Railway ephemeral filesystem

**Fix:** Must use S3 or Cloudflare R2 (see solution below)

---

#### **SCENARIO D: Wrong path (process.cwd() issue)**

**Symptoms:**
- Logs show: `CWD: /workspace` or unexpected path
- `Uploads Directory: /workspace/public/uploads` (wrong location)
- File exists: false

**Root Cause:** Next.js running from wrong directory

**Fix:** Update saveToLocal to use:
```typescript
const uploadsDir = path.resolve(__dirname, '..', '..', '..', 'public', 'uploads');
```

---

## EXPECTED FINDINGS

Based on the code analysis, **the most likely issue is SCENARIO A**:

1. ✅ Upload succeeds
2. ✅ File saves to `/app/backend/public/uploads/`
3. ❌ Next.js doesn't serve `/uploads/` route properly
4. ✅ Solution: Use `/api/uploads/[...path].ts` route I created

---

## IMMEDIATE FIX OPTIONS

### Option 1: Use API Route (Quick Fix)

Update `src/utils/imageResolver.ts`:

```typescript
if (imagePath.startsWith('/uploads')) {
  // Use API route instead of direct public path
  return `${API_URL}/api/uploads/${imagePath.replace('/uploads/', '')}`;
}
```

### Option 2: Configure Next.js Public Directory (Proper Fix)

Verify `backend/next.config.mjs` has correct public directory configuration.

### Option 3: Migrate to S3/R2 (Production Solution)

For Railway deployment, ephemeral storage means files will be lost on restart.
Must configure S3 or Cloudflare R2:

1. Create R2 bucket at Cloudflare
2. Get Access Key ID and Secret Access Key
3. Add to Railway environment variables:
   ```
   S3_BUCKET=your-bucket-name
   S3_REGION=auto
   AWS_ACCESS_KEY_ID=...
   AWS_SECRET_ACCESS_KEY=...
   ```
4. Re-enable production check in uploads.ts
5. Redeploy

---

## ACTION ITEMS

### NOW:
1. ✅ Check Railway deployment logs
2. ✅ Test upload in admin panel
3. ✅ Check Network tab for API response
4. ✅ Test image URL directly
5. ✅ Test `/api/uploads/filename.png` route

### AFTER DIAGNOSIS:
1. Apply appropriate fix from scenarios above
2. If SCENARIO A: Update imageResolver.ts
3. If SCENARIO C: Configure S3/R2
4. Remove diagnostic logs
5. Test thoroughly
6. Push final fix

---

## RAILWAY LOG COMMANDS

```bash
# View real-time logs:
railway logs

# Filter for upload-related logs:
railway logs | grep -E "(Upload|uploads|📤|📁|✅)"

# Check environment:
railway run env | grep -E "(NODE_ENV|RAILWAY|S3)"
```

---

## CONTACT POINTS

If issue persists after trying all scenarios:

1. Share Railway logs (especially the diagnostic lines)
2. Share Network tab response from upload API
3. Share browser console errors
4. Verify Next.js version and configuration

---

**Last Updated:** 2026-01-14  
**Status:** Awaiting Railway deployment + testing
