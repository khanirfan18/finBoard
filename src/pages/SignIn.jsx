import * as React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import ForgotPassword from './ForgotPassword';
import { Eye, EyeOff, Mail, Lock, LogIn, Loader2 } from 'lucide-react';

export default function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState('');
  const [authSuccess, setAuthSuccess] = React.useState('');
  const [forgotOpen, setForgotOpen] = React.useState(false);
  const [needsResend, setNeedsResend] = React.useState(false);
  const [socialLoading, setSocialLoading] = React.useState(null);

  /* ── Validation ────────────────────────────────────────────────── */
  const validate = () => {
    let valid = true;
    setEmailError('');
    setPasswordError('');

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }
    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      valid = false;
    }
    return valid;
  };

  /* ── Social Auth ───────────────────────────────────────────────── */
  const handleSocialAuth = async (provider) => {
    setAuthError('');
    setAuthSuccess('');
    setSocialLoading(provider);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (error) {
      setAuthError(`Failed to sign in with ${provider}. Please try again.`);
      setSocialLoading(null);
    }
  };

  /* ── Submit ────────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setNeedsResend(false);
    if (!validate()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        if (error.message.includes('rate limit') || error.message.includes('too many requests')) {
           setAuthError('You are doing that too often. Please wait a moment and try again.');
           return;
        }

        if (error.message === 'Email not confirmed') {
           setAuthError('Please verify your email before signing in.');
           setNeedsResend(true);
           return;
        }

        const friendly = {
          'Invalid login credentials': 'Incorrect email or password.',
          'Invalid email or password': 'Incorrect email or password.',
        };
        setAuthError(friendly[error.message] || error.message);
        return;
      }
      if (data?.user) {
        setAuthSuccess('Signed in! Redirecting…');
        setTimeout(() => navigate('/dashboard'), 600);
      }
    } catch {
      setAuthError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setAuthError('');
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email });
      if (error) {
        if (error.message.includes('rate limit') || error.message.includes('too many requests')) {
           setAuthError('You are doing that too often. Please wait a moment and try again.');
        } else {
           setAuthError(error.message);
        }
      } else {
        setAuthSuccess('Verification email sent! Please check your inbox.');
        setNeedsResend(false);
      }
    } catch {
      setAuthError('An unexpected error occurred while resending.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Decorative background elements */}
      <div className="auth-bg-glow auth-bg-glow--top" />
      <div className="auth-bg-glow auth-bg-glow--bottom" />

      <div className="auth-card animate-in">
        {/* Header */}
        <div className="auth-header">
          <span className="auth-logo">FINBOARD</span>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your account to continue</p>
        </div>

        {/* Alerts */}
        {authError && (
          <div className="auth-alert auth-alert--error" id="signin-error-alert">
            <span>⚠</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
              <span>{authError}</span>
              {needsResend && (
                <button 
                  type="button"
                  onClick={handleResend} 
                  disabled={loading}
                  style={{ textDecoration: 'underline', cursor: loading ? 'not-allowed' : 'pointer', background: 'none', border: 'none', color: 'inherit', padding: 0, textAlign: 'left', fontSize: '0.85em', opacity: 0.9 }}
                >
                  Resend verification email
                </button>
              )}
            </div>
            <button onClick={() => setAuthError('')} className="auth-alert-close">✕</button>
          </div>
        )}
        {authSuccess && (
          <div className="auth-alert auth-alert--success" id="signin-success-alert">
            <span>✓</span>
            <span>{authSuccess}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="auth-form">
          {/* Email */}
          <div className="auth-field">
            <label htmlFor="signin-email" className="auth-label">Email</label>
            <div className={`auth-input-wrap ${emailError ? 'auth-input-wrap--error' : ''}`}>
              <Mail size={16} className="auth-input-icon" />
              <input
                id="signin-email"
                type="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="auth-input"
              />
            </div>
            {emailError && <span className="auth-field-error">{emailError}</span>}
          </div>

          {/* Password */}
          <div className="auth-field">
            <div className="auth-label-row">
              <label htmlFor="signin-password" className="auth-label">Password</label>
              <button
                type="button"
                onClick={() => setForgotOpen(true)}
                className="auth-link-btn"
              >
                Forgot password?
              </button>
            </div>
            <div className={`auth-input-wrap ${passwordError ? 'auth-input-wrap--error' : ''}`}>
              <Lock size={16} className="auth-input-icon" />
              <input
                id="signin-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="auth-submit-btn"
            id="signin-submit-btn"
          >
            {loading ? (
              <Loader2 size={18} className="auth-spinner" />
            ) : (
              <LogIn size={18} />
            )}
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <ForgotPassword open={forgotOpen} handleClose={() => setForgotOpen(false)} />

        {/* Divider */}
        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        {/* Social */}
        <div className="auth-social-row">
          <button
            type="button"
            onClick={() => handleSocialAuth('google')}
            disabled={loading || socialLoading !== null}
            className="auth-social-btn"
          >
            {socialLoading === 'google' ? (
              <Loader2 size={18} className="auth-spinner" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
            )}
            Google
          </button>
          <button
            type="button"
            onClick={() => handleSocialAuth('facebook')}
            disabled={loading || socialLoading !== null}
            className="auth-social-btn"
          >
            {socialLoading === 'facebook' ? (
              <Loader2 size={18} className="auth-spinner" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            )}
            Facebook
          </button>
        </div>

        {/* Footer */}
        <p className="auth-footer-text">
          Don't have an account?{' '}
          <RouterLink to="/signup" className="auth-link">Sign up</RouterLink>
        </p>
      </div>
    </div>
  );
}