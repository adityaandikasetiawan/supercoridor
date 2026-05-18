import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../utils/storage';

/**
 * Reusable hook for admin pages that manage content via the generic page content API.
 * Handles loading, saving, and error states.
 */
export function useAdminContent<T>(key: string, defaultData: T) {
  const [data, setData] = useState<T>(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiFetch(`/api/admin/content/pages/${key}`, { method: 'GET' });
        if (response.ok) {
          const result = await response.json();
          if (result.data && typeof result.data === 'object') {
            // Merge: API data overrides defaults, but missing fields keep defaults
            setData((prev) => ({ ...prev, ...result.data } as T));
          }
        }
      } catch {
        // use defaults
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [key]);

  const save = useCallback(async (newData?: T) => {
    setSaving(true);
    setError('');
    try {
      const payload = newData ?? data;
      const response = await apiFetch(`/api/admin/content/pages/${key}`, {
        method: 'PUT',
        body: JSON.stringify({ data: payload }),
      });
      if (response.ok) {
        if (newData) setData(newData);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        return true;
      } else {
        setError('Failed to save changes');
        return false;
      }
    } catch {
      setError('Failed to save changes');
      return false;
    } finally {
      setSaving(false);
    }
  }, [data, key]);

  return { data, setData, loading, saving, saved, error, save };
}
