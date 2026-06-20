

const MOCK_LATENCY_MS = 900;

const MOCK_RESPONSES = {
  summarize: (text) => {
    const trimmed = text.trim();
    const preview = trimmed.length > 140 ? `${trimmed.slice(0, 140)}…` : trimmed;
    return `Summary: ${preview}`;
  },

  bullets: (text) => {
    const sentences = text
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter(Boolean);
    const points = sentences.length ? sentences : [text.trim()];
    return points.map((point) => `• ${point}`).join('\n');
  },

  tutor: (text) => {
    const trimmed = text.trim();
    const snippet = trimmed.length > 160 ? `${trimmed.slice(0, 160)}…` : trimmed;
    return [
      'Here\'s how a tutor might walk through this:',
      `"${snippet}"`,
      '',
      'Think of it in three small steps — first the "what" (the core idea),',
      'then the "why" (why it matters), then the "how it connects" to',
      'something you already know. Breaking it down like this usually',
      'makes the idea click faster than reading it all at once.',
    ].join('\n');
  },
};

// Centralized "AI call". This is the single place to swap in a real API.
async function callAI(mode, text) {
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));

  if (!text || !text.trim()) {
    return {
      success: false,
      result: '',
      error: 'Write or paste some text in the note box first ✍️',
    };
  }

  /* ---------------------------------------------------------------------
   * REAL API EXAMPLE (kept here for when you're ready to connect OpenAI):
   *
   * const PROMPTS = {
   *   summarize: 'Summarize the following text in 1-2 sentences.',
   *   bullets: 'Convert the following text into concise bullet points.',
   *   tutor: 'Explain the following text simply, like a patient tutor.',
   * };
   *
   * const response = await fetch('https://api.openai.com/v1/chat/completions', {
   *   method: 'POST',
   *   headers: {
   *     'Content-Type': 'application/json',
   *     Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
   *   },
   *   body: JSON.stringify({
   *     model: 'gpt-4o-mini',
   *     messages: [
   *       { role: 'system', content: PROMPTS[mode] },
   *       { role: 'user', content: text },
   *     ],
   *   }),
   * });
   *
   * if (!response.ok) {
   *   return { success: false, result: '', error: 'AI request failed. Try again.' };
   * }
   *
   * const data = await response.json();
   * return { success: true, result: data.choices[0].message.content };
   * ------------------------------------------------------------------- */

  return { success: true, result: MOCK_RESPONSES[mode](text) };
}

export async function summarizeText(text) {
  return callAI('summarize', text);
}

export async function convertToBulletPoints(text) {
  return callAI('bullets', text);
}

export async function explainLikeTutor(text) {
  return callAI('tutor', text);
}
