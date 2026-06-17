import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function IconDashboard() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zM13 21h8v-10h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/></svg>;
}
function IconFile() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" fill="currentColor"/></svg>;
}
function IconCategory() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z" fill="currentColor"/></svg>;
}
function IconUsers() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zM8 13c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05C16.54 13.43 18 14.65 18 16v3h6v-2.5c0-2.33-4.67-3.5-6-3.5z" fill="currentColor"/></svg>;
}
function IconWeb() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor"/></svg>;
}
function IconLogout() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor"/></svg>;
}

export default function AdminLayout({ children, user }: { children: React.ReactNode; user?: any }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const path = router.pathname;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [path]);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  if (!mounted) return null;

  return (
    <div className="admin-shell" dir="rtl">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo-section">
            <div className="admin-logo">
              <span className="admin-logo-icon">📰</span>
              <div>
                <h2 className="admin-logo-title">Sudan News Today</h2>
                <span className="admin-logo-subtitle">لوحة التحكم</span>
              </div>
            </div>
          </div>
          <button 
            className="admin-sidebar-close" 
            onClick={() => setSidebarOpen(false)}
            aria-label="إغلاق القائمة"
          >
            ×
          </button>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-section">
            <span className="admin-nav-label">القائمة الرئيسية</span>
            <Link 
              href="/admin" 
              className={`admin-nav-link ${path === '/admin' ? 'active' : ''}`}
            >
              <IconDashboard />
              <span>الرئيسية</span>
            </Link>
            <Link 
              href="/admin/articles" 
              className={`admin-nav-link ${path.startsWith('/admin/articles') ? 'active' : ''}`}
            >
              <IconFile />
              <span>الأخبار</span>
              {path.startsWith('/admin/articles') && <span className="admin-nav-badge">نشط</span>}
            </Link>
            <Link 
              href="/admin/categories" 
              className={`admin-nav-link ${path.startsWith('/admin/categories') ? 'active' : ''}`}
            >
              <IconCategory />
              <span>التصنيفات</span>
            </Link>
            <Link 
              href="/admin/users" 
              className={`admin-nav-link ${path.startsWith('/admin/users') ? 'active' : ''}`}
            >
              <IconUsers />
              <span>المستخدمون</span>
            </Link>
          </div>

          <div className="admin-nav-section admin-nav-footer">
            <span className="admin-nav-label">إعدادات</span>
            <a href="/" target="_blank" rel="noopener noreferrer" className="admin-nav-link">
              <IconWeb />
              <span>عرض الموقع</span>
            </a>
            <a href="#" onClick={handleLogout} className="admin-nav-link admin-nav-link-danger">
              <IconLogout />
              <span>تسجيل الخروج</span>
            </a>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-content">
            <button 
              className="admin-menu-toggle" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="فتح القائمة"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div className="admin-header-title">
              <h1>لوحة التحكم</h1>
              <p className="admin-header-subtitle">إدارة محتوى Sudan News Today</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/admin" className="btn-ghost" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              🏠 الرئيسية
            </Link>
            <div className="admin-user-info">
              <div className="admin-user-avatar">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'A'}
              </div>
              <div className="admin-user-details">
                <span className="admin-user-name">{user?.name || user?.email || 'مستخدم'}</span>
                <span className="admin-user-role">{user?.role || 'محرر'}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}
