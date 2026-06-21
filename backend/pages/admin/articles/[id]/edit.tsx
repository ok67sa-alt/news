import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { cleanArticle, prepareArticleForSubmission } from '../../../../lib/cleanApiResponse';
import AdminLayout from '../../../../components/AdminLayout';
import { withAuth } from '../../../../lib/withAuth';

const EditorJSComponent = dynamic(() => import('../../../../components/EditorJSComponent'), { ssr: false });

function EditArticle({ user }: { user: any }) {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = await fetch(`/api/articles/${id}`);
      if (!res.ok) { setLoading(false); return; }
      const j = await res.json();
      setArticle(cleanArticle(j));
      setLoading(false);
    })();
    
    // Load categories
    (async () => {
      const res = await fetch('/api/admin/categories');
      const j = res.ok ? await res.json() : [];
      setCategories(j);
    })();
  }, [id]);

  const handleEditorSave = async () => {
    if (!editorRef.current) return article.content;
    try {
      const outputData = await editorRef.current.save();
      return JSON.stringify(outputData);
    } catch (e) {
      console.error('Editor save failed', e);
      return article.content;
    }
  };

  const save = async (publish = false) => {
    if (!article) return;
    setSaving(true);
    
    // Get content from Editor.js
    const editorContent = await handleEditorSave();
    
    const payload = prepareArticleForSubmission({
      ...article,
      content: editorContent
    });
    
    if (publish) { 
      payload.status = 'PUBLISHED'; 
      payload.publishedAt = new Date().toISOString(); 
    } else {
      payload.status = article.status || 'DRAFT';
    }
    
    const res = await fetch(`/api/articles/${article.id}`, { 
      method: 'PATCH', 
      headers: { 'Content-Type':'application/json' }, 
      body: JSON.stringify(payload) 
    });
    setSaving(false);
    if (res.ok) {
      alert('تم حفظ المقال بنجاح');
      router.push('/admin/articles');
    } else {
      const error = await res.json();
      alert(error.error || 'فشل الحفظ');
    }
  };

  const handleImageUpload = async (ev: any) => {
    const f = ev.target.files?.[0];
    if (!f) return;
    
    setUploading(true);
    const form = new FormData();
    form.append('file', f);
    
    const res = await fetch('/api/admin/uploads', { method: 'POST', body: form });
    setUploading(false);
    
    if (!res.ok) { 
      alert('فشل رفع الصورة'); 
      return; 
    }
    
    const j = await res.json();
    setArticle({...article, image: j.url});
  };

  if (loading) {
    return (
      <AdminLayout user={user}>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!article) {
    return (
      <AdminLayout user={user}>
        <div className="card text-center" style={{ padding: 'var(--spacing-2xl)' }}>
          <h3 className="text-xl font-bold mb-2">المقال غير موجود</h3>
          <p className="muted mb-4">لم يتم العثور على المقال المطلوب</p>
          <button className="btn-primary" onClick={() => router.push('/admin/articles')}>
            العودة إلى الأخبار
          </button>
        </div>
      </AdminLayout>
    );
  }

  // Parse Editor.js data if it's a string
  let editorData;
  try {
    editorData = article.content ? JSON.parse(article.content) : undefined;
  } catch (e) {
    editorData = undefined;
  }

  return (
    <AdminLayout user={user}>
      <div className="article-editor-page">
        <div className="editor-header">
          <h1>تحرير المقال</h1>
          <div className="flex gap-2">
            <button 
              className="btn-secondary-sm" 
              onClick={() => router.push('/admin/articles')}
              disabled={saving}
            >
              <span>←</span> إلغاء
            </button>
            <button 
              className="btn-secondary-sm" 
              onClick={() => save(false)} 
              disabled={saving}
              style={{ background: 'var(--accent-light)', color: 'var(--accent-primary)', border: 'none' }}
            >
              {saving ? 'جاري الحفظ...' : 'حفظ'}
            </button>
            <button 
              className="btn-secondary-sm" 
              onClick={() => save(true)} 
              disabled={saving}
              style={{ background: 'var(--accent-primary)', color: 'white', border: 'none' }}
            >
              {saving ? 'جاري النشر...' : 'نشر'}
            </button>
          </div>
        </div>

        <div className="article-editor-form-single">
          {/* Title */}
          <div className="form-group-compact">
            <input 
              className="input-title" 
              value={article.title || ''} 
              onChange={e => setArticle({...article, title: e.target.value})} 
              placeholder="عنوان المقال..."
            />
          </div>

          {/* Editor.js Content - Smaller height */}
          <div className="editor-container-compact">
            <EditorJSComponent 
              onInitialize={(instance: any) => { editorRef.current = instance; }}
              data={editorData}
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
                  >
                    <option value="">-- اختر القسم --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                {/* Featured & Breaking Checkboxes */}
                <div className="option-item checkboxes-row">
                  <label className="checkbox-label-inline">
                    <input 
                      type="checkbox" 
                      checked={!!article.featured} 
                      onChange={e => setArticle({ ...article, featured: e.target.checked })} 
                    />
                    <span>مميز</span>
                  </label>
                  <label className="checkbox-label-inline">
                    <input 
                      type="checkbox" 
                      checked={!!article.breaking} 
                      onChange={e => setArticle({ ...article, breaking: e.target.checked })} 
                    />
                    <span>عاجل</span>
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
                      onChange={handleImageUpload} 
                      disabled={uploading}
                    />
                    <span>{uploading ? 'جاري الرفع...' : article.image ? 'تغيير الصورة' : 'رفع صورة'}</span>
                  </label>
                </div>

                {/* Video URL */}
                <div className="option-item">
                  <label>رابط الفيديو (اختياري)</label>
                  <input 
                    type="url"
                    className="input-text-inline" 
                    value={article.videoUrl || ''} 
                    onChange={e => setArticle({ ...article, videoUrl: e.target.value })} 
                    placeholder="https://youtube.com/..."
                  />
                  <small className="help-text">يدعم YouTube و Facebook</small>
                </div>

                {/* Excerpt */}
                <div className="option-item option-item-full">
                  <label>الملخص</label>
                  <textarea 
                    className="input-textarea-inline" 
                    value={article.excerpt || ''} 
                    onChange={e => setArticle({ ...article, excerpt: e.target.value })} 
                    placeholder="ملخص مختصر للمقال..."
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Article Info */}
            <div className="publish-section">
              <h3 className="section-label">معلومات المقال</h3>
              <div className="options-grid">
                <div className="option-item">
                  <label>المعرف</label>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', padding: '0.5rem 0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    #{article.id}
                  </div>
                </div>
                <div className="option-item">
                  <label>الرمز (Slug)</label>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.813rem', padding: '0.5rem 0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', wordBreak: 'break-all' }}>
                    {article.slug}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// Protect this page - require authentication
export default withAuth(EditArticle);
