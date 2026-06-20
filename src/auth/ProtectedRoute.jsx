import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './ProtectedRoute.css';


export default function ProtectedRoute({ children }) {
  const { user, token, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="gm-route-loading">
        <span className="gm-route-loading__sparkle" aria-hidden="true">✨</span>
        <p>Loading your notes…</p>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
