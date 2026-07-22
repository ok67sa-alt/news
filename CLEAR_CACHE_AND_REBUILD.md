# 🔄 Clear Cache and Force Rebuild

## Problem:
Changes applied to homepage but other pages still show old design.

## Root Cause:
Next.js is serving cached pages from `.next` directory.

## Solution:

### On Your Server (Railway):

```bash
# 1. Delete the .next build cache
rm -rf .next

# 2. Clean node_modules cache (optional but recommended)
rm -rf node_modules/.cache

# 3. Rebuild
npm run build

# 4. Restart the server
npm start
```

### If Using Railway Auto-Deploy:

Railway should automatically rebuild, but you can force it by:

1. **Go to Railway Dashboard**
2. **Find your deployment**
3. **Click "Redeploy"** or trigger a new deployment

### Alternative - Force Rebuild via Git:

```bash
# Create an empty commit to trigger rebuild
git commit --allow-empty -m "Force rebuild to clear Next.js cache"
git push origin main
```

---

## Why This Happens:

Next.js caches compiled pages in `.next/` directory for performance. When you update components, the cache needs to be cleared for changes to appear on all pages.

---

## Verify Fix:

After rebuild, check:
- ✅ Homepage has new design
- ✅ Category pages have new design  
- ✅ Article pages have new design
- ✅ Breaking news ticker is slow (180s)

---

## If Still Not Working:

Check if there are multiple Header files:
```bash
find . -name "Header.tsx" -type f
```

Should only show:
- `./components/Header.tsx` ✅
- NOT `./src/components/Header.tsx` (ignore this)
- NOT `./backend/components/Header.tsx` (ignore this)

---

## Browser Cache:

Also clear browser cache:
- **Hard Refresh:** Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- **Clear Cache:** Ctrl+Shift+Delete → Clear browsing data
