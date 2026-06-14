'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-14 h-7 rounded-full bg-black/5 dark:bg-white/5 border border-slate-400/30 dark:border-white/10" />;
  }

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-14 h-7 rounded-full transition-colors duration-300 border focus:outline-none flex items-center px-1 shadow-inner
        ${isDark 
          ? 'bg-[#1A1918] border-white/10' 
          : 'bg-[#A9B5C2] border-slate-400/50'
        }
      `}
      title={isDark ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
    >
      {/* Sun Icon (Background left) */}
      <Sun className={`absolute left-1.5 w-3.5 h-3.5 transition-opacity duration-300 ${isDark ? 'opacity-30 text-white' : 'opacity-100 text-slate-800'}`} />
      
      {/* Moon Icon (Background right) */}
      <Moon className={`absolute right-1.5 w-3.5 h-3.5 transition-opacity duration-300 ${isDark ? 'opacity-100 text-white' : 'opacity-30 text-slate-800'}`} />

      {/* Sliding Knob */}
      <div 
        className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out flex items-center justify-center
          ${isDark ? 'translate-x-7 bg-[#BFBBAF]' : 'translate-x-0 bg-white'}
        `}
      />
    </button>
  );
}
