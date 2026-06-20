import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('glowmind_token'));
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(() => !!localStorage.getItem('glowmind_token'));

  const logout = useCallback(() => {
    localStorage.removeItem('glowmind_token');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    let isCurrent = true;

    async function fetchUser() {
      const currentToken = localStorage.getItem('glowmind_token');
      if (!currentToken) {
        setAuthLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          method: 'GET',
          headers: { 'auth-token': currentToken },
        });
        const json = await response.json();

        if (!isCurrent) return;

        if (json.success) {
          setUser(json.user);
        } else {
          logout();
        }
      } catch (error) {
        if (isCurrent) logout();
      } finally {
        if (isCurrent) setAuthLoading(false);
      }
    }

    if (token) {
      setAuthLoading(true);
      fetchUser();
    } else {
      setAuthLoading(false);
    }

    return () => {
      isCurrent = false;
    };
  }, [token, logout]);

  const applyAuthResult = (json) => {
    if (json.success) {
      localStorage.setItem('glowmind_token', json.authToken);
      setToken(json.authToken);
    }
    return json;
  };

  const login = async (email, password) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return applyAuthResult(await response.json());
  };

  const register = async (name, email, password) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return applyAuthResult(await response.json());
  };

  // `code` is the authorization code from @react-oauth/google's
  // popup auth-code flow — see auth/GoogleLoginButton.jsx.
  const loginWithGoogle = async (code) => {
    const response = await fetch(`${API_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    return applyAuthResult(await response.json());
  };

  const value = { token, user, authLoading, login, register, loginWithGoogle, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an <AuthProvider>');
  }
  return context;
}
