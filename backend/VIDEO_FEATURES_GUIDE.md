# دليل ميزات الفيديو الشامل

## نظرة عامة

تم تحديث النظام لدعم ثلاث طرق لإضافة الفيديو للمقالات:

### 1. رفع ملف فيديو من الجهاز ⬆️
- رفع ملفات فيديو مباشرة (MP4, WebM, OGG)
- الحد الأقصى للحجم: **100 ميجابايت**
- يتم تشغيل الفيديو باستخدام HTML5 Video Player

### 2. روابط YouTube ▶️
- تضمين كامل مع iframe
- جودة عالية تلقائياً
- يعمل مباشرة بدون مشاكل

### 3. روابط Twitter/X 🐦
- تضمين التغريدات التي تحتوي على فيديو
- يعمل مع الروابط الجديدة (x.com) والقديمة (twitter.com)

### 4. روابط Facebook (رابط خارجي) 🔗
- Facebook لديه قيود خصوصية على التضمين
- يتم عرض زر "مشاهدة على Facebook" بدلاً من التضمين
- يفتح الفيديو في صفحة Facebook مباشرة

---

## التغييرات التقنية

### قاعدة البيانات

#### 1. Schema Update
```prisma
model Article {
  // ... existing fields
  videoUrl    String?   // URL for embedded videos (YouTube, Twitter/X, Facebook)
  videoFile   String?   // Path to uploaded video file
  // ... rest of fields
}
```

#### 2. Migration
```bash
npx prisma migrate dev --name add_video_file_field
```

---

### Backend Updates

#### 1. Upload API (`/api/admin/uploads`)
**يدعم الآن:**
- صور: JPEG, PNG, GIF, WebP, SVG (حد أقصى 10MB)
- فيديو: MP4, WebM, OGG, QuickTime (حد أقصى 100MB)

**المسارات:**
- Local: `/uploads/video-name-timestamp.mp4`
- S3: يمكن التكوين عبر متغيرات البيئة

#### 2. Articles API (`/api/articles`)
**تم إضافة:**
```typescript
videoFile: payload.videoFile || null
```

#### 3. Clean API Response (`lib/cleanApiResponse.ts`)
**تم إضافة:**
```typescript
if (article.videoFile !== undefined) payload.videoFile = article.videoFile || null;
```

---

### Frontend Updates

#### 1. VideoEmbed Component (`src/components/VideoEmbed.tsx`)

**Props الجديدة:**
```typescript
interface VideoEmbedProps {
  url?: string;        // YouTube, Twitter/X, Facebook URL
  videoFile?: string;  // Path to uploaded video file
  className?: string;
}
```

**المنصات المدعومة:**

##### YouTube
```typescript
// Patterns supported:
- https://www.youtube.com/watch?v=VIDEO_ID
- https://youtu.be/VIDEO_ID
- https://www.youtube.com/embed/VIDEO_ID
- https://www.youtube.com/shorts/VIDEO_ID

// Embed URL:
https://www.youtube.com/embed/VIDEO_ID?rel=0&modestbranding=1
```

##### Twitter/X
```typescript
// Patterns supported:
- https://twitter.com/username/status/TWEET_ID
- https://x.com/username/status/TWEET_ID

// Embed URL:
https://platform.twitter.com/embed/Tweet.html?id=TWEET_ID&theme=light
```

##### Facebook (Link Only)
```typescript
// Any Facebook video URL:
- https://www.facebook.com/share/v/...
- https://www.facebook.com/watch?v=...
- https://fb.watch/...

// Shows: Link button instead of embed
// Reason: Privacy restrictions prevent embedding
```

##### Uploaded Video (HTML5)
```typescript
<video controls>
  <source src="/uploads/video.mp4" type="video/mp4" />
  <source src="/uploads/video.webm" type="video/webm" />
</video>
```

#### 2. Admin Forms

##### New Article (`backend/pages/admin/articles/new.tsx`)

**State الجديد:**
```typescript
const [article, setArticle] = useState({
  // ... existing
  videoUrl: '',
  videoFile: '',
});
const [uploadingVideo, setUploadingVideo] = useState(false);
```

**دالة رفع الفيديو:**
```typescript
const handleVideoUpload = async (file: File) => {
  // Check file size (max 100MB)
  if (file.size > 100 * 1024 * 1024) {
    alert('حجم الفيديو كبير جداً. الحد الأقصى 100 ميجابايت');
    return;
  }

  setUploadingVideo(true);
  const form = new FormData();
  form.append('file', file, file.name);
  const res = await fetch('/api/admin/uploads', { method: 'POST', body: form });
  if (res.ok) {
    const j = await res.json();
    setArticle(prev => ({ ...prev, videoFile: j.url, videoUrl: '' }));
  }
  setUploadingVideo(false);
};
```

**واجهة الإدخال:**
```tsx
{/* Video URL Input */}
<input 
  type="url"
  value={article.videoUrl || ''} 
  onChange={e => setArticle({ ...article, videoUrl: e.target.value, videoFile: '' })}
  disabled={!!article.videoFile}
  placeholder="https://youtube.com/... or https://x.com/..."
/>

{/* Video File Upload */}
<input 
  type="file" 
  accept="video/*"
  onChange={e => e.target.files && handleVideoUpload(e.target.files[0])}
  disabled={uploadingVideo || !!article.videoUrl}
/>
```

