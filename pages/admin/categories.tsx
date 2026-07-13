import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components_backend/AdminLayout';
import { withAuth } from '../../lib/withAuth';

function CategoriesPage({ user }: { user: any }) {
  const router = useRouter();
  const [cats, setCats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '' });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const res = await fetch('/api/admin/categories');
    if (!res.ok) return;
    const j = await res.json();
    setCats(j);
    setLoading(false);
  };

  const handleAddCategory = async (e: any) => {
    e.preventDefault();
    if (!newCategory.name) return alert('الاسم مطلوب');
    
    const slug = newCategory.slug || newCategory.name.toLowerCase().replace(/\s+/g, '-');
    
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newCategory, slug })
    });
    
    if (res.ok) {
      setNewCategory({ name: '', slug: '' });
      setShowAddForm(false);
      loadCategories();
      alert('تم إضافة التصنيف بنجاح');
    } else {
      alert('فشل إضافة التصنيف');
    }
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

  return (
    <AdminLayout user={user}>
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">التصنيفات</h1>
            <p className="page-subtitle">إدارة تصنيفات المحتوى</p>
          </div>
          <div className="flex gap-2">
            <button 
              className="btn-secondary" 
              onClick={() => router.push('/admin')}
            >
              العودة للرئيسية
            </button>
            <button 
              className="add-btn" 
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <span style={{ fontSize: '1.25rem' }}>+</span>
              إضافة تصنيف
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="card mb-4">
            <h3 className="font-bold mb-4">إضافة تصنيف جديد</h3>
            <form onSubmit={handleAddCategory} className="flex gap-4 items-end">
              <div style={{ flex: 1 }}>
                <label>اسم التصنيف</label>
                <input 
                  className="form-input" 
                  value={newCategory.name}
                  onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="مثال: سياسة، رياضة، اقتصاد"
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>الرمز (اختياري)</label>
                <input 
                  className="form-input" 
                  value={newCategory.slug}
                  onChange={e => setNewCategory({ ...newCategory, slug: e.target.value })}
                  placeholder="يتم إنشاؤه تلقائياً"
                />
              </div>
              <button type="submit" className="btn-primary">حفظ</button>
              <button 
                type="button" 
                className="btn-ghost" 
                onClick={() => setShowAddForm(false)}
              >
                إلغاء
              </button>
            </form>
          </div>
        )}

        {cats.length === 0 ? (
          <div className="card text-center" style={{ padding: 'var(--spacing-2xl)' }}>
            <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-lg)' }}>📁</div>
            <h3 className="text-xl font-bold mb-2">لا توجد تصنيفات</h3>
            <p className="muted">لم يتم إنشاء أي تصنيفات بعد</p>
            <button 
              className="btn-primary mt-4" 
              onClick={() => setShowAddForm(true)}
            >
              إضافة أول تصنيف
            </button>
          </div>
        ) : (
          <div className="card">
            <table>
              <thead>
                <tr>
                  <th>المعرف</th>
                  <th>الاسم</th>
                  <th>الرمز</th>
                </tr>
              </thead>
              <tbody>
                {cats.map(c => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td className="font-semibold">{c.name}</td>
                    <td className="muted">{c.slug}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

// Protect this page - require authentication
export default withAuth(CategoriesPage);
