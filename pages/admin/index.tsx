import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '../../components_backend/AdminLayout';
import { withAuth } from '../../lib/withAuth';

interface DashboardStats {
  overview: {
    totalArticles: number;
    totalViews: number;
    avgViews: number;
    publishedArticles: number;
    draftArticles: number;
    reviewArticles: number;
    featuredArticles: number;
    breakingNews: number;
    recentArticles: number;
    recentPublished: number;
  };
  topArticles: Array<{
    id: number;
    title: string;
    slug: string;
    views: number;
    category: string;
    publishedAt: string;
  }>;
  trendingArticles: Array<{
    id: number;
    title: string;
    slug: string;
    views: number;
    publishedAt: string;
  }>;
  categoryStats: Array<{
    category: string;
    count: number;
    views: number;
    avgViews: number;
  }>;
  statusCounts: {
    published: number;
    draft: number;
    review: number;
  };
  dailyStats: Array<{
    date: string;
    articles: number;
    views: number;
  }>;
}

function AdminIndex({ user: authUser }: { user: any }) {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [basicStats, setBasicStats] = useState({ categories: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [statsRes, categoriesRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/categories'),
        fetch('/api/users')
      ]);
      
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      
      const categories = categoriesRes.ok ? await categoriesRes.json() : [];
      const users = usersRes.ok ? await usersRes.json() : [];
      
      setBasicStats({
        categories: Array.isArray(categories) ? categories.length : 0,
        users: Array.isArray(users) ? users.length : 0
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <AdminLayout user={authUser}>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </AdminLayout>
    );
  }

  const formatNumber = (num: number) => num.toLocaleString();
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <AdminLayout user={authUser}>
      {/* Welcome Section */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome, {authUser.name || authUser.email}! 👋</h2>
            <p className="muted">Content Management System Overview</p>
          </div>
          <div className="badge badge-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
            {authUser.role === 'ADMIN' ? 'Admin' : 'Editor'}
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid-4 mb-6">
        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <div className="dashboard-card-icon" style={{ fontSize: '2.5rem' }}>👁️</div>
          <div className="dashboard-card-value">{stats ? formatNumber(stats.overview.totalViews) : '0'}</div>
          <div className="dashboard-card-label" style={{ color: 'rgba(255,255,255,0.9)' }}>Total Views</div>
        </div>

        <Link href="/admin/articles">
          <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <div className="dashboard-card-icon" style={{ fontSize: '2.5rem' }}>📰</div>
            <div className="dashboard-card-value">{stats ? stats.overview.totalArticles : '0'}</div>
            <div className="dashboard-card-label" style={{ color: 'rgba(255,255,255,0.9)' }}>Total Articles</div>
          </div>
        </Link>
        
        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
          <div className="dashboard-card-icon" style={{ fontSize: '2.5rem' }}>📊</div>
          <div className="dashboard-card-value">{stats ? formatNumber(stats.overview.avgViews) : '0'}</div>
          <div className="dashboard-card-label" style={{ color: 'rgba(255,255,255,0.9)' }}>Avg Views/Article</div>
        </div>

        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
          <div className="dashboard-card-icon" style={{ fontSize: '2.5rem' }}>🚀</div>
          <div className="dashboard-card-value">{stats ? stats.overview.recentPublished : '0'}</div>
          <div className="dashboard-card-label" style={{ color: 'rgba(255,255,255,0.9)' }}>Published (30d)</div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid-3 mb-6">
        <Link href="/admin/articles">
          <div className="dashboard-card">
            <div className="dashboard-card-icon">✅</div>
            <div className="dashboard-card-value">{stats ? stats.overview.publishedArticles : '0'}</div>
            <div className="dashboard-card-label">Published</div>
          </div>
        </Link>

        <Link href="/admin/articles">
          <div className="dashboard-card">
            <div className="dashboard-card-icon">📝</div>
            <div className="dashboard-card-value">{stats ? stats.overview.draftArticles : '0'}</div>
            <div className="dashboard-card-label">Drafts</div>
          </div>
        </Link>

        <Link href="/admin/articles">
          <div className="dashboard-card">
            <div className="dashboard-card-icon">⭐</div>
            <div className="dashboard-card-value">{stats ? stats.overview.featuredArticles : '0'}</div>
            <div className="dashboard-card-label">Featured</div>
          </div>
        </Link>
      </div>

      {/* Top Performing Articles & Category Stats */}
      <div className="grid-2 mb-6">
        {/* Top Articles */}
        <div className="card">
          <h3 className="text-xl font-bold mb-4">🏆 Top Performing Articles</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {stats && stats.topArticles.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                {stats.topArticles.map((article, index) => (
                  <Link href={`/admin/articles/${article.id}/edit`} key={article.id}>
                    <div style={{
                      padding: 'var(--spacing-md)',
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                      border: '1px solid var(--border-color)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--accent-light)';
                      e.currentTarget.style.transform = 'translateX(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--bg-secondary)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)' }}>
                        <div style={{
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          color: index < 3 ? 'var(--accent-primary)' : 'var(--text-muted)',
                          minWidth: '2rem'
                        }}>
                          #{index + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="font-bold" style={{ marginBottom: '0.25rem', fontSize: '0.938rem' }}>
                            {article.title}
                          </div>
                          <div style={{ display: 'flex', gap: 'var(--spacing-md)', fontSize: '0.813rem' }} className="muted">
                            <span>👁️ {formatNumber(article.views)} views</span>
                            <span>•</span>
                            <span>📁 {article.category}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="muted text-center" style={{ padding: 'var(--spacing-2xl)' }}>
                No articles yet
              </div>
            )}
          </div>
        </div>

        {/* Category Performance */}
        <div className="card">
          <h3 className="text-xl font-bold mb-4">📊 Category Performance</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {stats && stats.categoryStats.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                {stats.categoryStats.map((cat) => (
                  <div key={cat.category} style={{
                    padding: 'var(--spacing-md)',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div className="font-bold">{cat.category}</div>
                      <div className="badge badge-primary">{cat.count} articles</div>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-lg)', fontSize: '0.813rem' }} className="muted">
                      <span>👁️ {formatNumber(cat.views)} total views</span>
                      <span>•</span>
                      <span>📈 {formatNumber(cat.avgViews)} avg views</span>
                    </div>
                    {/* Simple progress bar */}
                    <div style={{
                      marginTop: '0.5rem',
                      height: '4px',
                      background: 'var(--bg-primary)',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        background: 'var(--accent-primary)',
                        width: `${Math.min(100, (cat.views / (stats.overview.totalViews || 1)) * 100)}%`,
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="muted text-center" style={{ padding: 'var(--spacing-2xl)' }}>
                No category data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trending & Daily Activity */}
      <div className="grid-2 mb-6">
        {/* Trending This Week */}
        <div className="card">
          <h3 className="text-xl font-bold mb-4">🔥 Trending This Week</h3>
          {stats && stats.trendingArticles.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              {stats.trendingArticles.map((article) => (
                <Link href={`/admin/articles/${article.id}/edit`} key={article.id}>
                  <div style={{
                    padding: 'var(--spacing-md)',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    border: '1px solid var(--border-color)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--accent-light)';
                    e.currentTarget.style.transform = 'translateX(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg-secondary)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                  >
                    <div className="font-bold" style={{ marginBottom: '0.25rem' }}>
                      {article.title}
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', fontSize: '0.813rem' }} className="muted">
                      <span>👁️ {formatNumber(article.views)} views</span>
                      <span>•</span>
                      <span>📅 {article.publishedAt ? formatDate(article.publishedAt) : 'N/A'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="muted text-center" style={{ padding: 'var(--spacing-2xl)' }}>
              No trending articles this week
            </div>
          )}
        </div>

        {/* Daily Activity (Last 7 Days) */}
        <div className="card">
          <h3 className="text-xl font-bold mb-4">📅 Daily Activity (Last 7 Days)</h3>
          {stats && stats.dailyStats.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              {stats.dailyStats.map((day) => (
                <div key={day.date} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--spacing-md)',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                }}>
                  <div>
                    <div className="font-bold">{formatDate(day.date)}</div>
                    <div className="muted text-sm">{day.articles} articles published</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="font-bold" style={{ color: 'var(--accent-primary)', fontSize: '1.125rem' }}>
                      {formatNumber(day.views)}
                    </div>
                    <div className="muted text-sm">views</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="muted text-center" style={{ padding: 'var(--spacing-2xl)' }}>
              No activity data available
            </div>
          )}
        </div>
      </div>
      <div className="card">
        <h3 className="text-xl font-bold mb-4">⚡ Quick Actions</h3>
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
                <div className="font-bold" style={{ color: 'var(--accent-primary)' }}>Create New Article</div>
                <div className="muted text-sm">Add new content to the site</div>
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
                <div className="font-bold">Manage Articles</div>
                <div className="muted text-sm">Edit and publish articles</div>
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
                <div className="font-bold">Manage Categories</div>
                <div className="muted text-sm">Organize content by categories</div>
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
                <div className="font-bold">View Live Site</div>
                <div className="muted text-sm">See the published website</div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </AdminLayout>
  );
}

// Protect this page - require authentication
export default withAuth(AdminIndex);
