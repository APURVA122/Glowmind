import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const AI_ACTIONS = [
  {
    emoji: '✨',
    title: 'Summarize',
    desc: 'Turns a long paragraph into a couple of clear sentences.',
  },
  {
    emoji: '📚',
    title: 'Bullet points',
    desc: 'Breaks dense text into a scannable list, sentence by sentence.',
  },
  {
    emoji: '💖',
    title: 'Explain like a tutor',
    desc: 'Walks through an idea step by step, the way a patient teacher would.',
  },
];

const SAMPLE_DOMAINS = [
  { emoji: '📓', name: 'notion.so', count: '4 notes' },
  { emoji: '💻', name: 'github.com', count: '2 notes' },
  { emoji: '📖', name: 'wikipedia.org', count: '1 note' },
];

export default function Landing() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="gm-root gm-landing" data-theme="pink">
      <div className="gm-landing__orb gm-landing__orb--1" aria-hidden="true" />
      <div className="gm-landing__orb gm-landing__orb--2" aria-hidden="true" />

      <nav className="gm-landing__nav">
        <span className="gm-landing__logo"><span aria-hidden="true">✨</span> GlowMind AI</span>
        <div className="gm-landing__nav-actions">
          <Link to="/login" className="gm-landing__nav-link">Sign in</Link>
          <Link to="/signup" className="gm-btn gm-btn--primary">Get started</Link>
        </div>
      </nav>

      <main>
        <section className="gm-landing__hero">
          <div className="gm-landing__hero-copy">
            <span className="gm-landing__eyebrow">📌 floats over any page you're reading</span>
            <h1>A cozy notebook<br />that floats over any page.</h1>
            <p>
              GlowMind opens as a soft glass panel beside whatever you're reading, keeps a
              separate notebook for every site, and turns rough notes into summaries or bullet
              points the moment you need them.
            </p>
            <div className="gm-landing__hero-actions">
              <Link to="/signup" className="gm-btn gm-btn--primary gm-landing__cta-btn">
                Create your notebook →
              </Link>
              <Link to="/login" className="gm-btn gm-landing__ghost-btn">
                Sign in
              </Link>
            </div>
          </div>

          <div className="gm-landing__hero-mockup" aria-hidden="true">
            <div className="gm-mockup">
              <div className="gm-mockup__chrome">
                <span className="gm-mockup__dot" style={{ background: '#ff8fab' }} />
                <span className="gm-mockup__dot" style={{ background: '#ffd28f' }} />
                <span className="gm-mockup__dot" style={{ background: '#9fe8c0' }} />
                <span className="gm-mockup__url">anysite.com</span>
              </div>

              <div className="gm-mockup__page">
                <div className="gm-mockup__line gm-mockup__line--wide" />
                <div className="gm-mockup__line" />
                <div className="gm-mockup__line gm-mockup__line--short" />

                <div className="gm-mockup__panel">
                  <div className="gm-mockup__panel-header">
                    <span>✨ GlowMind AI</span>
                  </div>
                  <div className="gm-mockup__note">
                    <span>🧠</span>
                    <div className="gm-mockup__note-line" />
                  </div>
                  <div className="gm-mockup__note">
                    <span>📚</span>
                    <div className="gm-mockup__note-line gm-mockup__note-line--short" />
                  </div>
                  <div className="gm-mockup__ai-row">
                    <span>✨ Summarize</span>
                    <span>📚 Bullets</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="gm-landing__section">
          <h2>Three ways to turn raw text into something useful</h2>
          <div className="gm-landing__cards">
            {AI_ACTIONS.map((action) => (
              <div key={action.title} className="gm-landing__card">
                <span className="gm-landing__card-emoji" aria-hidden="true">{action.emoji}</span>
                <h3>{action.title}</h3>
                <p>{action.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="gm-landing__section gm-landing__section--domains">
          <div className="gm-landing__domains-copy">
            <h2>One notebook per site, automatically</h2>
            <p>
              Every domain gets its own notes, kept separate without any folders to set up.
              Switch sites, and GlowMind switches notebooks with you.
            </p>
          </div>
          <div className="gm-landing__domain-chips">
            {SAMPLE_DOMAINS.map((d) => (
              <div key={d.name} className="gm-landing__chip">
                <span aria-hidden="true">{d.emoji}</span>
                <div>
                  <strong>{d.name}</strong>
                  <span className="gm-landing__chip-count">{d.count}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="gm-landing__final-cta">
          <h2>Ready to start your notebook?</h2>
          <p>It's free, it's pastel, and it remembers where you left off.</p>
          <Link to="/signup" className="gm-btn gm-btn--primary gm-landing__cta-btn">
            Create your notebook →
          </Link>
        </section>
      </main>

      <footer className="gm-landing__footer">
        <span>✨ GlowMind AI — Built with ❤️ by Apurva Jain.</span>
        <span>© {currentYear}</span>
      </footer>
    </div>
  );
}
