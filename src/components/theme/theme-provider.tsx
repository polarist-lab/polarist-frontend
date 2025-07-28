'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load theme from localStorage and apply immediately
    const savedTheme = localStorage.getItem('theme') as Theme || 'system';
    setTheme(savedTheme);
    
    const updateResolvedTheme = (themeToUse: Theme) => {
      let resolved: 'light' | 'dark';
      
      if (themeToUse === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        resolved = themeToUse;
      }
      
      setResolvedTheme(resolved);
      
      // Apply theme to document immediately
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(resolved);
      
      return resolved;
    };

    updateResolvedTheme(savedTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const updateResolvedTheme = () => {
      let resolved: 'light' | 'dark';
      
      if (theme === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        resolved = theme;
      }
      
      setResolvedTheme(resolved);
      
      // Apply theme to document
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(resolved);
      
      // Save to localStorage
      localStorage.setItem('theme', theme);
    };

    updateResolvedTheme();

    // Listen for system theme changes
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateResolvedTheme);
      return () => mediaQuery.removeEventListener('change', updateResolvedTheme);
    }
  }, [theme, mounted]);

  const value = {
    theme,
    setTheme,
    resolvedTheme,
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <ThemeContext.Provider value={value}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}