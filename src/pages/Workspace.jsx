import React from 'react';
import { useAuth } from '../auth/AuthContext';
import Sidebar from '../components/Sidebar';
import './Workspace.css';

export default function Workspace() {
  const { user, logout } = useAuth();

  const initial = user?.name ? user.name.trim().charAt(0).toUpperCase() : '🙂';

  return (
    <div className="gm-demo-page">
      <header className="gm-demo-page__nav">
        <span className="gm-demo-page__logo">📰 The Daily Read</span>

        <div className="gm-demo-page__account">
          <span className="gm-demo-page__avatar" aria-hidden="true">{initial}</span>
          <span className="gm-demo-page__name">{user?.name || 'You'}</span>
          <button type="button" className="gm-demo-page__logout" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      <main className="gm-demo-page__content">
        <h1>The Quiet Science of Slow Mornings</h1>
        <p className="gm-demo-page__byline">By a fictional staff writer · 6 min read</p>

        <p>
          Imagine the rest of this article living here — any blog post, documentation
          page, or research paper. GlowMind AI floats on top of it, ready to take notes,
          summarize, or turn a paragraph into bullet points without ever leaving the page.
        </p>
        <p>
          Open the sidebar with the ✨ button on the right, write or paste a few lines into
          the note box, then try one of the AI actions to see a mock response come back —
          the same flow a real model would slot into later.
        </p>
      </main>

      <Sidebar />
    </div>
  );
}
