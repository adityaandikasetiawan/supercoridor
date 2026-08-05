/**
 * Hero gradient color presets.
 * Each key maps to a Tailwind gradient class string.
 */
export const HERO_GRADIENTS: Record<string, string> = {
  green: 'bg-gradient-to-r from-green-600 to-green-700',
  blue: 'bg-gradient-to-r from-blue-600 to-blue-700',
  orange: 'bg-gradient-to-r from-orange-500 to-orange-600',
  'orange-blue-green': 'bg-gradient-to-r from-orange-500 via-blue-600 to-green-500',
  'dark-blue': 'bg-gradient-to-r from-blue-900 to-blue-800',
  teal: 'bg-gradient-to-r from-teal-600 to-teal-700',
  purple: 'bg-gradient-to-r from-purple-600 to-purple-700',
  red: 'bg-gradient-to-r from-red-600 to-red-700',
  indigo: 'bg-gradient-to-r from-indigo-600 to-indigo-700',
};

export const GRADIENT_OPTIONS = Object.entries(HERO_GRADIENTS).map(([key, value]) => ({
  key,
  label: key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' '),
  className: value,
}));

export function getHeroGradient(key?: string): string {
  if (!key) return HERO_GRADIENTS.green;
  return HERO_GRADIENTS[key] ?? HERO_GRADIENTS.green;
}
