# إصلاح عرض الفيديوهات بدون صورة

## المشكلة
عند رفع فيديو بدون صورة، كان يظهر placeholder "No Image Available" بدلاً من شيء يشير للفيديو.

## الحل المطبق

### 1. تحديث `imageResolver.ts`
**إضافة دالة للتحقق من ملفات الفيديو:**
```typescript
export function isVideoFile(path: string | null | undefined): boolean {
  if (!path) return false;
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
  return videoExtensions.some(ext => path.toLowerCase().endsWith(ext));
}
```

**تحديث `getImageUrl` لدعم `videoFile`:**
```typescript
export function getImageUrl(
  imageVar: any, 
  videoUrl?: string | null, 
  videoFile?: string | null
): string
```

**الأولوية:**
1. إذا كان هناك `image` → استخدمها
2. إذا كان هناك `videoFile` → استخدم مسار الفيديو (للـ placeholder)
3. إذا كان هناك `videoUrl` (YouTube) → استخرج الصورة المصغرة
4. وإلا → placeholder.svg

### 2. إضافة أيقونة تشغيل (Play Icon) فوق الصورة

**في `ArticleCard.tsx`:**
```tsx
{/* Video indicator overlay */}
{!article.image && (article.videoUrl || article.videoFile) && (
  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
      <svg className="w-8 h-8 text-brand-red ml-1" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  </div>
)}
```

**تم إضافتها في:**
- ✅ `ArticleCard` - Horizontal layout
- ✅ `ArticleCard` - Vertical layout (default)
- ✅ `Home.tsx` - Hero article section

### 3. تحديث جميع استدعاءات `getImageUrl`

**قبل:**
```typescript
getImageUrl(article.image, article.videoUrl)
```

**بعد:**
```typescript
getImageUrl(article.image, article.videoUrl, article.videoFile)
```

**الملفات المحدثة:**
- ✅ `src/components/ArticleCard.tsx` (مرتين)
- ✅ `src/pages/Home.tsx`
- ✅ `src/pages/ArticleDetail.tsx` (مرتين)

### 4. تحديث Types

**في `src/types/api.d.ts`:**
```typescript
export interface Article {
  // ... existing fields
  videoFile?: string | null; // Path to uploaded video file
}
```

## النتيجة

### قبل التحديث:
- فيديو بدون صورة → يظهر placeholder رمادي كبير مع "Sudan Times - No Image Available"
- مربك للمستخدم - لا يعرف أن هناك فيديو

### بعد التحديث:
- فيديو بدون صورة → يظهر placeholder مع **أيقونة تشغيل بيضاء كبيرة** في المنتصف
- واضح للمستخدم أن المقال يحتوي على فيديو
- التصميم أنيق واحترافي

## التفاصيل التقنية

### أيقونة التشغيل (Play Icon)
- **الحجم**: 64px × 64px (16 × 16 في Tailwind)
- **الخلفية**: دائرة بيضاء شبه شفافة (`bg-white/90`)
- **اللون**: أحمر Sudan Times (`text-brand-red`)
- **Hover Effect**: الخلفية السوداء تصبح أغمق (`bg-black/30` → `bg-black/40`)
- **موضع السهم**: قليلاً لليمين (`ml-1`) لتوسيط بصري أفضل

### شروط الظهور
الأيقونة تظهر فقط عندما:
```typescript
!article.image && (article.videoUrl || article.videoFile)
```
- لا توجد صورة **و** (يوجد رابط فيديو **أو** ملف فيديو)

## الملفات المعدلة

### Frontend
1. `src/utils/imageResolver.ts` - إضافة `isVideoFile` وتحديث `getImageUrl`
2. `src/components/ArticleCard.tsx` - إضافة Play icon overlay
3. `src/pages/Home.tsx` - إضافة Play icon في Hero section
4. `src/pages/ArticleDetail.tsx` - تمرير `videoFile` لـ `getImageUrl`
5. `src/types/api.d.ts` - إضافة `videoFile` للـ Article interface

### لم يتم التعديل
- Backend APIs - تعمل بالفعل بشكل صحيح
- Database schema - تم تحديثه مسبقاً
- VideoEmbed component - يعمل بشكل صحيح

## اختبار

### سيناريوهات الاختبار:
1. ✅ مقال مع صورة → تظهر الصورة بشكل طبيعي
2. ✅ مقال مع فيديو YouTube بدون صورة → thumbnail YouTube + Play icon
3. ✅ مقال مع فيديو مرفوع بدون صورة → placeholder + Play icon
4. ✅ مقال مع فيديو Facebook بدون صورة → placeholder + Play icon
5. ✅ مقال مع فيديو Twitter بدون صورة → placeholder + Play icon

### النتيجة المتوقعة:
- جميع البطاقات تعرض محتوى مرئي مناسب
- لا يوجد placeholder فارغ أو مربك
- المستخدم يعرف فوراً أن المقال يحتوي على فيديو

## ملاحظات

### لماذا لم نستخدم `<video>` في البطاقة؟
- **الأداء**: تحميل فيديوهات متعددة في صفحة واحدة سيكون بطيء جداً
- **تجربة المستخدم**: autoplay للفيديوهات مزعج
- **استهلاك البيانات**: تحميل الفيديو كاملاً فقط للمعاينة مكلف

### الحل الحالي (Play Icon):
- ✅ سريع وخفيف
- ✅ واضح للمستخدم
- ✅ لا يستهلك بيانات
- ✅ يحافظ على تجربة التصفح سلسة

### تحسينات مستقبلية (اختياري):
1. 🔄 استخراج صورة مصغرة من الفيديو المرفوع (باستخدام FFmpeg)
2. 🔄 تخزين الصورة المصغرة تلقائياً عند رفع الفيديو
3. 🔄 إضافة مؤشر مدة الفيديو على الأيقونة

---

**تاريخ التحديث**: 17 يونيو 2026  
**الحالة**: ✅ مكتمل ويعمل
