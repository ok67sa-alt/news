const STRAPI_URL = import.meta.env.VITE_STRAPI_API_URL || '';
const STRAPI_TOKEN = import.meta.env.VITE_STRAPI_API_TOKEN || '';
const API_URL = import.meta.env.VITE_API_URL || '';

export interface QueryParams {
  [key: string]: any;
}

function normalizeStrapiItem(item: any): any {
  if (!item) return null;
  if (typeof item !== 'object') return item;

  const id = item.id;
  const attrs = item.attributes || item;
  const normalized: any = { id };

  for (const key in attrs) {
    if (!Object.prototype.hasOwnProperty.call(attrs, key)) continue;
    const val = attrs[key];

    if (val && typeof val === 'object') {
      if ('data' in val) {
        normalized[key] = Array.isArray(val.data)
          ? val.data.map(normalizeStrapiItem)
          : val.data
            ? normalizeStrapiItem(val.data)
            : null;
      } else if (Array.isArray(val)) {
        normalized[key] = val.map(normalizeStrapiItem);
      } else if ('url' in val) {
        normalized[key] = val;
      } else {
        normalized[key] = normalizeStrapiItem(val);
      }
    } else {
      normalized[key] = val;
    }
  }

  return normalized;
}

function normalizeStrapiResponse(response: any): any {
  if (!response) return null;
  const data = response.data;
  if (Array.isArray(data)) return data.map(normalizeStrapiItem);
  if (data) return normalizeStrapiItem(data);
  return response;
}

async function fetchFromStrapi(path: string, params: QueryParams = {}) {
  const url = new URL(`${STRAPI_URL}/api${path}`);

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

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (STRAPI_TOKEN) headers.Authorization = `Bearer ${STRAPI_TOKEN}`;

  const res = await fetch(url.toString(), { headers });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const json = await res.json();
  return normalizeStrapiResponse(json);
}

/**
 * Fetch from Strapi (when VITE_STRAPI_API_URL is set) or the Next.js backend.
 */
export async function fetchAPI(path: string, params: QueryParams = {}) {
  if (STRAPI_URL) {
    return fetchFromStrapi(path, params);
  }

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

export async function incrementArticleViews(id: number, currentViews: number) {
  try {
    if (STRAPI_URL) {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (STRAPI_TOKEN) headers.Authorization = `Bearer ${STRAPI_TOKEN}`;
      const res = await fetch(`${STRAPI_URL}/api/articles/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ data: { views: currentViews + 1 } }),
      });
      if (!res.ok) console.warn('Failed to increment views in Strapi');
      return;
    }

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
