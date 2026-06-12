'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const modes = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark',  label: 'Dark',  icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const CurrentIcon = modes.find(m => m.value === theme)?.icon ?? Sun;

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white rounded-lg border border-black/10 dark:border-white/10 transition-all"
        title="Cambiar modo"
      >
        <CurrentIcon className="w-3.5 h-3.5" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-36 rounded-xl border border-black/10 dark:border-white/10 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 text-foreground">
          {/* Header */}
          <div className="px-3 py-2 border-b border-black/5 dark:border-white/5">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Modo</p>
          </div>

          {/* Options */}
          <div className="py-1">
            {modes.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => { setTheme(value as 'light' | 'dark' | 'system'); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-bold transition-colors ${
                  theme === value
                    ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-400/10'
                    : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {/* Bullet / active indicator */}
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  theme === value ? 'bg-cyan-500 dark:bg-cyan-400' : 'bg-transparent border border-gray-400 dark:border-gray-600'
                }`} />
                <Icon className="w-3 h-3" />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
