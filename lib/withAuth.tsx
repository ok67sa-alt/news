import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface AuthUser {
  id: number;
  email: string;
  name: string | null;
  role: string;
}

/**
 * Higher-Order Component (HOC) to protect admin pages
 * Redirects to /admin/login if user is not authenticated
 */
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P & { user: AuthUser }>,
  options: { requireAdmin?: boolean } = {}
) {
  return function AuthComponent(props: P) {
    const router = useRouter();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      checkAuth();
    }, []);

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include', // Important: send cookies
        });

        const data = await res.json();

        // If response indicates session expired or no user
        if (!res.ok || !data.user) {
          console.log('Session expired or not authenticated');
          router.replace('/admin/login');
          return;
        }
        
        // Check if admin role is required
        if (options.requireAdmin && data.user.role !== 'ADMIN') {
          console.log('Admin role required but user is not admin');
          router.replace('/admin');
          return;
        }

        setUser(data.user);
        setLoading(false);
      } catch (err) {
        console.error('Auth check failed:', err);
        router.replace('/admin/login');
      }
    };

    // Show loading spinner while checking auth
    if (loading) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#f8fafc'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #c8102e',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      );
    }

    // User is authenticated - render the protected page
    if (!user) {
      return null; // Will redirect
    }

    return <WrappedComponent {...props} user={user} />;
  };
}
