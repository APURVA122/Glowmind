import React, { useState } from 'react';
import './NoteItem.css';

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function NoteItem({ note, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(note.text);

  const handleSave = () => {
    const trimmed = draft.trim();
    if (trimmed) onUpdate(trimmed);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(note.text);
    setIsEditing(false);
  };

  return (
    <div className="gm-note">
      <div className="gm-note__tag" aria-hidden="true">{note.tag}</div>

      <div className="gm-note__body">
        {isEditing ? (
          <textarea
            className="gm-note__edit-area"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
          />
        ) : (
          <p className="gm-note__text">{note.text}</p>
        )}
        <span className="gm-note__time">{formatTime(note.createdAt)}</span>
      </div>

      <div className="gm-note__actions">
        {isEditing ? (
          <>
            <button type="button" className="gm-mini-btn" onClick={handleSave}>
              save
            </button>
            <button type="button" className="gm-mini-btn gm-mini-btn--ghost" onClick={handleCancel}>
              cancel
            </button>
          </>
        ) : (
          <>
            <button type="button" className="gm-mini-btn gm-mini-btn--ghost" onClick={() => setIsEditing(true)}>
              edit
            </button>
            <button type="button" className="gm-mini-btn gm-mini-btn--danger" onClick={onDelete}>
              delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
