import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components_backend/AdminLayout';
import { withAuth } from '../../../lib/withAuth';

function UsersPage({ user }: { user: any }) {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', name: '', password: '', role: 'EDITOR' });
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState('');
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const res = await fetch('/api/users');
    if (!res.ok) return;
    const j = await res.json();
    setUsers(j);
    setLoading(false);
  };

  const handleAddUser = async (e: any) => {
    e.preventDefault();
    if (!newUser.email || !newUser.password) return alert('البريد الإلكتروني وكلمة المرور مطلوبان');
    
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });
    
    if (res.ok) {
      setNewUser({ email: '', name: '', password: '', role: 'EDITOR' });
      setShowAddForm(false);
      loadUsers();
      alert('تم إضافة المستخدم بنجاح');
    } else {
      alert('فشل إضافة المستخدم');
    }
  };

  const handleChangePassword = async (e: any) => {
    e.preventDefault();
    if (!editingUser || !newPassword) return alert('كلمة المرور مطلوبة');
    
    const res = await fetch(`/api/users/${editingUser.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: newPassword })
    });
    
    if (res.ok) {
      setEditingUser(null);
      setNewPassword('');
      alert('تم تغيير كلمة المرور بنجاح');
    } else {
      alert('فشل تغيير كلمة المرور');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.')) {
      return;
    }
    
    const res = await fetch(`/api/users/${userId}`, {
      method: 'DELETE'
    });
    
    if (res.ok) {
      loadUsers();
      alert('تم حذف المستخدم بنجاح');
    } else {
      alert('فشل حذف المستخدم');
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
            <h1 className="page-title">المستخدمون</h1>
            <p className="page-subtitle">إدارة مستخدمي النظام</p>
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
              <span style={{ fontSize: '1.125rem' }}>+</span>
              إضافة مستخدم
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="card mb-4">
            <h3 className="font-bold mb-4">إضافة مستخدم جديد</h3>
            <form onSubmit={handleAddUser}>
              <div className="grid-2 mb-4">
                <div>
                  <label>البريد الإلكتروني</label>
                  <input 
                    className="form-input" 
                    type="email"
                    value={newUser.email}
                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="user@example.com"
                    required
                  />
                </div>
                <div>
                  <label>الاسم (اختياري)</label>
                  <input 
                    className="form-input" 
                    value={newUser.name}
                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="اسم المستخدم"
                  />
                </div>
              </div>
              <div className="grid-2 mb-4">
                <div>
                  <label>كلمة المرور</label>
                  <input 
                    className="form-input" 
                    type="password"
                    value={newUser.password}
                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div>
                  <label>الدور</label>
                  <select 
                    className="form-select"
                    value={newUser.role}
                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option value="EDITOR">محرر</option>
                    <option value="ADMIN">مدير</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">حفظ</button>
                <button 
                  type="button" 
                  className="btn-ghost" 
                  onClick={() => setShowAddForm(false)}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        {users.length === 0 ? (
          <div className="card text-center" style={{ padding: 'var(--spacing-xl)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>👥</div>
            <h3 className="text-lg font-bold mb-2">لا يوجد مستخدمون</h3>
            <p className="muted">لم يتم إنشاء أي مستخدمين بعد</p>
            <button 
              className="btn-primary mt-4" 
              onClick={() => setShowAddForm(true)}
            >
              إضافة أول مستخدم
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="card users-table-desktop">
              <table>
                <thead>
                  <tr>
                    <th>المعرف</th>
                    <th>البريد الإلكتروني</th>
                    <th>الاسم</th>
                    <th>الدور</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td className="font-semibold">{u.email}</td>
                      <td>{u.name || '—'}</td>
                      <td>
                        <span className={`badge ${u.role === 'ADMIN' ? 'badge-primary' : 'badge-success'}`}>
                          {u.role === 'ADMIN' ? 'مدير' : 'محرر'}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button 
                            className="btn-ghost btn-sm"
                            onClick={() => setEditingUser(u)}
                            title="تغيير كلمة المرور"
                          >
                            🔑 كلمة المرور
                          </button>
                          <button 
                            className="btn-ghost btn-sm"
                            onClick={() => handleDeleteUser(u.id)}
                            style={{ color: 'var(--error)' }}
                            title="حذف المستخدم"
                          >
                            🗑️ حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="users-cards-mobile">
              {users.map(u => (
                <div key={u.id} className="user-card-mobile">
                  <div className="user-card-header">
                    <div>
                      <div className="user-card-id">#{u.id}</div>
                      <div className="user-card-email">{u.email}</div>
                      {u.name && <div className="user-card-name">{u.name}</div>}
                    </div>
                    <span className={`badge ${u.role === 'ADMIN' ? 'badge-primary' : 'badge-success'}`}>
                      {u.role === 'ADMIN' ? 'مدير' : 'محرر'}
                    </span>
                  </div>
                  <div className="user-card-actions">
                    <button 
                      className="btn-ghost btn-sm user-action-btn"
                      onClick={() => setEditingUser(u)}
                    >
                      🔑 تغيير كلمة المرور
                    </button>
                    <button 
                      className="btn-ghost btn-sm user-action-btn"
                      onClick={() => handleDeleteUser(u.id)}
                      style={{ color: 'var(--error)' }}
                    >
                      🗑️ حذف المستخدم
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Change Password Modal */}
        {editingUser && (
          <div className="modal-overlay" onClick={() => setEditingUser(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>تغيير كلمة المرور</h3>
                <button 
                  className="modal-close" 
                  onClick={() => setEditingUser(null)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleChangePassword}>
                <div className="modal-body">
                  <p className="muted mb-4">
                    تغيير كلمة المرور للمستخدم: <strong>{editingUser.email}</strong>
                  </p>
                  <div>
                    <label>كلمة المرور الجديدة</label>
                    <input 
                      type="password"
                      className="form-input"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                    <small className="help-text">يجب أن تكون 6 أحرف على الأقل</small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-ghost" onClick={() => setEditingUser(null)}>
                    إلغاء
                  </button>
                  <button type="submit" className="btn-primary">
                    حفظ كلمة المرور
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

// Protect this page - only admins can access
export default withAuth(UsersPage, { requireAdmin: true });
