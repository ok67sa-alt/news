# Hero Field Bug Fix

## Problem
When editing articles in the admin panel, checking the "Hero Article" checkbox would not persist after saving. The checkbox would appear unchecked when reopening the article.

## Root Cause
The `hero` field was **missing** from the API endpoint's data sanitization functions:
- `backend/pages/api/articles/index.ts` - Create article endpoint
- `backend/pages/api/articles/[id]/index.ts` - Update article endpoint

While the admin form was sending the `hero` field, the API was ignoring it and not saving it to the database.

## Solution

### 1. Fixed Update Article API
**File**: `backend/pages/api/articles/[id]/index.ts`

Added `hero` field to the `sanitizeUpdateData` function:

```typescript
if (payload.videoUrl !== undefined) data.videoUrl = payload.videoUrl || null;
if (payload.hero !== undefined) data.hero = Boolean(payload.hero); // ✅ ADDED
if (payload.featured !== undefined) data.featured = Boolean(payload.featured);
if (payload.breaking !== undefined) data.breaking = Boolean(payload.breaking);
if (payload.status !== undefined) data.status = payload.status;
```

### 2. Fixed Create Article API
**File**: `backend/pages/api/articles/index.ts`

Added `hero` field to the `sanitizeArticleData` function:

```typescript
image: payload.image || null,
videoUrl: payload.videoUrl || null,
videoFile: payload.videoFile || null,
hero: Boolean(payload.hero), // ✅ ADDED
featured: Boolean(payload.featured),
breaking: Boolean(payload.breaking),
status: payload.status || 'DRAFT',
```

## Testing

After Railway redeploys:

1. **Go to**: https://news-production-a6e2.up.railway.app/admin/login
2. **Edit an article**
3. **Check "Hero Article"**
4. **Click "Save" or "Publish"**
5. **Reopen the article**
6. ✅ **Hero checkbox should remain checked**

## Impact

- ✅ Hero articles will now be properly saved
- ✅ Homepage hero carousel will display hero-marked articles
- ✅ Featured (Editor's Picks) remains separate from Hero
- ✅ Breaking news checkbox continues to work correctly

## Next Steps

Once Railway finishes deploying:

1. **Mark 2-3 articles as "Hero Article"**
2. **Mark 4-5 articles as "Editor's Pick"** (without Hero)
3. **Refresh homepage** - you should see:
   - Hero carousel with rotating articles (2 seconds each)
   - Editor's Picks sidebar with 4 articles
   - Category sections populated
   - Trending sidebar with most viewed articles

## Deployment Status

- ✅ Code fixed
- ✅ Built successfully
- ✅ Committed to Git
- ✅ Pushed to GitHub
- ⏳ Railway auto-deploying (wait 2-3 minutes)

---

**The hero field bug is now fixed!** Wait for Railway to finish deploying, then you can properly mark articles as hero.
