import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

/**
 * Wraps guest-only routes — redirects authenticated users away from sign-in/sign-up.
 * Honors location.state.from when present so post-login destinations are preserved.
 * Shows nothing while the auth state is still loading to avoid a flash of content.
 */
export default function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        className="theme-route-loader"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: '3px solid var(--color-fin-border)',
            borderTopColor: 'var(--color-fin-accent)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (user) {
    const from = location.state?.from;
    const destination =
      from && typeof from.pathname === 'string' ? from.pathname : '/dashboard';
    return <Navigate to={destination} replace />;
  }

  return children;
}
