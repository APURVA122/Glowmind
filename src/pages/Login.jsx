import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../auth/AuthLayout';
import GoogleLoginButton from '../auth/GoogleLoginButton';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setError(null);
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await login(form.email, form.password);
      if (result.success) {
        navigate('/app');
      } else {
        setError(result.error || result.errors?.[0]?.msg || 'Could not sign in. Check your details and try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back ✨"
      subtitle="Sign in to pick up your notes where you left off."
      footer={
        <>
          New to GlowMind? <Link to="/signup">Create an account</Link>
        </>
      }
    >
      <GoogleLoginButton onError={setError} />

      <div className="gm-divider">or sign in with email</div>

      {error && <div className="gm-error-banner">{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="gm-field">
          <label htmlFor="login-email">Email</label>
          <div className="gm-input-wrap">
            <span className="gm-input-wrap__icon" aria-hidden="true">📧</span>
            <input
              id="login-email"
              name="email"
              type="email"
              className="gm-input"
              placeholder="you@example.com"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="gm-field">
          <label htmlFor="login-password">Password</label>
          <div className="gm-input-wrap">
            <span className="gm-input-wrap__icon" aria-hidden="true">🔒</span>
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className="gm-input"
              placeholder="••••••••"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="gm-input-wrap__toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button type="submit" className="gm-btn gm-btn--primary" disabled={isSubmitting} style={{ marginTop: 4 }}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  );
}
