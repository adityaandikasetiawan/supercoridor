// Storage utility for syncing data between admin and public pages

export const STORAGE_KEYS = {
  HERO_SLIDES: 'hero_slides',
  TGCS_DATA: 'tgcs_data',
} as const;

// Helper functions to get data from localStorage
export const getHeroSlides = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.HERO_SLIDES);
  if (saved) {
    return JSON.parse(saved);
  }
  return null;
};

export const getTGCSData = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.TGCS_DATA);
  if (saved) {
    return JSON.parse(saved);
  }
  return null;
};

export const setHeroSlides = (data: any) => {
  localStorage.setItem(STORAGE_KEYS.HERO_SLIDES, JSON.stringify(data));
};

export const setTGCSData = (data: any) => {
  localStorage.setItem(STORAGE_KEYS.TGCS_DATA, JSON.stringify(data));
};

export const getCookieValue = (name: string) => {
  const encoded = encodeURIComponent(name) + '=';
  const parts = document.cookie.split(';');
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith(encoded)) {
      return decodeURIComponent(trimmed.slice(encoded.length));
    }
  }
  return null;
};

export const apiFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const method = (init?.method ?? 'GET').toUpperCase();
  let csrfToken =
    method === 'GET' || method === 'HEAD' || method === 'OPTIONS' ? null : getCookieValue('csrf_token');
  if (!csrfToken && method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
    await fetch('/api/auth/csrf', { method: 'GET', credentials: 'include' });
    csrfToken = getCookieValue('csrf_token');
  }

  return fetch(input, {
    ...init,
    credentials: 'include',
    headers: {
      ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
      ...(init?.headers ?? {}),
    },
  });
};
