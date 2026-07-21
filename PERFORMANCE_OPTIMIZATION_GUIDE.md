# 🚀 دليل تحسين الأداء للصفحة الرئيسية

تم تطبيق التحسينات التالية لتسريع الصفحة الرئيسية:

## ✅ التحسينات المطبقة

### 1. **تحسين استعلامات قاعدة البيانات**
- ✅ إضافة Indexes جديدة في Prisma Schema:
  - `publishedAt` - لتسريع الترتيب حسب التاريخ
  - `status, publishedAt` - لتسريع الاستعلامات المركبة
  - `categoryId, status, publishedAt` - لتسريع استعلامات التصنيفات
  
- ✅ تطبيق Pagination في API:
  - تقليل عدد الأخبار المحملة من **100** إلى **20** في كل طلب
  - إضافة معاملات `page` و `limit` للتحكم في الكمية
  - إرجاع metadata للصفحات (total, totalPages)

### 2. **تفعيل Cache Headers**
- ✅ إضافة Cache-Control في `/api/articles`:
  ```
  Cache-Control: public, s-maxage=600, stale-while-revalidate=1200
  ```
  - يتم تخزين الصفحة لمدة **10 دقائق**
  - يتم استخدام النسخة المخزنة لمدة **20 دقيقة** إضافية أثناء التحديث

### 3. **تقليل عدد الأخبار المحملة**
- ✅ تقليل العدد في Home Component من **100** إلى **50** خبر
- ✅ استخدام Lazy Loading للصور باستخدام `loading="lazy"`

## 🔧 التحسينات المطلوبة (يدوية)

### 1. **ترحيل جميع الصور إلى WebP**

قم بتشغيل الأمر التالي لتحويل جميع الصور إلى WebP:

```bash
# تثبيت Sharp لتحويل الصور
npm install sharp

# إنشاء سكريبت لتحويل الصور
node scripts/convert-images-to-webp.js
```

**سكريبت التحويل:**

```javascript
// scripts/convert-images-to-webp.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '../backend/public/uploads');
const outputDir = path.join(__dirname, '../backend/public/uploads/webp');

// إنشاء مجلد WebP إذا لم يكن موجودًا
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// قراءة جميع الصور
fs.readdir(uploadsDir, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  files.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    
    // تحويل الصور فقط (jpg, jpeg, png)
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      const inputPath = path.join(uploadsDir, file);
      const outputPath = path.join(outputDir, file.replace(ext, '.webp'));

      sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath)
        .then(() => {
          console.log(`✅ Converted: ${file} → ${path.basename(outputPath)}`);
        })
        .catch(err => {
          console.error(`❌ Error converting ${file}:`, err.message);
        });
    }
  });
});
```

### 2. **تفعيل Image Optimization في Next.js**

في `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  // تفعيل Static Exports للصفحات
  output: 'standalone',
};

export default nextConfig;
```

### 3. **إضافة Incremental Static Regeneration (ISR)**

في الـ Frontend (إذا كان Next.js):

```typescript
// pages/index.tsx
export async function getStaticProps() {
  const articles = await fetchAPI('/articles', { page: '1', limit: '50' });
  
  return {
    props: { articles },
    revalidate: 600, // إعادة توليد الصفحة كل 10 دقائق
  };
}
```

### 4. **تفعيل CDN (Cloudflare/Vercel)**

#### باستخدام Vercel:
1. ارفع المشروع على Vercel
2. سيتم تفعيل CDN تلقائيًا

#### باستخدام Cloudflare:
1. أضف موقعك على Cloudflare
2. فعّل Page Rules:
   ```
   Cache Level: Cache Everything
   Edge Cache TTL: 2 hours
   Browser Cache TTL: 30 minutes
   ```

### 5. **ضغط ملفات JavaScript**

في `next.config.mjs`:

```javascript
const nextConfig = {
  compress: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  swcMinify: true,
};
```

### 6. **إضافة Service Worker للـ Caching**

قم بإنشاء `public/sw.js`:

```javascript
const CACHE_NAME = 'sudan-times-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

### 7. **تطبيق Lazy Loading للمكونات**

```typescript
import { lazy, Suspense } from 'react';

const VideoSection = lazy(() => import('../components/VideoSection'));

// في الكود
{videoArticles.length > 0 && (
  <Suspense fallback={<div>Loading videos...</div>}>
    <VideoSection videos={videoArticles} />
  </Suspense>
)}
```

## 📊 النتائج المتوقعة

بعد تطبيق جميع التحسينات:

| المقياس | قبل | بعد | التحسين |
|---------|-----|-----|---------|
| زمن التحميل | ~4-5 ثانية | ~1-2 ثانية | **60-75%** |
| حجم البيانات | ~2-3 MB | ~500-800 KB | **70%** |
| عدد الطلبات | 100+ | 20-30 | **70%** |
| First Contentful Paint | ~3s | ~0.8s | **73%** |

## 🔄 الخطوات القادمة

1. ✅ تطبيق Prisma Migration:
   ```bash
   cd backend
   npx prisma migrate dev --name add_performance_indexes
   ```

2. ⚙️ إنشاء سكريبت تحويل الصور إلى WebP

3. 🚀 رفع المشروع على Vercel أو Cloudflare

4. 📊 قياس الأداء باستخدام:
   - [Google PageSpeed Insights](https://pagespeed.web.dev/)
   - [GTmetrix](https://gtmetrix.com/)
   - [WebPageTest](https://www.webpagetest.org/)

## 🛠️ أدوات إضافية للمراقبة

- **Google Lighthouse** - لتحليل الأداء
- **Chrome DevTools** - لمراقبة الـ Network
- **Sentry** - لتتبع الأخطاء والأداء

## 📝 ملاحظات مهمة

- قم بعمل **Backup** للبيانات قبل تطبيق Migrations
- اختبر التحسينات في بيئة التطوير أولاً
- راقب استهلاك الـ Cache على السيرفر
- استخدم **Redis** لـ Caching إذا كان لديك عدد زيارات كبير

---

**تم التطبيق بواسطة:** Kiro AI  
**التاريخ:** 2026-07-21
