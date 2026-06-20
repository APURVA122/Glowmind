import React from 'react';
import './Header.css';

const THEMES = ['pink', 'lavender', 'mint'];
const THEME_META = {
  pink: { emoji: '🌸', label: 'Pink Dream' },
  lavender: { emoji: '💜', label: 'Lavender Mist' },
  mint: { emoji: '🌿', label: 'Soft Mint' },
};

export default function Header({ isOpen, onToggle, theme, onThemeChange }) {
  const cycleTheme = () => {
    const currentIndex = THEMES.indexOf(theme);
    const next = THEMES[(currentIndex + 1) % THEMES.length];
    onThemeChange(next);
  };

  return (
    <header className="gm-header">
      <div className="gm-header__title">
        <span className="gm-header__sparkle" aria-hidden="true">✨</span>
        <div>
          <h1>GlowMind AI</h1>
          <p className="gm-header__subtitle">your aesthetic study buddy</p>
        </div>
      </div>

      <div className="gm-header__actions">
        <button
          type="button"
          className="gm-icon-btn"
          onClick={cycleTheme}
          title={`Theme: ${THEME_META[theme].label} — click to switch`}
          aria-label="Switch theme"
        >
          {THEME_META[theme].emoji}
        </button>
        <button
          type="button"
          className="gm-icon-btn"
          onClick={onToggle}
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>
    </header>
  );
}
