const API_URL = import.meta.env.VITE_API_URL || '';

export interface QueryParams {
  [key: string]: any;
}

/**
 * Generic fetch wrapper for the new Next.js backend.
 * Accepts the same `path` used across the front-end, e.g. `/articles` or `/categories`.
 */
export async function fetchAPI(path: string, params: QueryParams = {}) {
  // Use relative URL if API_URL is empty or same origin
  const baseUrl = API_URL || window.location.origin;
  const url = new URL(`${baseUrl}/api${path}`);

  Object.keys(params).forEach((key) => {
    const val = params[key];
    if (val !== undefined && val !== null) {
      if (Array.isArray(val)) {
        val.forEach((v, idx) => url.searchParams.append(`${key}[${idx}]`, String(v)));
      } else {
        url.searchParams.append(key, String(val));
      }
    }
  });

  const res = await fetch(url.toString(), {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

/**
 * Increments article views via the backend. Backend will update the database.
 */
export async function incrementArticleViews(id: number, currentViews: number) {
  try {
    const baseUrl = API_URL || window.location.origin;
    const res = await fetch(`${baseUrl}/api/articles/${id}/views`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ views: currentViews + 1 }),
    });
    if (!res.ok) console.warn('Failed to increment views');
  } catch (err) {
    console.error('Error incrementing views:', err);
  }
}
