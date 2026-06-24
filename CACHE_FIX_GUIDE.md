# Cache Fix Guide - Video Section Not Showing

## Problem
After deploying the video section successfully to Railway, the changes don't appear in the browser. This is due to **browser caching**.

## What Was Fixed
Added cache control headers to `backend/middleware.ts` to:
1. **Prevent HTML caching** - ensures users always get the latest `index.html`
2. **Cache static assets** - JS/CSS files are cached for 1 year (they have hashed names, so new versions get new URLs)

## How to See the Changes NOW

### Option 1: Hard Refresh (Recommended)
- **Windows/Linux**: `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`

### Option 2: Clear Browser Cache
1. Open browser DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### Option 3: Private/Incognito Mode
- Open your site in a new incognito/private window
- This always loads fresh content without cache

### Option 4: Wait
- The new cache headers are now deployed
- After the Railway deployment completes (~2-3 minutes), any new visitor will see the correct version
- Existing visitors need to hard refresh once

## Verify the Deployment

### Check Railway Logs
1. Go to Railway dashboard
2. Click on your project
3. Check the latest deployment shows commit: `fix: Add cache control headers to prevent stale frontend content`
4. Wait for "Build successful" message

### Check if Video Section is Working
1. Hard refresh your browser (Ctrl + Shift + R)
2. Scroll down past "Top Stories"
3. You should see a **black section** with "شاهد" (Watch) heading
4. Videos should be displayed in a horizontal carousel with:
   - Play button overlay
   - Duration badge
   - Navigation arrows (on desktop)

## Expected Video Section Appearance
```
┌─────────────────────────────────────────────────────┐
│ [BLACK BACKGROUND]                                   │
│                                                      │
│ شاهد ➤                                               │
│                                                      │
│ ← [Video 1] [Video 2] [Video 3] [Video 4] →        │
│   [Image]   [Image]   [Image]   [Image]             │
│   Title     Title     Title     Title               │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## If Still Not Working

### Debug Steps:
1. **Check Network Tab**:
   - Open DevTools (F12) → Network tab
   - Hard refresh
   - Look for `index.html` - should show status 200
   - Check if JS files are loading

2. **Check Console**:
   - Open DevTools → Console tab
   - Look for any error messages

3. **Verify Build Includes Frontend**:
   - Railway logs should show:
     ```
     npm install && npm run build
     > Frontend build successful
     > Copied to backend/public
     ```

4. **Test Direct URL**:
   - Try: `https://news-production-a6e2.up.railway.app/assets/index-[hash].js`
   - If 404, frontend wasn't copied correctly

## Technical Details

### Cache Headers Added:
```typescript
// For index.html and SPA routes
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0

// For static assets (JS, CSS, images)
Cache-Control: public, max-age=31536000, immutable
```

### Why This Works:
- HTML is never cached → users always check for new version
- JS/CSS have hashed filenames → new deployments get new URLs
- Images and fonts are cached → faster loading for returning users

## Files Modified in Latest Deployment:
- ✅ `src/components/VideoCard.tsx` - Video card component
- ✅ `src/components/VideoSection.tsx` - Video carousel
- ✅ `src/pages/Home.tsx` - Video section integration
- ✅ `src/index.css` - Video section styling
- ✅ `backend/middleware.ts` - Cache control headers (NEW)

## Next Steps After Verification:
1. Verify video section displays correctly
2. Test on mobile devices
3. Add real videos through admin panel
4. Set up Cloudflare R2 for image storage (see UPLOAD_SOLUTION.md)
