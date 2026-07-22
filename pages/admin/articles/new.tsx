import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { prepareArticleForSubmission } from '../../../lib/cleanApiResponse';
import AdminLayout from '../../../backend/components/AdminLayout';

// Editor.js imports
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues
const EditorJSComponent = dynamic(() => import('../../../backend/components/EditorJSComponent'), { ssr: false });
import { withAuth } from '../../../lib/withAuth';

function NewArticle({ user }: { user: any }) {
  const router = useRouter();
  const [article, setArticle] = useState<any>({ 
    title: '', 
    excerpt: '', 
    content: '', 
    image: '', 
    videoUrl: '',
    videoFile: '',
    hero: false,
    featured: false, 
    breaking: false, 
    status: 'DRAFT', 
    categoryId: null 
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/admin/categories');
      const j = res.ok ? await res.json() : [];
      setCategories(j);
    })();
  }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const form = new FormData();
    form.append('file', file, file.name);
    const res = await fetch('/api/admin/uploads', { method: 'POST', body: form });
    if (res.ok) {
      const j = await res.json();
      setArticle((prev: any) => ({ ...prev, image: j.url }));
    } else {
      alert('فشل رفع الصورة');
    }
    setUploading(false);
  };

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
      setArticle((prev: any) => ({ ...prev, videoFile: j.url, videoUrl: '' }));
    } else {
      alert('فشل رفع الفيديو');
    }
    setUploadingVideo(false);
  };

  const handleEditorSave = async () => {
    if (!editorRef.current) {
      console.error('Editor not initialized');
      return '';
    }
    try {
      const outputData = await editorRef.current.save();
      console.log('Editor output:', outputData);
      
      // Check if there's actual content
      if (!outputData || !outputData.blocks || outputData.blocks.length === 0) {
        console.warn('Editor has no content blocks');
        return JSON.stringify({
          time: Date.now(),
          blocks: [],
          version: '2.28.0'
        });
      }
      
      return JSON.stringify(outputData);
    } catch (e) {
      console.error('Editor save failed', e);
      return '';
    }
  };

  const submit = async (e: any) => {
    e.preventDefault();
    
    // Get content from Editor.js
    const editorContent = await handleEditorSave();
    console.log('Content to submit:', editorContent);
    
    // Client-side validation
    if (!article.title || !article.title.trim()) {
      return alert('العنوان مطلوب');
    }
    
    // Check if content has actual blocks
    let hasContent = false;
    try {
      const contentData = JSON.parse(editorContent);
      hasContent = contentData.blocks && contentData.blocks.length > 0;
    } catch (e) {
      console.error('Failed to parse content:', e);
    }
    
    if (!hasContent) {
      return alert('المحتوى مطلوب - يجب كتابة محتوى المقال');
    }
    
    if (!article.categoryId) {
      return alert('اختر قسم');
    }
    
    // Validate that at least image, videoUrl, or videoFile is provided
    if (!article.image && !article.videoUrl && !article.videoFile) {
      return alert('يجب إضافة صورة أو رابط فيديو أو ملف فيديو على الأقل');
    }
    
    // Auto-generate slug from title
    const slug = generateSlug(article.title);
    
    const payload = prepareArticleForSubmission({
      ...article,
      content: editorContent,
      slug,
      readTime: estimateReadTime(editorContent),
      publishedAt: article.status === 'PUBLISHED' ? new Date().toISOString() : null
    });
    
    console.log('Submitting payload:', {
      ...payload,
      content: `${payload.content.substring(0, 100)}...`
    });
    
    const res = await fetch('/api/articles', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(payload) 
    });
    
    if (res.ok) {
      const created = await res.json();
      console.log('Article created:', created);
      alert(`تم إنشاء المقال بنجاح - الحالة: ${created.status}`);
      router.push('/admin/articles');
    } else {
      const error = await res.json();
      console.error('Failed to create:', error);
      alert(error.error || 'فشل الإنشاء');
    }
  };

  function generateSlug(text: string) {
    return text.toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  function estimateReadTime(text: string) {
    const words = text ? text.trim().split(/\s+/).length : 0;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
  }

  return (
    <AdminLayout user={user}>
      <div className="article-editor-page">
        <div className="editor-header">
          <h1>إنشاء مقال جديد</h1>
          <button onClick={() => router.push('/admin/articles')} className="btn-secondary-sm">
            <span>←</span> العودة
          </button>
        </div>

        <form onSubmit={submit} className="article-editor-form-single">
          {/* Title */}
          <div className="form-group-compact">
            <input 
              className="input-title" 
              value={article.title} 
              onChange={e => setArticle({ ...article, title: e.target.value })} 
              placeholder="عنوان المقال..."
              required
            />
          </div>

          {/* Editor.js Content - Smaller height */}
          <div className="editor-container-compact">
            <EditorJSComponent 
              onInitialize={(instance: any) => { editorRef.current = instance; }}
              data={article.content || undefined}
            />
          </div>

          {/* Publish Options - Inline Grid Layout */}
          <div className="publish-options-inline">
            <div className="publish-section">
              <h3 className="section-label">إعدادات النشر</h3>
              <div className="options-grid">
                {/* Status */}
                <div className="option-item">
                  <label>الحالة</label>
                  <select 
                    value={article.status || 'DRAFT'} 
                    onChange={e => setArticle({ ...article, status: e.target.value })} 
                    className="input-select-inline"
                  >
                    <option value="DRAFT">مسودة</option>
                    <option value="REVIEW">مراجعة</option>
                    <option value="PUBLISHED">منشور</option>
                  </select>
                </div>

                {/* Category */}
                <div className="option-item">
                  <label>القسم</label>
                  <select 
                    className="input-select-inline" 
                    value={article.categoryId || ''} 
                    onChange={e => setArticle({ ...article, categoryId: Number(e.target.value) || null })}
                    required
                  >
                    <option value="">-- اختر القسم --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                {/* Hero, Featured & Breaking Checkboxes */}
                <div className="option-item checkboxes-row">
                  <label className="checkbox-label-inline">
                    <input 
                      type="checkbox" 
                      checked={!!article.hero} 
                      onChange={e => setArticle({ ...article, hero: e.target.checked })} 
                    />
                    <span>Hero Article</span>
                  </label>
                  <label className="checkbox-label-inline">
                    <input 
                      type="checkbox" 
                      checked={!!article.featured} 
                      onChange={e => setArticle({ ...article, featured: e.target.checked })} 
                    />
                    <span>Editor's Pick</span>
                  </label>
                  <label className="checkbox-label-inline">
                    <input 
                      type="checkbox" 
                      checked={!!article.breaking} 
                      onChange={e => setArticle({ ...article, breaking: e.target.checked })} 
                    />
                    <span>Breaking News</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="publish-section">
              <h3 className="section-label">المحتوى الإضافي</h3>
              <div className="options-grid">
                {/* Image Upload */}
                <div className="option-item">
                  <label>الصورة البارزة</label>
                  {article.image && (
                    <div className="image-preview-inline">
                      <img src={article.image} alt="preview" />
                      <button 
                        type="button" 
                        onClick={() => setArticle({ ...article, image: '' })} 
                        className="btn-remove-inline"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  <label className="file-upload-label-inline">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={e => e.target.files && handleUpload(e.target.files[0])} 
                      disabled={uploading}
                    />
                    <span>{uploading ? 'جاري الرفع...' : article.image ? 'تغيير الصورة' : 'رفع صورة'}</span>
                  </label>
                </div>

                {/* Video URL */}
                <div className="option-item">
                  <label>رابط الفيديو (YouTube, Twitter/X)</label>
                  <input 
                    type="url"
                    className="input-text-inline" 
                    value={article.videoUrl || ''} 
                    onChange={e => setArticle({ ...article, videoUrl: e.target.value, videoFile: '' })} 
                    placeholder="https://youtube.com/... or https://x.com/..."
                    disabled={!!article.videoFile}
                  />
                  <small className="help-text">
                    {article.videoFile ? 'تم رفع ملف فيديو - احذفه لإضافة رابط' : 'يدعم YouTube و Twitter/X (Facebook: رابط فقط)'}
                  </small>
                </div>

                {/* Video File Upload */}
                <div className="option-item">
                  <label>أو ارفع ملف فيديو</label>
                  {article.videoFile && (
                    <div className="mb-2 p-2 bg-green-50 border border-green-300 rounded text-sm">
                      <span className="text-green-700">✓ تم رفع الفيديو</span>
                      <button 
                        type="button" 
                        onClick={() => setArticle({ ...article, videoFile: '' })} 
                        className="mr-2 text-red-600 hover:text-red-800"
                      >
                        حذف
                      </button>
                    </div>
                  )}
                  <label className="file-upload-label-inline">
                    <input 
                      type="file" 
                      accept="video/*" 
                      onChange={e => e.target.files && handleVideoUpload(e.target.files[0])} 
                      disabled={uploadingVideo || !!article.videoUrl}
                    />
                    <span>
                      {uploadingVideo ? 'جاري رفع الفيديو...' : article.videoFile ? 'تغيير الفيديو' : 'رفع فيديو (حد أقصى 100MB)'}
                    </span>
                  </label>
                  {article.videoUrl && (
                    <small className="help-text text-orange-600">
                      يوجد رابط فيديو - احذفه لرفع ملف
                    </small>
                  )}
                </div>

                {/* Excerpt */}
                <div className="option-item option-item-full">
                  <label>الملخص</label>
                  <textarea 
                    className="input-textarea-inline" 
                    value={article.excerpt} 
                    onChange={e => setArticle({ ...article, excerpt: e.target.value })} 
                    placeholder="ملخص مختصر للمقال..."
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="publish-section">
              <button type="submit" className="btn-publish-main">
                نشر المقال
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

// Protect this page - require authentication
export default withAuth(NewArticle);
