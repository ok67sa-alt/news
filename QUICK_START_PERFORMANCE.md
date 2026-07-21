# ⚡ دليل التشغيل السريع لتحسينات الأداء

## 🚀 الخطوات السريعة

### 1️⃣ تطبيق Database Indexes

```bash
# الانتقال إلى مجلد backend
cd backend

# تطبيق Migration
npx prisma migrate dev --name add_performance_indexes

# إعادة توليد Prisma Client
npx prisma generate
```

أو استخدم السكريبت الجاهز:

```bash
node scripts/apply-performance-migration.js
```

### 2️⃣ تحويل الصور إلى WebP

```bash
# تثبيت Sharp لتحويل الصور
npm install sharp

# تشغيل سكريبت التحويل
node scripts/convert-images-to-webp.js
```

**النتيجة:** ستجد جميع الصور في مجلد `backend/public/uploads/webp/`

### 3️⃣ إعادة تشغيل السيرفر

```bash
# إيقاف السيرفر الحالي (Ctrl+C)

# Backend
cd backend
npm run dev

# Frontend (في نافذة أخرى)
cd ..
npm run dev
```

## ✅ ما تم تطبيقه تلقائياً

### Backend API
- ✅ Pagination (20 خبر في كل طلب بدلاً من 100)
- ✅ Cache Headers (10 دقائق للـ homepage)
- ✅ Database Indexes (publishedAt, status, categoryId)
- ✅ تحسين Select Queries (إزالة email من response)

### Frontend
- ✅ تقليل عدد الأخبار المحملة (50 بدلاً من 100)
- ✅ Lazy Loading للصور
- ✅ Service Worker للـ Caching
- ✅ Image Optimizer Utility

### Next.js Configuration
- ✅ SWC Minify
- ✅ Compression
- ✅ WebP & AVIF Support
- ✅ Image Optimization (30 days cache)

## 📊 قياس الأداء

قم بزيارة:

1. **Google PageSpeed Insights**
   ```
   https://pagespeed.web.dev/
   ```

2. **GTmetrix**
   ```
   https://gtmetrix.com/
   ```

3. **WebPageTest**
   ```
   https://www.webpagetest.org/
   ```

## 🔍 التحقق من التحسينات

### تحقق من Cache Headers

```bash
curl -I http://localhost:3001/api/articles
```

يجب أن ترى:
```
Cache-Control: public, s-maxage=600, stale-while-revalidate=1200
```

### تحقق من Database Indexes

```bash
cd backend
npx prisma studio
```

ثم افتح جدول `Article` وتحقق من وجود الـ Indexes.

### تحقق من Service Worker

1. افتح DevTools (F12)
2. اذهب إلى **Application** → **Service Workers**
3. يجب أن ترى Service Worker مسجل

## 🎯 التحسينات الإضافية (اختيارية)

### 1. إضافة Redis للـ Caching

```bash
npm install redis
```

```typescript
// backend/lib/redis.ts
import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.connect();

export default client;
```

### 2. استخدام CDN (Cloudflare)

1. إنشاء حساب على Cloudflare
2. إضافة الدومين
3. تفعيل Auto Minify (JS, CSS, HTML)
4. تفعيل Brotli Compression
5. إضافة Page Rule:
   ```
   URL: yourdomain.com/*
   Cache Level: Cache Everything
   Edge Cache TTL: 2 hours
   ```

### 3. تفعيل ISR في Next.js

```typescript
// pages/index.tsx
export async function getStaticProps() {
  const response = await fetch(`${API_URL}/api/articles?limit=50`);
  const data = await response.json();
  
  return {
    props: { articles: data.data || [] },
    revalidate: 600, // 10 minutes
  };
}
```

## 🐛 استكشاف الأخطاء

### المشكلة: Migration فشل
**الحل:**
```bash
cd backend
npx prisma migrate reset
npx prisma migrate dev
```

### المشكلة: Service Worker لا يعمل
**الحل:**
1. تأكد من أن الموقع على HTTPS أو localhost
2. امسح Cache المتصفح
3. أعد تحميل الصفحة

### المشكلة: الصور لا تظهر بصيغة WebP
**الحل:**
1. تأكد من تشغيل سكريبت التحويل
2. تحقق من وجود مجلد `webp`
3. تحديث `imageResolver.ts` لاستخدام الصور المحولة

## 📈 النتائج المتوقعة

| المقياس | قبل | بعد |
|---------|-----|-----|
| زمن التحميل | 4-5s | 1-2s |
| First Contentful Paint | 3s | 0.8s |
| حجم البيانات | 2-3 MB | 500-800 KB |
| عدد الطلبات | 100+ | 20-30 |

## 💡 نصائح إضافية

1. **استخدم Lazy Loading** لكل الصور تحت الـ fold
2. **فعّل Gzip/Brotli** على السيرفر
3. **قلل عدد الـ API Calls** باستخدام Batch Requests
4. **استخدم Skeleton Loaders** بدلاً من Spinners
5. **راقب الأداء** باستمرار باستخدام Google Analytics

## 🔗 روابط مفيدة

- [Prisma Performance Guide](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Web.dev Performance](https://web.dev/performance/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)

---

**آخر تحديث:** 2026-07-21  
**بواسطة:** Kiro AI
