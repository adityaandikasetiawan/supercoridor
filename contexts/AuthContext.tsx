import { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions?: string[];
}

type LoginResult =
  | { ok: true }
  | {
      ok: false;
      error: 'INVALID_CREDENTIALS' | 'LOCKED' | 'NOT_CONFIGURED' | 'SERVER_UNAVAILABLE' | 'INTERNAL';
      lockUntil?: number;
      remainingAttempts?: number;
    };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOGOUT_BROADCAST_KEY = 'admin_logout_broadcast';

function getCookieValue(name: string) {
  const encoded = encodeURIComponent(name) + '=';
  const parts = document.cookie.split(';');
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith(encoded)) {
      return decodeURIComponent(trimmed.slice(encoded.length));
    }
  }
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const apiFetch = useCallback(
    async (input: RequestInfo | URL, init?: RequestInit, attemptRefresh = true): Promise<Response> => {
      const method = (init?.method ?? 'GET').toUpperCase();
      let csrfToken =
        method === 'GET' || method === 'HEAD' || method === 'OPTIONS' ? null : getCookieValue('csrf_token');
      if (!csrfToken && method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
        await fetch('/api/auth/csrf', { method: 'GET', credentials: 'include' });
        csrfToken = getCookieValue('csrf_token');
      }

      const response = await fetch(input, {
        ...init,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
          ...(init?.headers ?? {}),
        },
      });

      if (response.status !== 401 || !attemptRefresh) return response;

      const refreshCsrfToken = getCookieValue('csrf_token');
      const refreshResponse = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: {
          ...(refreshCsrfToken ? { 'x-csrf-token': refreshCsrfToken } : {}),
        },
      });

      if (!refreshResponse.ok) return response;

      return apiFetch(input, init, false);
    },
    []
  );

  const logout = useCallback(() => {
    void apiFetch('/api/auth/logout', { method: 'POST' }, false);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.setItem(LOGOUT_BROADCAST_KEY, String(Date.now()));
  }, [apiFetch]);

  useEffect(() => {
    void fetch('/api/auth/csrf', { method: 'GET', credentials: 'include' });

    const onStorage = (event: StorageEvent) => {
      if (event.key === LOGOUT_BROADCAST_KEY) {
        setUser(null);
        setIsAuthenticated(false);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    const loadMe = async () => {
      try {
        const response = await apiFetch('/api/auth/me', { method: 'GET' }, false);
        if (!response.ok) {
          setUser(null);
          setIsAuthenticated(false);
          return;
        }

        const data = (await response.json()) as { ok: true; user: User };
        setUser(data.user);
        setIsAuthenticated(true);
      } finally {
        setIsLoading(false);
      }
    };
    void loadMe();
  }, [apiFetch]);

  const login = useCallback(
    async (email: string, password: string): Promise<LoginResult> => {
      let response: Response;
      try {
        response = await apiFetch('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
      } catch {
        return { ok: false, error: 'SERVER_UNAVAILABLE' };
      }

      const contentType = response.headers.get('content-type') ?? '';
      const isJson = contentType.includes('application/json');
      const body = (isJson ? await response.json().catch(() => null) : null) as
        | { ok: true; user: User }
        | { ok: false; error: 'INVALID_CREDENTIALS' | 'LOCKED' | 'NOT_CONFIGURED' | 'INTERNAL'; lockUntil?: number; remainingAttempts?: number }
        | null;

      if (response.ok && body && body.ok) {
        setUser(body.user);
        setIsAuthenticated(true);
        return { ok: true };
      }

      if (response.status === 423 && body && !body.ok && body.error === 'LOCKED') {
        return { ok: false, error: 'LOCKED', lockUntil: body.lockUntil };
      }

      if (response.status === 500 && body && !body.ok && body.error === 'NOT_CONFIGURED') {
        return { ok: false, error: 'NOT_CONFIGURED' };
      }

      if (response.status >= 500 && (!isJson || !body)) {
        return { ok: false, error: 'SERVER_UNAVAILABLE' };
      }

      if (response.status >= 500 && body && !body.ok && body.error === 'INTERNAL') {
        return { ok: false, error: 'INTERNAL' };
      }

      return { ok: false, error: 'INVALID_CREDENTIALS', remainingAttempts: body?.remainingAttempts };
    },
    [apiFetch]
  );

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
