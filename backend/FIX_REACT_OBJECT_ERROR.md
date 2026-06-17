# إصلاح خطأ "Objects are not valid as a React child"

## المشكلة
```
Uncaught Error: Objects are not valid as a React child 
(found: object with keys {id, name, slug, subtitle, deskLead, deskEmail})
```

## السبب
الـ API كان يرسل `category` و `author` كـ **objects كاملة** بدلاً من strings:

```json
{
  "id": 123,
  "title": "عنوان المقال",
  "category": {
    "id": 7,
    "name": "سياسة",
    "slug": "politics",
    "subtitle": null,
    "deskLead": null,
    "deskEmail": null
  },
  "author": {
    "id": 1,
    "name": "أحمد",
    "email": "ahmad@example.com",
    "role": "EDITOR"
  }
}
```

عندما يحاول React عرض `{article.category}` → **خطأ!** لأنه object وليس string.

## الحل

### استخدام `cleanArticle()` و `cleanArticles()`

هذه الدوال موجودة في `lib/cleanApiResponse.ts` وتقوم بـ:
1. استخراج الـ IDs والأسماء من الـ objects
2. حذف الـ nested objects
3. إرجاع بيانات "مسطحة" (flat) يمكن لـ React عرضها

**قبل:**
```json
{
  "category": { "id": 7, "name": "سياسة", ... }
}
```

**بعد:**
```json
{
  "categoryId": 7,
  "categoryName": "سياسة",
  "categorySlug": "politics",
  "category": undefined  // محذوف
}
```

## الملفات المعدلة

### 1. `/api/articles/index.ts` (GET - قائمة المقالات)

**قبل:**
```typescript
const articles = await prisma.article.findMany({ ... });
res.status(200).json(articles);  // ❌ يرسل objects
```

**بعد:**
```typescript
import { cleanArticles, cleanArticle } from "../../../lib/cleanApiResponse";

const articles = await prisma.article.findMany({ ... });
const cleanedArticles = cleanArticles(articles);  // ✅ ينظف
res.status(200).json(cleanedArticles);
```

### 2. `/api/articles/index.ts` (POST - إنشاء مقال)

**قبل:**
```typescript
const created = await prisma.article.create({ ... });
return res.status(201).json(created);  // ❌ يرسل objects
```

**بعد:**
```typescript
const created = await prisma.article.create({ ... });
const cleanedArticle = cleanArticle(created);  // ✅ ينظف
return res.status(201).json(cleanedArticle);
```

### 3. `/api/articles/[id]/index.ts` (GET - مقال واحد)

**قبل:**
```typescript
const article = await prisma.article.findUnique({ ... });
return res.status(200).json(article);  // ❌ يرسل objects
```

**بعد:**
```typescript
import { cleanArticle } from '../../../../lib/cleanApiResponse';

const article = await prisma.article.findUnique({ ... });
const cleanedArticle = cleanArticle(article);  // ✅ ينظف
return res.status(200).json(cleanedArticle);
```

### 4. `/api/articles/[id]/index.ts` (PATCH/PUT - تحديث مقال)

**قبل:**
```typescript
const updated = await prisma.article.update({ ... });
return res.status(200).json(updated);  // ❌ يرسل objects
```

**بعد:**
```typescript
const updated = await prisma.article.update({ ... });
const cleanedArticle = cleanArticle(updated);  // ✅ ينظف
return res.status(200).json(cleanedArticle);
```

## كيف يعمل `cleanArticle()`

```typescript
export function cleanArticle(article: any) {
  if (!article) return null;

  return {
    ...article,
    
    // استخراج معلومات Category
    categoryId: article.category?.id || article.categoryId || null,
    categoryName: article.category?.name || null,
    categorySlug: article.category?.slug || null,
    
    // استخراج معلومات Author
    authorId: article.author?.id || article.authorId || null,
    authorName: article.author?.name || article.author?.email || null,
    authorEmail: article.author?.email || null,
    authorRole: article.author?.role || article.authorRole || null,
    
    // حذف الـ nested objects
    category: undefined,
    author: undefined
  };
}
```

## Frontend يستخدم الحقول الجديدة

في `ArticleCard.tsx` و `Home.tsx`:

```typescript
// ✅ استخدام الحقول المسطحة
const categoryName = article.categoryName || '';
const authorName = article.authorName || '';

// عرض في JSX
<span>{categoryName}</span>
<span>By {authorName}</span>
```

**ملاحظة:** الكود كان يتعامل مع الحالتين (object و string) بالفعل، لكن الآن مع التنظيف في الـ API، لن يحتاج للتحقق.

## الفوائد

### 1. لا أخطاء React ✅
- لا مزيد من "Objects are not valid as a React child"
- البيانات جاهزة للعرض مباشرة

### 2. أداء أفضل ⚡
- بيانات أخف (لا nested objects كبيرة)
- JSON أصغر حجماً
- سرعة نقل أعلى

### 3. كود أبسط 🎯
- Frontend لا يحتاج للتحقق من نوع البيانات
- لا حاجة لـ `typeof` checks
- منطق أوضح

### 4. اتساق API 📐
- جميع endpoints ترسل نفس شكل البيانات
- سهل التوقع والاستخدام
- تقليل الأخطاء

## الاختبار

### قبل التحديث:
```bash
# افتح المقال في المتصفح
❌ Error: Objects are not valid as a React child
```

### بعد التحديث:
```bash
# افتح المقال في المتصفح
✅ يعمل بشكل طبيعي
✅ يعرض اسم القسم والمؤلف
✅ لا أخطاء في console
```

## API Response Examples

### GET /api/articles (قائمة)
```json
[
  {
    "id": 123,
    "title": "عنوان المقال",
    "categoryId": 7,
    "categoryName": "سياسة",
    "categorySlug": "politics",
    "authorId": 1,
    "authorName": "أحمد",
    "authorEmail": "ahmad@example.com",
    "authorRole": "EDITOR",
    "category": undefined,
    "author": undefined
  }
]
```

### GET /api/articles/123 (مقال واحد)
```json
{
  "id": 123,
  "title": "عنوان المقال",
  "categoryId": 7,
  "categoryName": "سياسة",
  "categorySlug": "politics",
  "authorId": 1,
  "authorName": "أحمد",
  "authorEmail": "ahmad@example.com",
  "authorRole": "EDITOR"
}
```

## ملاحظات

### لماذا `category: undefined` بدلاً من حذفه؟
```typescript
category: undefined  // ✅ يحذف من JSON
delete article.category  // ❌ يعدل الـ object الأصلي
```

### هل يؤثر على البيانات في قاعدة البيانات?
❌ **لا!** التنظيف يحدث فقط في الـ response
✅ قاعدة البيانات تبقى كما هي

### هل يؤثر على Admin Panel?
❌ **لا!** Admin panel يعمل مع الحقول المسطحة
✅ forms تستخدم `categoryId` و `authorId`

## الملخص

| قبل | بعد |
|-----|-----|
| ❌ `category` object | ✅ `categoryName` string |
| ❌ `author` object | ✅ `authorName` string |
| ❌ أخطاء React | ✅ لا أخطاء |
| ❌ JSON كبير | ✅ JSON أصغر |

---

**تاريخ التحديث**: 17 يونيو 2026  
**الحالة**: ✅ تم الإصلاح والاختبار
**التأثير**: جميع endpoints تعمل الآن بشكل صحيح
