

const STORAGE_KEY = 'glowmind_ai_notes_v1';

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `note_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('GlowMind: could not read notes from localStorage', error);
    return [];
  }
}

function writeAll(allEntries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allEntries));
  } catch (error) {
    console.error('GlowMind: could not write notes to localStorage', error);
  }
}

function saveDomainNotes(userId, domain, notes) {
  const all = readAll();
  const index = all.findIndex((entry) => entry.userId === userId && entry.domain === domain);

  if (index === -1) {
    all.push({ userId, domain, notes });
  } else {
    all[index] = { userId, domain, notes };
  }

  writeAll(all);
  return notes;
}

/** All domains that currently have a notebook for this user. */
export function getAllDomains(userId) {
  return readAll()
    .filter((entry) => entry.userId === userId)
    .map((entry) => entry.domain);
}

/** Notes for one user's notebook on one domain (empty if it's new). */
export function getNotesForDomain(userId, domain) {
  const entry = readAll().find((d) => d.userId === userId && d.domain === domain);
  return entry ? entry.notes : [];
}

/** Add a note to a domain's notebook. Returns the updated notes array. */
export function addNote(userId, domain, text, tag = '📝') {
  const newNote = {
    id: generateId(),
    text,
    tag,
    createdAt: Date.now(),
  };
  const updatedNotes = [...getNotesForDomain(userId, domain), newNote];
  return saveDomainNotes(userId, domain, updatedNotes);
}

/** Edit an existing note's text by id. Returns the updated notes array. */
export function updateNote(userId, domain, noteId, newText) {
  const updatedNotes = getNotesForDomain(userId, domain).map((note) =>
    note.id === noteId ? { ...note, text: newText } : note
  );
  return saveDomainNotes(userId, domain, updatedNotes);
}

/** Remove a note by id. Returns the updated notes array. */
export function deleteNote(userId, domain, noteId) {
  const updatedNotes = getNotesForDomain(userId, domain).filter((note) => note.id !== noteId);
  return saveDomainNotes(userId, domain, updatedNotes);
}

/** Wipe every note for a single domain (keeps the user's other domains). */
export function clearDomainNotes(userId, domain) {
  return saveDomainNotes(userId, domain, []);
}

/**
 * Make sure a domain has a notebook entry for this user, even before
 * its first note is written. Without this, a freshly added site would
 * disappear from "known domains" the moment the user switched away
 * from it, since nothing would have been persisted yet.
 */
export function addDomain(userId, domain) {
  return saveDomainNotes(userId, domain, getNotesForDomain(userId, domain));
}

/** Remove one of this user's domains entirely, including its notes. */
export function removeDomain(userId, domain) {
  const all = readAll().filter((entry) => !(entry.userId === userId && entry.domain === domain));
  writeAll(all);
}
