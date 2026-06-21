import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { cleanArticles } from '../../lib/cleanApiResponse';
import AdminLayout from '../../components/AdminLayout';
import { withAuth } from '../../lib/withAuth';

function ArticlesPage({ user }: { user: any }) {
  const router = useRouter();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/articles');
    if (!res.ok) {
      setLoading(false);
      return;
    }
    const j = await res.json();
    setArticles(cleanArticles(j));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const createDraft = () => {
    // Redirect to new article page instead of creating empty draft
    router.push('/admin/articles/new');
  };

  const togglePublish = async (id: number, publish: boolean) => {
    setBusyId(id);
    const payload: any = publish 
      ? { status: 'PUBLISHED', publishedAt: new Date().toISOString() } 
      : { status: 'DRAFT', publishedAt: null };
    const res = await fetch(`/api/articles/${id}`, { 
      method: 'PATCH', 
      headers: { 'Content-Type':'application/json' }, 
      body: JSON.stringify(payload) 
    });
    setBusyId(null);
    if (res.ok) await load();
    else alert('فشل التحديث');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">الأخبار</h1>
            <p className="page-subtitle">إدارة ونشر الأخبار على الموقع</p>
          </div>
          <div className="flex gap-2">
            <button 
              className="btn-secondary" 
              onClick={() => router.push('/admin')}
            >
              العودة للرئيسية
            </button>
            <button className="add-btn" onClick={createDraft}>
              <span style={{ fontSize: '1.125rem' }}>+</span>
              إضافة خبر
            </button>
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="card text-center" style={{ padding: 'var(--spacing-xl)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📰</div>
            <h3 className="text-lg font-bold mb-2">لا توجد أخبار بعد</h3>
            <p className="muted mb-4">ابدأ بإنشاء أول خبر لك</p>
            <button className="btn-primary" onClick={createDraft}>
              إنشاء خبر جديد
            </button>
          </div>
        ) : (
          <div className="list-table">
            {articles.map(a => (
              <div key={a.id} className="list-row">
                <img 
                  src={a.image || '/placeholder.png'} 
                  alt={a.title} 
                  className="list-thumb" 
                />
                <div className="list-content">
                  <Link href={`/admin/articles/${a.id}/edit`}>
                    <div className="list-title">{a.title}</div>
                  </Link>
                  <div className="list-subtitle">
                    {a.categoryName || 'بدون قسم'} • {a.status === 'PUBLISHED' ? (
                      <span className="badge badge-success">منشور</span>
                    ) : (
                      <span className="badge badge-warning">مسودة</span>
                    )}
                  </div>
                </div>
                <div className="list-actions">
                  <Link href={`/admin/articles/${a.id}/edit`}>
                    <button className="btn-ghost">تحرير</button>
                  </Link>
                  {a.status === 'PUBLISHED' ? (
                    <button 
                      disabled={busyId === a.id} 
                      className="btn-secondary" 
                      onClick={() => togglePublish(a.id, false)}
                    >
                      {busyId === a.id ? 'جاري...' : 'إلغاء النشر'}
                    </button>
                  ) : (
                    <button 
                      disabled={busyId === a.id} 
                      className="btn-primary" 
                      onClick={() => togglePublish(a.id, true)}
                    >
                      {busyId === a.id ? 'جاري...' : 'نشر'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

// Protect this page - require authentication
export default withAuth(ArticlesPage);
