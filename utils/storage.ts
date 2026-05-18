// Storage utility — API fetch with CSRF and token refresh

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

export const apiFetch = async (input: RequestInfo | URL, init?: RequestInit, attemptRefresh = true): Promise<Response> => {
  const method = (init?.method ?? 'GET').toUpperCase();
  let csrfToken =
    method === 'GET' || method === 'HEAD' || method === 'OPTIONS' ? null : getCookieValue('csrf_token');
  if (!csrfToken && method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
    await fetch('/api/auth/csrf', { method: 'GET', credentials: 'include' });
    csrfToken = getCookieValue('csrf_token');
  }

  // Don't set Content-Type for FormData — browser sets it with boundary automatically
  const isFormData = typeof FormData !== 'undefined' && init?.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
    ...((init?.headers as Record<string, string>) ?? {}),
  };

  const response = await fetch(input, {
    ...init,
    credentials: 'include',
    headers,
  });

  if (response.status !== 401 || !attemptRefresh) return response;

  // Attempt token refresh
  const refreshCsrfToken = getCookieValue('csrf_token');
  const refreshResponse = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
    headers: {
      ...(refreshCsrfToken ? { 'x-csrf-token': refreshCsrfToken } : {}),
    },
  });

  if (!refreshResponse.ok) return response;

  // Retry original request after successful refresh
  return apiFetch(input, init, false);
};
