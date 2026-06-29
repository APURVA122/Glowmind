import React, { useState } from 'react';
import Header from './Header';
import DomainBar from './DomainBar';
import NotesArea from './NotesArea';
import AIControls from './AIControls';
import { useNotes } from '../hooks/useNotes';
import { DEFAULT_DOMAINS } from '../utils/constants';
import './Sidebar.css';

function detectCurrentHost() {
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    return window.location.hostname;
  }
  return DEFAULT_DOMAINS[0];
}


export default function Sidebar({ onSignOut }) {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState('pink');
  const [domain, setDomain] = useState(detectCurrentHost);

  const [draftText, setDraftText] = useState('');
  const [draftTag, setDraftTag] = useState('📝');

  const { notes, addNote, updateNote, deleteNote, isLoading, error } = useNotes(domain);

  const handleDraftChange = (value) => {
    setDraftText(value);
    setDraftTag('📝');
  };

  const handleAIResult = (resultText, tagEmoji) => {
    setDraftText(resultText);
    setDraftTag(tagEmoji);
  };

  const handleAddNote = (text) => {
    addNote(text, draftTag);
    setDraftText('');
    setDraftTag('📝');
  };

  return (
    <div className="gm-root" data-theme={theme}>
      {!isOpen && (
        <button
          type="button"
          className="gm-fab"
          onClick={() => setIsOpen(true)}
          aria-label="Open GlowMind AI sidebar"
        >
          ✨
        </button>
      )}

      <aside className={`gm-sidebar ${isOpen ? 'gm-sidebar--open' : ''}`}>
        <div className="gm-orb gm-orb--1" aria-hidden="true" />
        <div className="gm-orb gm-orb--2" aria-hidden="true" />

        <div className="gm-sidebar__content">
          <Header
            isOpen={isOpen}
            onToggle={() => setIsOpen((open) => !open)}
            theme={theme}
            onThemeChange={setTheme}
            onSignOut={onSignOut}
          />

          <DomainBar domain={domain} onDomainChange={setDomain} />

          <AIControls sourceText={draftText} onResult={handleAIResult} />

          <NotesArea
            draftText={draftText}
            onDraftChange={handleDraftChange}
            notes={notes}
            onAddNote={handleAddNote}
            onDeleteNote={deleteNote}
            onUpdateNote={updateNote}
            isLoading={isLoading}
            loadError={error}
          />
        </div>
      </aside>
    </div>
  );
}
