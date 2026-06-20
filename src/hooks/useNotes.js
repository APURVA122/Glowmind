import { useState, useEffect, useCallback } from 'react';
import {
  getNotesForDomain,
  addNote as addNoteToStorage,
  updateNote as updateNoteInStorage,
  deleteNote as deleteNoteFromStorage,
} from '../utils/storage';

/**
 * useNotes(userId, domain)
 * ---------------------------------------------------------------------
 * Keeps one user's notes for one domain in React state, synced with
 * localStorage via storage.js. Re-reads whenever the user or the
 * active domain changes.
 * --------------------------------------------------------------------- */
export function useNotes(userId, domain) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    setNotes(userId ? getNotesForDomain(userId, domain) : []);
  }, [userId, domain]);

  const addNote = useCallback(
    (text, tag) => {
      if (!userId) return;
      setNotes(addNoteToStorage(userId, domain, text, tag));
    },
    [userId, domain]
  );

  const updateNote = useCallback(
    (noteId, text) => {
      if (!userId) return;
      setNotes(updateNoteInStorage(userId, domain, noteId, text));
    },
    [userId, domain]
  );

  const deleteNote = useCallback(
    (noteId) => {
      if (!userId) return;
      setNotes(deleteNoteFromStorage(userId, domain, noteId));
    },
    [userId, domain]
  );

  return { notes, addNote, updateNote, deleteNote };
}
