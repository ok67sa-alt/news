# 🔧 استكشاف الأخطاء وحلها

## ❌ المشكلة: API يعطي خطأ 500

### الأعراض:
```
❌ API متاح: Status Code: 500
{"error":"Failed to load articles"}
```

### الأسباب المحتملة:

#### 1. مشكلة في Prisma
```bash
cd backend
npx prisma generate
npx prisma db push
```

#### 2. مشكلة في قاعدة البيانات
تحقق من ملف `.env`:
```env
DATABASE_URL="mysql://user:password@localhost:3306/database_name"
```

تأكد أن:
- ✅ MySQL يعمل
- ✅ اسم المستخدم وكلمة المرور صحيحة
- ✅ قاعدة البيانات موجودة

#### 3. مشكلة في Cache Import
إذا كان الخطأ يتعلق بـ `cache.ts`:

**الحل المؤقت:**
```typescript
// في backend/pages/api/articles/index.ts
// علّق على imports الـ cache مؤقتاً:

// import cache, { CacheKeys, CacheTTL, invalidateArticleCache } from "../../../lib/cache";
```

ثم أعد تشغيل السيرفر.

---

## ❌ المشكلة: Cache Headers مفقودة

### الحل:
تأكد من أن الكود يضيف Headers بشكل صحيح:

```typescript
res.setHeader('X-Cache', 'HIT');
res.setHeader('Cache-Control', 'public, s-maxage=600');
```

---

## ❌ المشكلة: البيانات لا تظهر

### التحقق:
```bash
# تحقق من وجود بيانات في قاعدة البيانات
cd backend
npx prisma studio
```

### إضافة بيانات تجريبية:
```bash
cd backend
npm run db:seed
```

---

## ✅ خطوات سريعة للإصلاح

### 1. أعد بناء Prisma:
```bash
cd backend
npx prisma generate
npx prisma db push
```

### 2. تحقق من قاعدة البيانات:
```bash
cd backend
npx prisma studio
```
- يجب أن ترى جدول `Article` مع بيانات

### 3. أعد تشغيل السيرفر:
```bash
cd backend
npm run dev
```

### 4. اختبر API يدوياً:
افتح في المتصفح:
```
http://localhost:3000/api/health
```
يجب أن ترى:
```json
{
  "status": "ok",
  "timestamp": "...",
  "message": "Backend is running"
}
```

ثم:
```
http://localhost:3000/api/articles?limit=5
```

---

## 🔍 تشخيص متقدم

### تشغيل الاختبار خطوة بخطوة:

#### 1. Health Check:
```bash
curl http://localhost:3000/api/health
```
**المتوقع:** `{"status":"ok"}`

#### 2. Articles API:
```bash
curl http://localhost:3000/api/articles?limit=1
```
**المتوقع:** JSON مع مقال واحد

#### 3. Cache Headers:
```bash
curl -I http://localhost:3000/api/articles
```
**المتوقع:** `X-Cache: MISS` أو `X-Cache: HIT`

---

## 🐛 أخطاء شائعة

### خطأ: "Cannot find module 'cache'"
**الحل:**
```bash
# تأكد من وجود الملف
ls backend/lib/cache.ts

# إذا لم يكن موجوداً، الملف موجود في المشروع
# فقط تأكد من المسار الصحيح
```

### خطأ: "Prisma Client is not generated"
**الحل:**
```bash
cd backend
npx prisma generate
```

### خطأ: "Database does not exist"
**الحل:**
```bash
# أنشئ قاعدة البيانات
mysql -u root -p
CREATE DATABASE your_database_name;
exit;

# ثم
cd backend
npx prisma db push
```

---

## ✅ Checklist التحقق

قبل تشغيل الاختبارات:

- [ ] ✅ MySQL يعمل
- [ ] ✅ قاعدة البيانات موجودة
- [ ] ✅ `.env` صحيح
- [ ] ✅ `npx prisma generate` تم تنفيذه
- [ ] ✅ `npx prisma db push` تم تنفيذه
- [ ] ✅ البيانات موجودة (تحقق من Prisma Studio)
- [ ] ✅ Backend يعمل على port 3000
- [ ] ✅ لا أخطاء في Console

---

## 🚀 اختبار بسيط

بعد إصلاح المشاكل:

```bash
# 1. Health Check
curl http://localhost:3000/api/health

# 2. Articles
curl http://localhost:3000/api/articles?limit=1

# 3. تشغيل الاختبار
npm run test:optimizations
```

---

## 📞 إذا استمرت المشكلة

1. تحقق من Backend Console logs
2. ابحث عن خطأ مفصل
3. راجع ملف `backend/pages/api/articles/index.ts`
4. تأكد من أن جميع imports صحيحة

---

**ملاحظة مهمة:**  
إذا كان هناك خطأ في `cache.ts` import، يمكنك تعطيل الـ cache مؤقتاً للاختبار، ثم إصلاحه لاحقاً.