**منطق التحقق:**
```typescript
// Must have at least one: image, videoUrl, or videoFile
if (!article.image && !article.videoUrl && !article.videoFile) {
  return alert('يجب إضافة صورة أو رابط فيديو أو ملف فيديو على الأقل');
}
```

##### ArticleDetail Page

**عرض الفيديو:**
```tsx
{(article.videoUrl || article.videoFile) && (
  <div className="space-y-2">
    <VideoEmbed url={article.videoUrl} videoFile={article.videoFile} />
    <p className="text-xs text-muted italic">
      Video content related to {article.title.toLowerCase()}
    </p>
  </div>
)}
```

---

## سير العمل (Workflow)

### إنشاء مقال بفيديو مرفوع

1. افتح صفحة إنشاء مقال جديد
2. أدخل العنوان والمحتوى
3. **اختر واحدة من:**
   - **رفع ملف فيديو**: انقر "رفع فيديو" واختر الملف (حد أقصى 100MB)
   - **رابط YouTube**: الصق رابط الفيديو من YouTube
   - **رابط Twitter/X**: الصق رابط التغريدة
   - **رابط Facebook**: الصق رابط الفيديو (سيظهر كزر)
4. اختر القسم والحالة
5. انقر "نشر المقال"

### ملاحظات مهمة

#### الأولوية:
- إذا كان هناك `videoFile` → يتم تجاهل `videoUrl`
- إذا أضفت `videoUrl` → يتم تعطيل رفع الفيديو
- يمكن استخدام واحد فقط في كل مرة

#### التحقق:
- يجب أن يكون هناك على الأقل: صورة **أو** رابط فيديو **أو** ملف فيديو
- المقالات بدون صورة + مع فيديو → مسموحة الآن ✅

---

## أمثلة على الروابط المدعومة

### YouTube
```
✅ https://www.youtube.com/watch?v=dQw4w9WgXcQ
✅ https://youtu.be/dQw4w9WgXcQ
✅ https://www.youtube.com/shorts/abc123xyz
```

### Twitter/X
```
✅ https://twitter.com/user/status/1234567890
✅ https://x.com/user/status/1234567890
```

### Facebook
```
✅ https://www.facebook.com/share/v/14hBFAGC8gP/
✅ https://www.facebook.com/watch?v=123456789
✅ https://fb.watch/xyz123/
⚠️  سيظهر كزر "مشاهدة على Facebook" بسبب قيود الخصوصية
```

---

## حل المشاكل (Troubleshooting)

### المشكلة: "This video can't be embedded" (Facebook)
**السبب**: Facebook يمنع تضمين الفيديوهات بسبب إعدادات الخصوصية

**الحل**: 
- استخدم خاصية رفع الفيديو بدلاً من الرابط
- أو اترك الرابط (سيظهر زر للانتقال لـ Facebook)

### المشكلة: "حجم الفيديو كبير جداً"
**السبب**: الفيديو أكبر من 100MB

**الحل**:
1. ضغط الفيديو باستخدام:
   - HandBrake
   - FFmpeg: `ffmpeg -i input.mp4 -vcodec h264 -acodec mp3 output.mp4`
   - أدوات أونلاين
2. أو ارفع الفيديو على YouTube واستخدم الرابط

### المشكلة: الفيديو المرفوع لا يعمل
**تأكد من**:
- الصيغة مدعومة (MP4, WebM, OGG)
- المسار صحيح في `/uploads/`
- المتصفح يدعم الصيغة

---

## الأداء والتحسينات

### الصور المصغرة (Thumbnails)

تلقائياً يتم استخراج الصورة المصغرة من YouTube:
```typescript
// In imageResolver.ts
export function getVideoThumbnail(videoUrl: string | null | undefined): string | null {
  // YouTube thumbnail URL:
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  
  // For uploaded videos: use first frame (not implemented yet)
}
```

### التخزين

**Local Storage (الافتراضي):**
- المسار: `backend/public/uploads/`
- يتم إنشاء اسم فريد: `video-name-1781234567890.mp4`

**S3 (اختياري):**
```env
S3_BUCKET=your-bucket-name
S3_REGION=us-east-1
S3_KEY_PREFIX=videos/
S3_PUBLIC_URL=https://cdn.yourdomain.com/
```

---

## الخطوات التالية (اختياري)

### محتملة التطوير:
1. ✅ دعم Twitter/X - **مكتمل**
2. ✅ رفع الفيديو من الجهاز - **مكتمل**
3. 🔄 معالجة الفيديو (ضغط تلقائي)
4. 🔄 استخراج صورة مصغرة من الفيديو المرفوع
5. 🔄 دعم streaming للفيديوهات الكبيرة
6. 🔄 إضافة progress bar أثناء رفع الفيديو
7. 🔄 دعم Instagram و TikTok

---

**تاريخ التحديث**: 17 يونيو 2026  
**الحالة**: ✅ جاهز للاستخدام
