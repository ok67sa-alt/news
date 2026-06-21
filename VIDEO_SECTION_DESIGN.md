# Video Section Design Plan

## Goal
Create a separate horizontal scrollable video carousel section similar to BBC News "Watch" section.

## Current Structure
- Articles are mixed (with videos and without)
- No separate section for videos

## New Structure

### 1. Filter Articles
```typescript
// Separate articles with videos from regular articles
const videoArticles = articles.filter(a => a.videoUrl || a.videoFile);
const regularArticles = articles.filter(a => !a.videoUrl && !a.videoFile);
```

### 2. Video Section Component
```tsx
<section className="video-section">
  <div className="video-header">
    <h2>شاهد</h2>
    <ChevronRight />
  </div>
  <div className="video-carousel">
    {videoArticles.map(article => (
      <VideoCard key={article.id} article={article} />
    ))}
  </div>
</section>
```

### 3. Styling
- Dark background (#1a1a1a)
- Horizontal scroll with arrow navigation
- Video thumbnail with play button overlay
- Duration badge
- Title below video

### 4. Layout Order
1. Hero Article (main featured)
2. Top Stories Grid (3x2 grid)
3. **Video Section** (horizontal carousel) ← NEW
4. Trending News
5. Category Sections
6. Latest News Grid

## Implementation
Will update Home.tsx to include video section between top stories and trending.
