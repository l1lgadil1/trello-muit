'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../theme/theme-context';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-3 rounded-full
        bg-primary text-primary-foreground
        hover:bg-primary/90
        transition-all duration-200
        border-2 border-primary/20
        shadow-lg hover:shadow-xl
        fixed bottom-6 right-6 z-[9999]
        flex items-center gap-2
        scale-100 hover:scale-110
        ${theme === 'dark' ? 'hover:rotate-12' : 'hover:-rotate-12'}
      `}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" strokeWidth={2.5} />
      ) : (
        <Sun className="h-5 w-5" strokeWidth={2.5} />
      )}
    </button>
  );
} 