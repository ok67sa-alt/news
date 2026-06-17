import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '../../components/AdminLayout';

export default function AdminIndex() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ articles: 0, categories: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/auth/me');
      const j = await res.json();
      if (!j.user) {
        router.push('/admin/login');
        return;
      }
      setUser(j.user);
      
      // Load stats
      try {
        const [articlesRes, categoriesRes, usersRes] = await Promise.all([
          fetch('/api/articles'),
          fetch('/api/categories'),
          fetch('/api/users')
        ]);
        
        const articles = articlesRes.ok ? await articlesRes.json() : [];
        const categories = categoriesRes.ok ? await categoriesRes.json() : [];
        const users = usersRes.ok ? await usersRes.json() : [];
        
        setStats({
          articles: Array.isArray(articles) ? articles.length : 0,
          categories: Array.isArray(categories) ? categories.length : 0,
          users: Array.isArray(users) ? users.length : 0
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
        setStats({ articles: 0, categories: 0, users: 0 });
      }
      
      setLoading(false);
    })();
  }, []);

  if (!user || loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <AdminLayout user={user}>
      {/* Welcome Section */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">مرحباً بك، {user.name || user.email}! 👋</h2>
            <p className="muted">نظرة عامة على نظام إدارة المحتوى الخاص بك</p>
          </div>
          <div className="badge badge-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
            {user.role === 'ADMIN' ? 'مدير' : 'محرر'}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid-3 mb-6">
        <Link href="/admin/articles">
          <div className="dashboard-card">
            <div className="dashboard-card-icon">📰</div>
            <div className="dashboard-card-value">{stats.articles}</div>
            <div className="dashboard-card-label">الأخبار</div>
          </div>
        </Link>
        
        <Link href="/admin/categories">
          <div className="dashboard-card">
            <div className="dashboard-card-icon">📁</div>
            <div className="dashboard-card-value">{stats.categories}</div>
            <div className="dashboard-card-label">التصنيفات</div>
          </div>
        </Link>
        
        <Link href="/admin/users">
          <div className="dashboard-card">
            <div className="dashboard-card-icon">👥</div>
            <div className="dashboard-card-value">{stats.users}</div>
            <div className="dashboard-card-label">المستخدمون</div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">روابط سريعة</h3>
        <div className="grid-2">
          <Link href="/admin/articles/new">
            <div style={{
              padding: 'var(--spacing-lg)',
              background: 'var(--accent-light)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
              transition: 'all var(--transition-fast)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
            >
              <span style={{ fontSize: '2rem' }}>✍️</span>
              <div>
                <div className="font-bold" style={{ color: 'var(--accent-primary)' }}>إنشاء خبر جديد</div>
                <div className="muted text-sm">أضف محتوى جديد إلى الموقع</div>
              </div>
            </div>
          </Link>
          
          <Link href="/admin/articles">
            <div style={{
              padding: 'var(--spacing-lg)',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
              transition: 'all var(--transition-fast)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
            >
              <span style={{ fontSize: '2rem' }}>📝</span>
              <div>
                <div className="font-bold">إدارة الأخبار</div>
                <div className="muted text-sm">تحرير ونشر الأخبار الموجودة</div>
              </div>
            </div>
          </Link>
          
          <Link href="/admin/categories">
            <div style={{
              padding: 'var(--spacing-lg)',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
              transition: 'all var(--transition-fast)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
            >
              <span style={{ fontSize: '2rem' }}>🗂️</span>
              <div>
                <div className="font-bold">إدارة التصنيفات</div>
                <div className="muted text-sm">تنظيم المحتوى حسب الفئات</div>
              </div>
            </div>
          </Link>
          
          <a href="/" target="_blank" rel="noopener noreferrer">
            <div style={{
              padding: 'var(--spacing-lg)',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
              transition: 'all var(--transition-fast)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
            >
              <span style={{ fontSize: '2rem' }}>🌐</span>
              <div>
                <div className="font-bold">عرض الموقع</div>
                <div className="muted text-sm">شاهد الموقع الإلكتروني المباشر</div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </AdminLayout>
  );
}
