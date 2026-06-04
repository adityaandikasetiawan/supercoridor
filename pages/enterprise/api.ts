import { apiFetch } from '../../utils/storage';

const BASE = '/api/enterprise';

async function get(path: string) {
  const res = await apiFetch(`${BASE}${path}`, { method: 'GET' });
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}

async function post(path: string, body?: unknown) {
  const res = await apiFetch(`${BASE}${path}`, { method: 'POST', body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}

async function put(path: string, body: unknown) {
  const res = await apiFetch(`${BASE}${path}`, { method: 'PUT', body: JSON.stringify(body) });
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}

async function del(path: string) {
  const res = await apiFetch(`${BASE}${path}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}

export const enterpriseApi = {
  devices: {
    getAll: (params?: Record<string, string>) => get(`/devices${params ? '?' + new URLSearchParams(params).toString() : ''}`),
    create: (body: unknown) => post('/devices', body),
    update: (id: string | number, body: unknown) => put(`/devices/${id}`, body),
    remove: (id: string | number) => del(`/devices/${id}`),
    reset: () => post('/devices/reset'),
    bulkImport: (devices: unknown[]) => post('/devices/bulk-import', { devices }),
  },
  pricing: {
    generate: (params: unknown) => post('/pricing/generate', params),
  },
  quotes: {
    getAll: () => get('/quotes'),
    getOne: (id: string) => get(`/quotes/${id}`),
    create: (body: unknown) => post('/quotes', body),
    update: (id: string, body: unknown) => put(`/quotes/${id}`, body),
    remove: (id: string) => del(`/quotes/${id}`),
    generate: (id: string) => post(`/quotes/${id}/generate`),
    submit: (id: string) => post(`/quotes/${id}/submit`),
    approve: (id: string, approved: boolean, note?: string) => post(`/quotes/${id}/approve`, { approved, note }),
  },
  config: {
    getBiayaTeknis: () => get('/config/biaya-teknis'),
    updateBiayaTeknis: (body: unknown) => put('/config/biaya-teknis', body),
    resetBiayaTeknis: () => post('/config/biaya-teknis/reset'),
    getRegionCosts: () => get('/config/region-costs'),
  },
  categories: {
    getAll: () => get('/categories'),
    create: (body: { id: string; label: string; icon?: string }) => post('/categories', body),
    update: (id: string, body: { label?: string; icon?: string }) => put(`/categories/${id}`, body),
    remove: (id: string) => del(`/categories/${id}`),
  },
};
