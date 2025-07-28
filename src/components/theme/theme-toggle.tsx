'use client';

import { useTheme } from './theme-provider';
import { useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
        aria-label="Toggle theme"
      >
        {resolvedTheme === 'dark' ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
        <span className="hidden sm:inline">
          {theme === 'system' ? 'System' : theme === 'dark' ? 'Dark' : 'Light'}
        </span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 bottom-full mb-2 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
          <button
            onClick={() => handleThemeChange('light')}
            className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
              theme === 'light' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Light
          </button>
          
          <button
            onClick={() => handleThemeChange('dark')}
            className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
              theme === 'dark' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            Dark
          </button>
          
          <button
            onClick={() => handleThemeChange('system')}
            className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
              theme === 'system' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            System
          </button>
        </div>
      )}
    </div>
  );
}