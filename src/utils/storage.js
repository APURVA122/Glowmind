const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function getToken() {
  return localStorage.getItem('glowmind_token');
}

async function apiRequest(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'auth-token': token } : {}),
      ...(options.headers || {}),
    },
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok || !json.success) {
    throw new Error(json.error || 'Something went wrong');
  }
  return json;
}

/** All domains with a notebook for the signed-in user. */
export async function getAllDomains() {
  const json = await apiRequest('/api/notes/domains');
  return json.domains;
}

/** Register a domain notebook (even before its first note). */
export async function addDomain(domain) {
  const json = await apiRequest('/api/notes/domains', {
    method: 'POST',
    body: JSON.stringify({ domain }),
  });
  return json.domains;
}

/** Remove a domain notebook and every note in it. */
export async function removeDomain(domain) {
  const json = await apiRequest(`/api/notes/domains/${encodeURIComponent(domain)}`, {
    method: 'DELETE',
  });
  return json.domains;
}

/** Notes for one domain. */
export async function getNotesForDomain(domain) {
  const json = await apiRequest(`/api/notes/${encodeURIComponent(domain)}`);
  return json.notes;
}

/** Add a note. Returns the updated notes array. */
export async function addNote(domain, text, tag = '📝') {
  const json = await apiRequest(`/api/notes/${encodeURIComponent(domain)}`, {
    method: 'POST',
    body: JSON.stringify({ text, tag }),
  });
  return json.notes;
}

/** Edit a note's text. Returns the updated notes array. */
export async function updateNote(domain, noteId, newText) {
  const json = await apiRequest(`/api/notes/${encodeURIComponent(domain)}/${noteId}`, {
    method: 'PUT',
    body: JSON.stringify({ text: newText }),
  });
  return json.notes;
}

/** Delete a note. Returns the updated notes array. */
export async function deleteNote(domain, noteId) {
  const json = await apiRequest(`/api/notes/${encodeURIComponent(domain)}/${noteId}`, {
    method: 'DELETE',
  });
  return json.notes;
}
