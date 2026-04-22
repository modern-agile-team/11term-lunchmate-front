import { cn } from '@/shared/lib/classnames';
import type { RoomFilterChipOption } from './roomFilterPanel.types';

interface RoomFilterChipGroupProps<T extends string> {
  label: string;
  options: RoomFilterChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

const RoomFilterChipGroup = <T extends string,>({
  label,
  options,
  value,
  onChange,
}: RoomFilterChipGroupProps<T>) => (
  <div>
    <p className="text-sm font-semibold text-slate-700">{label}</p>
    <div className="mt-2 flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm font-semibold transition',
            value === option.value
              ? 'bg-slate-900 text-white'
              : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);

export default RoomFilterChipGroup;
