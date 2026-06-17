import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const submit = async (e: any) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const j = await res.json();
        setError(j.error || 'Login failed');
        return;
      }
      router.push('/admin');
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div style={{minHeight: '100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{width: 420,maxWidth:'95%'}} className="card" dir="rtl">
        <h1 className="text-2xl font-bold mb-4" style={{textAlign:'center'}}>لوحة التحكم</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="muted">اسم المستخدم</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="ادخل الايميل" className="form-input" />
          </div>
          <div>
            <label className="muted">كلمة المرور</label>
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="كلمة المرور" type="password" className="form-input" />
          </div>
          {error && <div style={{color:'#b91c1c',textAlign:'center'}}>{error}</div>}
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',marginTop:6}}>
            <button className="btn-primary" style={{width:'100%'}}>دخول</button>
          </div>
          <div className="muted" style={{textAlign:'center',marginTop:8}}>الافتراضي: admin@local / changeme</div>
        </form>
      </div>
    </div>
  );
}
