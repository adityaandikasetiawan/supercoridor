import { useEffect, useState } from 'react';

/**
 * Reusable hook for public pages to fetch content from the generic pages API.
 * Merges API data with defaultData so missing fields fall back to defaults.
 */
export function usePageContent<T extends Record<string, unknown>>(key: string, defaultData: T): T {
  const [data, setData] = useState<T>(defaultData);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`/api/content/pages/${key}`, { cache: 'no-store' });
        if (response.ok) {
          const result = await response.json();
          if (result.data && typeof result.data === 'object') {
            // Merge: API data overrides defaults, but missing fields keep defaults
            setData({ ...defaultData, ...result.data } as T);
          }
        }
      } catch {
        // use defaults silently
      }
    };
    void load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return data;
}
