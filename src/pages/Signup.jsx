import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../auth/AuthLayout';
import GoogleLoginButton from '../auth/GoogleLoginButton';
import { useAuth } from '../auth/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
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

    if (form.password.length < 5) {
      setError('Password must be at least 5 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register(form.name, form.email, form.password);
      if (result.success) {
        navigate('/app');
      } else {
        setError(result.error || result.errors?.[0]?.msg || 'Could not create your account. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your notebook 🌸"
      subtitle="A pastel space for notes, on any site you visit."
      footer={
        <>
          Already have an account? <Link to="/login">Sign in</Link>
        </>
      }
    >
      <GoogleLoginButton label="Sign up with Google" onError={setError} />

      <div className="gm-divider">or sign up with email</div>

      {error && <div className="gm-error-banner">{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="gm-field">
          <label htmlFor="signup-name">Name</label>
          <div className="gm-input-wrap">
            <span className="gm-input-wrap__icon" aria-hidden="true">💖</span>
            <input
              id="signup-name"
              name="name"
              type="text"
              className="gm-input"
              placeholder="Your name"
              autoComplete="name"
              required
              minLength={3}
              value={form.name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="gm-field">
          <label htmlFor="signup-email">Email</label>
          <div className="gm-input-wrap">
            <span className="gm-input-wrap__icon" aria-hidden="true">📧</span>
            <input
              id="signup-email"
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
          <label htmlFor="signup-password">Password</label>
          <div className="gm-input-wrap">
            <span className="gm-input-wrap__icon" aria-hidden="true">🔒</span>
            <input
              id="signup-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className="gm-input"
              placeholder="At least 5 characters"
              autoComplete="new-password"
              required
              minLength={5}
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
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
}
