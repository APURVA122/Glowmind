import React from 'react';
import NoteItem from './NoteItem';
import './NotesArea.css';

export default function NotesArea({
  draftText,
  onDraftChange,
  notes,
  onAddNote,
  onDeleteNote,
  onUpdateNote,
  isLoading = false,
  loadError = null,
}) {
  const handleAdd = () => {
    const trimmed = draftText.trim();
    if (!trimmed) return;
    onAddNote(trimmed);
  };

  return (
    <div className="gm-notes-area">
      <div className="gm-composer">
        <textarea
          className="gm-composer__input"
          placeholder="Type a thought, paste an article, or jot something down... ✍️"
          value={draftText}
          onChange={(e) => onDraftChange(e.target.value)}
        />
        <button
          type="button"
          className="gm-btn gm-btn--primary gm-composer__add"
          onClick={handleAdd}
          disabled={!draftText.trim()}
        >
          + Add note
        </button>
      </div>

      {loadError && <div className="gm-error-banner">{loadError}</div>}

      <div className="gm-notes-list">
        {isLoading && notes.length === 0 ? (
          <div className="gm-empty-state">
            <span className="gm-empty-state__icon" aria-hidden="true">✨</span>
            <p>Loading your notes…</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="gm-empty-state">
            <span className="gm-empty-state__icon" aria-hidden="true">🦢</span>
            <p>No notes yet for this page. Start writing or try an AI action above ✨</p>
          </div>
        ) : (
          notes
            .slice()
            .reverse()
            .map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                onDelete={() => onDeleteNote(note.id)}
                onUpdate={(newText) => onUpdateNote(note.id, newText)}
              />
            ))
        )}
      </div>
    </div>
  );
}
