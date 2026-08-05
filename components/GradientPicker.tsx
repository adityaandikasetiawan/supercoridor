import { GRADIENT_OPTIONS } from './HeroGradient';

interface GradientPickerProps {
  value: string;
  onChange: (key: string) => void;
  label?: string;
}

export function GradientPicker({ value, onChange, label = 'Hero Color' }: GradientPickerProps) {
  return (
    <div>
      <label className="block text-sm text-gray-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {GRADIENT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            className={`w-10 h-10 rounded-lg ${opt.className} border-2 transition-all ${
              value === opt.key ? 'border-gray-900 scale-110 ring-2 ring-offset-1 ring-gray-400' : 'border-transparent hover:scale-105'
            }`}
            title={opt.label}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Selected: <span className="font-medium">{GRADIENT_OPTIONS.find(o => o.key === value)?.label ?? value}</span>
      </p>
    </div>
  );
}
