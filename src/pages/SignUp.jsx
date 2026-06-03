import * as React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Loader2 } from 'lucide-react';

export default function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [nameError, setNameError] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState('');
  const [authSuccess, setAuthSuccess] = React.useState('');
  const [needsResend, setNeedsResend] = React.useState(false);
  const [socialLoading, setSocialLoading] = React.useState(null);

  /* ── Password strength helper ──────────────────────────────────── */
  const getStrength = (pw) => {
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score; // 0-5
  };

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#eab308', '#22c55e', '#10b981'];
  const strength = getStrength(password);

  /* ── Validation ────────────────────────────────────────────────── */
  const validate = () => {
    let valid = true;
    setNameError('');
    setEmailError('');
    setPasswordError('');

    if (!name.trim()) {
      setNameError('Name is required.');
      valid = false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }
    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      valid = false;
    } else if (!/[A-Z]/.test(password)) {
      setPasswordError('Include at least one uppercase letter.');
      valid = false;
    } else if (!/[0-9]/.test(password)) {
      setPasswordError('Include at least one number.');
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
      setAuthError(`Failed to sign up with ${provider}. Please try again.`);
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });

      if (error) {
        if (error.message.includes('rate limit') || error.message.includes('too many requests')) {
           setAuthError('You are doing that too often. Please wait a moment and try again.');
           return;
        }

        const friendly = {
          'User already registered': 'An account with this email already exists.',
          'Password should be at least 6 characters': 'Password must be at least 6 characters.',
          'Unable to validate email address: invalid format': 'Please enter a valid email address.',
        };
        setAuthError(friendly[error.message] || error.message);
        return;
      }

      // Detect "soft duplicate" (user exists but unconfirmed)
      if (data?.user?.identities?.length === 0) {
        setAuthError('An account with this email already exists but is not verified.');
        setNeedsResend(true);
        return;
      }

      if (data?.session) {
        setAuthSuccess('Account created! Redirecting…');
        setTimeout(() => navigate('/dashboard'), 600);
      } else {
        setAuthSuccess('Account created! Check your email to verify before signing in.');
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
      <div className="auth-bg-glow auth-bg-glow--top" />
      <div className="auth-bg-glow auth-bg-glow--bottom" />

      <div className="auth-card animate-in">
        {/* Header */}
        <div className="auth-header">
          <span className="auth-logo">FINBOARD</span>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Start managing your finances today</p>
        </div>

        {/* Alerts */}
        {authError && (
          <div className="auth-alert auth-alert--error" id="signup-error-alert">
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
          <div className="auth-alert auth-alert--success" id="signup-success-alert">
            <span>✓</span>
            <span>{authSuccess}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="auth-form">
          {/* Name */}
          <div className="auth-field">
            <label htmlFor="signup-name" className="auth-label">Full name</label>
            <div className={`auth-input-wrap ${nameError ? 'auth-input-wrap--error' : ''}`}>
              <User size={16} className="auth-input-icon" />
              <input
                id="signup-name"
                type="text"
                placeholder="Jon Snow"
                autoComplete="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="auth-input"
              />
            </div>
            {nameError && <span className="auth-field-error">{nameError}</span>}
          </div>

          {/* Email */}
          <div className="auth-field">
            <label htmlFor="signup-email" className="auth-label">Email</label>
            <div className={`auth-input-wrap ${emailError ? 'auth-input-wrap--error' : ''}`}>
              <Mail size={16} className="auth-input-icon" />
              <input
                id="signup-email"
                type="email"
                placeholder="your@email.com"
                autoComplete="email"
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
            <label htmlFor="signup-password" className="auth-label">Password</label>
            <div className={`auth-input-wrap ${passwordError ? 'auth-input-wrap--error' : ''}`}>
              <Lock size={16} className="auth-input-icon" />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="new-password"
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

            {/* Strength meter */}
            {password.length > 0 && (
              <div className="auth-strength">
                <div className="auth-strength-bar">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="auth-strength-segment"
                      style={{
                        background: i <= strength ? strengthColor[strength] : '#222',
                      }}
                    />
                  ))}
                </div>
                <span className="auth-strength-label" style={{ color: strengthColor[strength] }}>
                  {strengthLabel[strength]}
                </span>
              </div>
            )}

            <span className="auth-hint">Min 6 chars, 1 uppercase, 1 number</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="auth-submit-btn"
            id="signup-submit-btn"
          >
            {loading ? (
              <Loader2 size={18} className="auth-spinner" />
            ) : (
              <UserPlus size={18} />
            )}
            {loading ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

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
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            )}
            Facebook
          </button>
        </div>

        {/* Footer */}
        <p className="auth-footer-text">
          Already have an account?{' '}
          <RouterLink to="/signin" className="auth-link">Sign in</RouterLink>
        </p>
      </div>
    </div>
  );
}