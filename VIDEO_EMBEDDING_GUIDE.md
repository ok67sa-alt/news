# دليل إضافة الفيديوهات / Video Embedding Guide

## ميزة جديدة: إضافة فيديوهات إلى المقالات

يمكنك الآن إضافة فيديوهات من **YouTube** و **Facebook** إلى مقالاتك باستخدام الروابط فقط!

## كيفية الاستخدام / How to Use

### 1. من لوحة التحرير

عند إنشاء أو تعديل مقال:
1. اذهب إلى قسم **"رابط الفيديو (اختياري)"**
2. الصق رابط الفيديو من YouTube أو Facebook
3. احفظ المقال

### 2. أنواع الروابط المدعومة / Supported URL Formats

#### YouTube:
```
https://www.youtube.com/watch?v=VIDEO_ID
https://youtu.be/VIDEO_ID
https://www.youtube.com/embed/VIDEO_ID
https://www.youtube.com/shorts/VIDEO_ID
```

#### Facebook:
```
https://www.facebook.com/username/videos/VIDEO_ID
https://fb.watch/VIDEO_ID
https://www.facebook.com/watch/?v=VIDEO_ID
```

### 3. عرض الفيديو / Video Display

- الفيديو يظهر تلقائياً في صفحة المقال
- يتم عرضه أعلى الصورة البارزة
- تصميم متجاوب (Responsive) يعمل على جميع الأجهزة
- إطار مدمج (Embedded) بتصميم احترافي

## التغييرات التقنية / Technical Changes

### 1. قاعدة البيانات
- ✅ إضافة حقل `videoUrl` إلى جدول `Article`
- ✅ Migration تم تطبيقها بنجاح

### 2. المكونات الجديدة / New Components
- ✅ `VideoEmbed.tsx` - مكون لعرض الفيديوهات
- ✅ دعم YouTube و Facebook
- ✅ معالجة أخطاء الروابط تلقائياً

### 3. الصفحات المحدثة / Updated Pages

#### Backend (Admin Panel):
- `pages/admin/articles/new.tsx` - إضافة حقل فيديو
- `pages/admin/articles/edit/[id].tsx` - تعديل حقل فيديو
- `pages/api/articles/index.ts` - دعم videoUrl
- `pages/api/articles/[id]/index.ts` - دعم تحديث videoUrl

#### Frontend:
- `src/components/VideoEmbed.tsx` - مكون جديد
- `src/pages/ArticleDetail.tsx` - عرض الفيديو

## مثال عملي / Example

### إنشاء مقال بفيديو:

1. **العنوان:** "قمة السودان الاقتصادية 2026"
2. **المحتوى:** نص المقال...
3. **الصورة البارزة:** صورة من القمة
4. **رابط الفيديو:** `https://youtube.com/watch?v=abc123`

### النتيجة:
- ✅ الفيديو يظهر في الصفحة
- ✅ يمكن تشغيله مباشرة
- ✅ تصميم احترافي ومتناسق

## الميزات / Features

✅ **دعم منصتين:** YouTube و Facebook  
✅ **سهل الاستخدام:** فقط الصق الرابط  
✅ **تصميم متجاوب:** يعمل على الهواتف والحواسيب  
✅ **معالجة الأخطاء:** رسالة واضحة للروابط غير الصحيحة  
✅ **اختياري:** المقالات لا تحتاج فيديو إلزامياً  

## ملاحظات مهمة / Important Notes

1. **حقل اختياري:** لا يشترط إضافة فيديو لكل مقال
2. **رابط واحد:** يمكن إضافة فيديو واحد فقط لكل مقال
3. **التحقق التلقائي:** النظام يتحقق من صحة الرابط تلقائياً
4. **الأداء:** الفيديوهات مدمجة (embedded) لا تؤثر على سرعة الموقع

## استكشاف الأخطاء / Troubleshooting

### الفيديو لا يظهر؟
- ✅ تأكد من صحة الرابط
- ✅ تأكد أن الفيديو عام (Public)
- ✅ جرّب نسخ الرابط من شريط العنوان مباشرة

### رسالة خطأ "Invalid video URL"؟
- ❌ الرابط غير مدعوم
- ✅ استخدم فقط روابط YouTube أو Facebook
- ✅ تأكد من عدم وجود مسافات في الرابط

---

**آخر تحديث / Last Updated:** 2026-06-16  
**الإصدار / Version:** 1.0.0
