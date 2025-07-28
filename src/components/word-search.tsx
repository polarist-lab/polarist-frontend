'use client';

import { useState, useEffect, useRef } from 'react';
import { KoreanWord } from '@/lib/types';
import { searchWords } from '@/data/expanded-korean-words';
import { useTranslations } from '@/lib/i18n';
import { useParams } from 'next/navigation';
import { Locale } from '@/lib/i18n/config';

interface WordSearchProps {
  onSelectWord: (word: KoreanWord) => void;
  onSelectAll: (words: KoreanWord[]) => void;
  placeholder?: string;
  className?: string;
}

export default function WordSearch({ 
  onSelectWord, 
  onSelectAll, 
  placeholder,
  className = ""
}: WordSearchProps) {
  const params = useParams();
  const locale = params.locale as Locale;
  const { t } = useTranslations(locale);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<KoreanWord[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length > 0) {
        const results = searchWords(query);
        setSearchResults(results.slice(0, 10)); // Limit to 10 results for performance
        setIsOpen(true);
        setSelectedIndex(-1);
      } else {
        setSearchResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          handleSelectWord(searchResults[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelectWord = (word: KoreanWord) => {
    onSelectWord(word);
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleSelectAll = () => {
    onSelectAll(searchResults);
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 rounded px-1">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg 
            className="w-5 h-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || t('wordSearch.placeholder')}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 hover:opacity-80 cursor-text transition-all duration-200"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:opacity-80 cursor-pointer transition-all duration-200"
          >
            <svg 
              className="w-5 h-5 text-gray-400 hover:text-gray-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto z-50">
          {/* Select All Option */}
          <div className="p-2 border-b border-gray-100">
            <button
              onClick={handleSelectAll}
              className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 hover:opacity-80 cursor-pointer transition-all duration-200 rounded-md font-medium"
            >
{t('wordSearch.useAllResults', { count: searchResults.length })}
            </button>
          </div>

          {/* Individual Results */}
          <div className="py-2">
            {searchResults.map((word, index) => (
              <button
                key={word.id}
                onClick={() => handleSelectWord(word)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 hover:opacity-80 cursor-pointer transition-all duration-200 border-l-4 ${
                  selectedIndex === index 
                    ? 'bg-blue-50 border-blue-500' 
                    : 'border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="korean-text text-lg font-semibold text-gray-900">
                      {highlightMatch(word.korean, query)}
                    </div>
                    <div className="text-sm text-gray-500 font-mono">
                      [{highlightMatch(word.pronunciation, query)}]
                    </div>
                    <div className="text-sm text-gray-700 mt-1">
                      {highlightMatch(word.english, query)}
                    </div>
                  </div>
                  <div className="flex flex-col items-end text-xs text-gray-400 ml-4">
                    <span className="capitalize bg-gray-100 px-2 py-1 rounded-full">
                      {word.category}
                    </span>
                    <span className="mt-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {word.difficulty}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results Message */}
      {isOpen && query.trim().length > 0 && searchResults.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
          <div className="text-center text-gray-500">
            <div className="text-2xl mb-2">🔍</div>
            <div className="text-sm" dangerouslySetInnerHTML={{
              __html: t('wordSearch.noResults', { query })
            }}>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {t('wordSearch.searchInstructions')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}