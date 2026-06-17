import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/AdminLayout';

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', name: '', password: '', role: 'EDITOR' });

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
          <div className="card">
            <table>
              <thead>
                <tr>
                  <th>المعرف</th>
                  <th>البريد الإلكتروني</th>
                  <th>الاسم</th>
                  <th>الدور</th>
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
