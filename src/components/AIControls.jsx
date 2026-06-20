import React, { useState } from 'react';
import { summarizeText, convertToBulletPoints, explainLikeTutor } from '../utils/aiStubs';
import './AIControls.css';

const ACTIONS = [
  { id: 'summarize', label: 'Summarize', emoji: '✨', tag: '🧠', run: summarizeText },
  { id: 'bullets', label: 'Bullet points', emoji: '📚', tag: '📚', run: convertToBulletPoints },
  { id: 'tutor', label: 'Explain like a tutor', emoji: '💖', tag: '💖', run: explainLikeTutor },
];

/**
 * AIControls
 * ---------------------------------------------------------------------
 * Runs one of the mock AI functions against `sourceText` (the note
 * currently being drafted) and reports the result back up via
 * onResult(text, tagEmoji). Swapping the mock functions in aiStubs.js
 * for real API calls requires no changes here.
 * --------------------------------------------------------------------- */
export default function AIControls({ sourceText, onResult }) {
  const [loadingAction, setLoadingAction] = useState(null);
  const [error, setError] = useState(null);

  const handleClick = async (action) => {
    setError(null);
    setLoadingAction(action.id);

    const response = await action.run(sourceText);

    setLoadingAction(null);

    if (!response.success) {
      setError(response.error);
      return;
    }

    onResult(response.result, action.tag);
  };

  return (
    <div className="gm-ai-controls">
      <p className="gm-ai-controls__label">AI actions</p>

      <div className="gm-ai-controls__buttons">
        {ACTIONS.map((action) => (
          <button
            key={action.id}
            type="button"
            className="gm-btn gm-btn--ai"
            onClick={() => handleClick(action)}
            disabled={loadingAction !== null}
          >
            {loadingAction === action.id ? (
              <span className="gm-spinner" aria-label="Loading">⏳</span>
            ) : (
              <span aria-hidden="true">{action.emoji}</span>
            )}
            <span>{action.label}</span>
          </button>
        ))}
      </div>

      {error && <p className="gm-ai-controls__error">{error}</p>}
    </div>
  );
}
