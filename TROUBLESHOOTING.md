# دليل استكشاف الأخطاء / Troubleshooting Guide

## الأخطاء الشائعة وحلولها / Common Errors & Solutions

---

## ❌ Error: POST /api/articles [500 Internal Server Error]

### الأعراض:
- عند إنشاء مقال جديد، يظهر خطأ 500
- المقال لا يُحفظ في قاعدة البيانات

### الأسباب المحتملة:
1. ✅ **تم الإصلاح:** حقل `videoUrl` لم يكن في `prepareArticleForSubmission`
2. Prisma Client لم يتم تحديثه بعد تغيير Schema
3. قاعدة البيانات غير متصلة

### الحل:
```bash
# 1. تأكد من تشغيل PostgreSQL
# تحقق من الخدمة في Task Manager

# 2. تحديث Prisma Client
cd backend
npx prisma generate

# 3. مزامنة قاعدة البيانات
npx prisma db push

# 4. اختبار الاتصال
node test-db.cjs

# 5. إعادة تشغيل Backend
npm run dev
```

---

## ❌ Error: Image Upload Failed [400 Bad Request]

### الأعراض:
- عند رفع صورة، يظهر خطأ 400
- الصورة لا تُرفع

### الأسباب المحتملة:
1. ✅ **تم الإصلاح:** formidable v3 API changes
2. مجلد uploads غير موجود
3. صيغة الملف غير مدعومة

### الحل:
```bash
# إنشاء مجلد uploads يدوياً
cd backend
mkdir public\uploads

# الصيغ المدعومة:
# Images: JPG, PNG, GIF, WebP, SVG
# Max size: 10MB
```

---

## ❌ Error: EPERM operation not permitted (Prisma)

### الأعراض:
```
EPERM: operation not permitted, unlink 'query_engine-windows.dll.node'
```

### السبب:
- خادم Backend يعمل ويمنع تحديث Prisma

### الحل:
```bash
# 1. أوقف خادم Backend (Ctrl+C)
# 2. أغلق جميع نوافذ Terminal
# 3. انتظر 5 ثواني
# 4. حاول مرة أخرى:
npx prisma generate
```

---

## ❌ Articles Not Appearing on Home Page

### الأعراض:
- المقال موجود في قاعدة البيانات
- لا يظهر في الصفحة الرئيسية

### الأسباب:
1. المقال ليس **منشور** (`status: PUBLISHED`)
2. المقال ليس **مميز** (`featured: true`)
3. Frontend لم يتم تحديثه

### الحل:
```bash
# من لوحة الإدارة:
1. افتح المقال للتعديل
2. ✅ تأكد من "الحالة" = "منشور"
3. ✅ ضع علامة على "مميز"
4. احفظ التغييرات

# إذا لم يظهر، حدّث Frontend:
cd ..
npm run dev
```

---

## ❌ Video Not Displaying

### الأعراض:
- أضفت رابط فيديو
- الفيديو لا يظهر في المقال

### الأسباب:
1. رابط غير صحيح
2. الفيديو خاص (Private)
3. منصة غير مدعومة

### الحل:
```bash
# تأكد من:
✅ الرابط من YouTube أو Facebook
✅ الفيديو عام (Public)
✅ الرابط كامل يبدأ بـ https://

# روابط صحيحة:
https://youtube.com/watch?v=abc123
https://youtu.be/abc123
https://facebook.com/user/videos/123456

# روابط خاطئة:
❌ youtube.com/watch?v=abc123 (بدون https)
❌ vimeo.com/... (غير مدعوم)
```

---

## ❌ Database Connection Failed

### الأعراض:
```
Error: Can't reach database server at localhost:5432
```

### السبب:
- PostgreSQL غير مشغل

### الحل:
```bash
# Windows:
1. افتح Services (services.msc)
2. ابحث عن "PostgreSQL"
3. اضغط "Start"

# أو من Command Line:
net start postgresql-x64-15
```

---

## ❌ Port Already in Use

### الأعراض:
```
Error: Port 3000 is already in use
```

### الحل:
```bash
# إيقاف العملية على المنفذ 3000
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# أو غيّر المنفذ في package.json:
"dev": "next dev -p 3001"
```

---

## ❌ Color Theme Not Updating

### الأعراض:
- غيّرت الألوان في الكود
- الموقع لا يزال يظهر بالألوان القديمة

### الحل:
```bash
# 1. امسح cache المتصفح
Ctrl + Shift + R (Hard Reload)

# 2. أعد تشغيل Frontend
cd [project-root]
npm run dev

# 3. امسح dist folder
rm -rf dist
npm run dev
```

---

## 🧪 أدوات التشخيص / Diagnostic Tools

### اختبار قاعدة البيانات:
```bash
cd backend
node test-db.cjs
```

### اختبار الاتصال بـ API:
```bash
# GET articles
curl http://localhost:3000/api/articles

# GET single article
curl http://localhost:3000/api/articles/1
```

### فحص Prisma Schema:
```bash
cd backend
npx prisma studio
# يفتح واجهة لعرض قاعدة البيانات
```

---

## 📝 سجلات مفيدة / Useful Logs

### Backend Logs:
- موقع: Terminal حيث يعمل `npm run dev`
- ابحث عن: `error`, `failed`, `500`

### Frontend Logs:
- موقع: Browser Console (F12)
- ابحث عن: `Error`, `Failed to fetch`

### Database Logs:
- موقع: PostgreSQL logs
- Windows: `C:\Program Files\PostgreSQL\[version]\data\log\`

---

## 🆘 الحصول على مساعدة / Getting Help

إذا استمرت المشكلة:

1. **جمع المعلومات:**
   - نص الخطأ الكامل
   - خطوات إعادة المشكلة
   - سجلات Backend/Frontend

2. **فحص الملفات:**
   - `.env` في backend
   - `DATABASE_URL` صحيح
   - PostgreSQL يعمل

3. **إعادة التشغيل الكاملة:**
   ```bash
   # أوقف كل شيء
   Ctrl+C في جميع Terminals
   
   # أعد تشغيل PostgreSQL
   net restart postgresql-x64-15
   
   # أعد تشغيل Backend
   cd backend
   npm run dev
   
   # أعد تشغيل Frontend
   cd ..
   npm run dev
   ```

---

**آخر تحديث / Last Updated:** 2026-06-16
