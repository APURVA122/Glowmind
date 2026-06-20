
export function extractDomain(input) {
  if (!input) return null;

  const trimmed = input.trim();
  if (!trimmed) return null;

  const hasProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed);
  const candidate = hasProtocol ? trimmed : `https://${trimmed}`;

  try {
    const { hostname } = new URL(candidate);
    if (!hostname) return null;
    return hostname.replace(/^www\./i, '').toLowerCase();
  } catch (error) {
    return null;
  }
}
