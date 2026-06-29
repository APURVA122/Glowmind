import { useState, useEffect, useCallback } from 'react';
import {
  getNotesForDomain,
  addNote as addNoteOnServer,
  updateNote as updateNoteOnServer,
  deleteNote as deleteNoteOnServer,
} from '../utils/storage';


export function useNotes(domain) {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);
    setError(null);

    getNotesForDomain(domain)
      .then((result) => { if (isCurrent) setNotes(result); })
      .catch((err) => { if (isCurrent) setError(err.message); })
      .finally(() => { if (isCurrent) setIsLoading(false); });

    return () => { isCurrent = false; };
  }, [domain]);

  const addNote = useCallback(async (text, tag) => {
    try {
      setNotes(await addNoteOnServer(domain, text, tag));
      setError(null);
    } catch (err) { setError(err.message); }
  }, [domain]);

  const updateNote = useCallback(async (noteId, text) => {
    try {
      setNotes(await updateNoteOnServer(domain, noteId, text));
      setError(null);
    } catch (err) { setError(err.message); }
  }, [domain]);

  const deleteNote = useCallback(async (noteId) => {
    try {
      setNotes(await deleteNoteOnServer(domain, noteId));
      setError(null);
    } catch (err) { setError(err.message); }
  }, [domain]);

  return { notes, addNote, updateNote, deleteNote, isLoading, error };
}
