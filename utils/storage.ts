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
