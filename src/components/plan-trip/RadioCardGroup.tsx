'use client';

interface RadioCardGroupProps {
  options: { value: string; label: string; description: string; emoji: string }[];
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  name: string;
}

export default function RadioCardGroup({
  options,
  value,
  onChange,
  hasError,
  name,
}: RadioCardGroupProps) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ${
        hasError ? 'ring-1 ring-red-500/40 rounded-xl p-1' : ''
      }`}
    >
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <label
            key={opt.value}
            className={`
              relative flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer
              border transition-all duration-200 text-center select-none
              ${
                isActive
                  ? 'bg-violet-500/15 border-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.12)]'
                  : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20'
              }
            `}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={isActive}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            <span className="text-2xl">{opt.emoji}</span>
            <span
              className={`text-sm font-semibold ${isActive ? 'text-violet-300' : 'text-white'}`}
            >
              {opt.label}
            </span>
            <span className="text-xs text-slate-500 leading-snug">{opt.description}</span>
            {isActive && (
              <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            )}
          </label>
        );
      })}
    </div>
  );
}
