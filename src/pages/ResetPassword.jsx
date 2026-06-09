import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/useAuth';
import { Eye, EyeOff, Lock, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  
  const [passwordError, setPasswordError] = React.useState('');
  const [confirmPasswordError, setConfirmPasswordError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState('');
  const [authSuccess, setAuthSuccess] = React.useState('');

  React.useEffect(() => {
    if (!authLoading && !user) {
      setAuthError('No active recovery session found. Please request a new password reset link from the sign-in page.');
    }
  }, [user, authLoading]);

  /* ── Validation ────────────────────────────────────────────────── */
  const validate = () => {
    let valid = true;
    setPasswordError('');
    setConfirmPasswordError('');

    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      valid = false;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      valid = false;
    }
    return valid;
  };

  /* ── Submit ────────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    if (!validate()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      if (data?.user) {
        setAuthSuccess('Password updated successfully! Redirecting to dashboard…');
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch {
      setAuthError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'var(--color-fin-bg)',
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

  return (
    <div className="auth-page">
      {/* Decorative background elements */}
      <div className="auth-bg-glow auth-bg-glow--top" />
      <div className="auth-bg-glow auth-bg-glow--bottom" />

      <div className="auth-card animate-in">
        {/* Header */}
        <div className="auth-header">
          <span className="auth-logo">FINBOARD</span>
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">Enter your new secure password to restore access</p>
        </div>

        {/* Alerts */}
        {authError && (
          <div className="auth-alert auth-alert--error" id="reset-error-alert">
            <AlertTriangle size={18} />
            <span>{authError}</span>
            <button onClick={() => setAuthError('')} className="auth-alert-close">✕</button>
          </div>
        )}
        {authSuccess && (
          <div className="auth-alert auth-alert--success" id="reset-success-alert">
            <CheckCircle2 size={18} />
            <span>{authSuccess}</span>
          </div>
        )}

        {/* Form */}
        {user && (
          <form onSubmit={handleSubmit} noValidate className="auth-form">
            {/* Password */}
            <div className="auth-field">
              <label htmlFor="reset-password" className="auth-label">New Password</label>
              <div className={`auth-input-wrap ${passwordError ? 'auth-input-wrap--error' : ''}`}>
                <Lock size={16} className="auth-input-icon" />
                <input
                  id="reset-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || !!authSuccess}
                  className="auth-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-toggle-pw"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordError && <span className="auth-field-error">{passwordError}</span>}
            </div>

            {/* Confirm Password */}
            <div className="auth-field">
              <label htmlFor="reset-password-confirm" className="auth-label">Confirm New Password</label>
              <div className={`auth-input-wrap ${confirmPasswordError ? 'auth-input-wrap--error' : ''}`}>
                <Lock size={16} className="auth-input-icon" />
                <input
                  id="reset-password-confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading || !!authSuccess}
                  className="auth-input"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="auth-toggle-pw"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPasswordError && <span className="auth-field-error">{confirmPasswordError}</span>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !!authSuccess}
              className="auth-submit-btn"
              id="reset-submit-btn"
            >
              {loading ? (
                <Loader2 size={18} className="auth-spinner" />
              ) : (
                <CheckCircle2 size={18} />
              )}
              {loading ? 'Updating password…' : 'Update password'}
            </button>
          </form>
        )}

        {/* Footer */}
        <p className="auth-footer-text">
          Back to{' '}
          <button 
            type="button" 
            onClick={() => navigate('/signin')} 
            className="auth-link-btn"
            style={{ fontSize: 'inherit', fontWeight: 'bold' }}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
