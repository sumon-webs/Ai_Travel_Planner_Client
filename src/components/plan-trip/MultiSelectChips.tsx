'use client';

interface MultiSelectChipsProps {
  options: { value: string; label: string; emoji: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
  hasError?: boolean;
}

export default function MultiSelectChips({
  options,
  selected,
  onChange,
  hasError,
}: MultiSelectChipsProps) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div
      className={`flex flex-wrap gap-2 p-3 rounded-xl border transition-colors ${
        hasError ? 'border-red-500/60' : 'border-white/10'
      }`}
    >
      {options.map(({ value, label, emoji }) => {
        const isActive = selected.includes(value);
        return (
          <button
            key={value}
            type="button"
            onClick={() => toggle(value)}
            className={`
              inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium
              border transition-all duration-200 cursor-pointer select-none
              ${
                isActive
                  ? 'bg-violet-500/20 border-violet-500/50 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.15)]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/8 hover:border-white/20 hover:text-slate-300'
              }
            `}
          >
            <span className="text-base">{emoji}</span>
            {label}
            {isActive && (
              <svg
                className="w-3.5 h-3.5 text-violet-400 ml-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}
