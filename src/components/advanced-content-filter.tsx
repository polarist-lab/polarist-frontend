'use client';

import { useState, useEffect } from 'react';
import { ContentType, AuthorType, Difficulty, Category, ContentFilter } from '@/lib/types';
import { LearningTracker } from '@/lib/learning-tracker';
import { Locale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';

interface AdvancedContentFilterProps {
  initialFilter?: ContentFilter;
  onFilterChange: (filter: ContentFilter) => void;
  locale: Locale;
  className?: string;
}

export function AdvancedContentFilter({ 
  initialFilter = {},
  onFilterChange, 
  locale, 
  className = '' 
}: AdvancedContentFilterProps) {
  const { t } = useTranslations(locale);
  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState<ContentFilter>(initialFilter);

  const availableContentTypes: ContentType[] = ['wordbook', 'sentence', 'roadmap'];
  const availableAuthorTypes: AuthorType[] = ['official', 'community', 'user'];
  const availableDifficulties: Difficulty[] = [
    'absolute-beginner', 'beginner', 'intermediate', 
    'upper-intermediate', 'advanced', 'expert'
  ];
  
  const availableCategories: Category[] = [
    'basic', 'food', 'family', 'colors', 'numbers', 'greetings', 'time', 'travel',
    'emotions', 'daily-life', 'grammar', 'body', 'clothing', 'technology', 'nature',
    'health', 'education', 'entertainment', 'business', 'sports', 'culture', 'cooking',
    'shopping', 'transportation', 'weather', 'hobbies', 'relationships', 'animals',
    'places', 'music', 'art'
  ];

  const sortOptions = [
    { value: 'difficulty', label: 'By Difficulty' },
    { value: 'alphabetical', label: 'Alphabetical' },
    { value: 'recent', label: 'Recently Updated' },
    { value: 'roadmap-order', label: 'Roadmap Order' },
    { value: 'popularity', label: 'Most Popular' }
  ];

  // Update parent when filter changes
  useEffect(() => {
    onFilterChange(filter);
  }, [filter, onFilterChange]);

  const updateFilter = <K extends keyof ContentFilter>(key: K, value: ContentFilter[K]) => {
    setFilter(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayValue = <T>(array: T[] | undefined, value: T): T[] => {
    const current = array || [];
    return current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
  };

  const clearAllFilters = () => {
    setFilter({});
  };

  const getActiveFilterCount = (): number => {
    let count = 0;
    if (filter.contentType && filter.contentType.length > 0) count++;
    if (filter.authorType && filter.authorType.length > 0) count++;
    if (filter.difficulty && filter.difficulty.length > 0) count++;
    if (filter.category && filter.category.length > 0) count++;
    if (filter.completionStatus) count++;
    if (filter.officialOnly) count++;
    if (filter.excludeCompleted) count++;
    if (filter.tags && filter.tags.length > 0) count++;
    if (filter.sortBy) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className={`advanced-content-filter ${className}`}>
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
          >
            <svg
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            🔍 Advanced Filters
          </button>
          
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {activeFilterCount} active
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="mt-4 p-6 bg-white rounded-lg border border-gray-200 space-y-6">
          {/* Quick Toggles */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => updateFilter('officialOnly', !filter.officialOnly)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter.officialOnly
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📋 Official Only
            </button>
            
            <button
              onClick={() => updateFilter('excludeCompleted', !filter.excludeCompleted)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter.excludeCompleted
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ✅ Hide Completed
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Content Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Content Type
              </label>
              <div className="space-y-2">
                {availableContentTypes.map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filter.contentType?.includes(type) || false}
                      onChange={() => updateFilter('contentType', 
                        toggleArrayValue(filter.contentType, type)
                      )}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700 capitalize flex items-center gap-2">
                      {type === 'wordbook' ? '📖' : type === 'sentence' ? '💬' : '🗺️'}
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Author Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Author Type
              </label>
              <div className="space-y-2">
                {availableAuthorTypes.map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filter.authorType?.includes(type) || false}
                      onChange={() => updateFilter('authorType', 
                        toggleArrayValue(filter.authorType, type)
                      )}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700 capitalize flex items-center gap-2">
                      {type === 'official' ? '🏢' : type === 'community' ? '👥' : '👤'}
                      {t(`content.${type}`)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Difficulty Level
              </label>
              <div className="space-y-2">
                {availableDifficulties.map(difficulty => (
                  <label key={difficulty} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filter.difficulty?.includes(difficulty) || false}
                      onChange={() => updateFilter('difficulty', 
                        toggleArrayValue(filter.difficulty, difficulty)
                      )}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700 flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        difficulty === 'absolute-beginner' ? 'bg-green-400' :
                        difficulty === 'beginner' ? 'bg-blue-400' :
                        difficulty === 'intermediate' ? 'bg-yellow-400' :
                        difficulty === 'upper-intermediate' ? 'bg-orange-400' :
                        difficulty === 'advanced' ? 'bg-red-400' : 'bg-purple-400'
                      }`} />
                      {t(`difficulty.${difficulty.replace('-', '').replace('_', '')}`)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Completion Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Completion Status
              </label>
              <div className="space-y-2">
                {(['completed', 'in-progress', 'not-started'] as const).map(status => (
                  <label key={status} className="flex items-center">
                    <input
                      type="radio"
                      name="completionStatus"
                      checked={filter.completionStatus === status}
                      onChange={() => updateFilter('completionStatus', status)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700 flex items-center gap-2">
                      {status === 'completed' ? '✅' : status === 'in-progress' ? '🔄' : '⭕'}
                      {t(`content.${status.replace('-', '')}`)}
                    </span>
                  </label>
                ))}
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="completionStatus"
                    checked={!filter.completionStatus}
                    onChange={() => updateFilter('completionStatus', undefined)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700">Show All</span>
                </label>
              </div>
            </div>
          </div>

          {/* Categories Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Categories
            </label>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-48 overflow-y-auto">
              {availableCategories.map(category => (
                <button
                  key={category}
                  onClick={() => updateFilter('category', 
                    toggleArrayValue(filter.category, category)
                  )}
                  className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                    filter.category?.includes(category)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            {filter.category && filter.category.length > 0 && (
              <div className="text-sm text-gray-500 mt-2">
                Selected: {filter.category.length} categories
              </div>
            )}
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Sort By
            </label>
            <select
              value={filter.sortBy || ''}
              onChange={(e) => updateFilter('sortBy', e.target.value as any || undefined)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Default Order</option>
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tags Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={filter.tags?.join(', ') || ''}
              onChange={(e) => {
                const tags = e.target.value
                  .split(',')
                  .map(tag => tag.trim().toLowerCase())
                  .filter(tag => tag.length > 0);
                updateFilter('tags', tags.length > 0 ? tags : undefined);
              }}
              placeholder="e.g., beginner, conversation, daily-life"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {!isExpanded && activeFilterCount > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {filter.contentType && filter.contentType.map(type => (
            <span key={type} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Type: {type}
              <button
                onClick={() => updateFilter('contentType', 
                  filter.contentType!.filter(t => t !== type)
                )}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >×</button>
            </span>
          ))}
          
          {filter.difficulty && filter.difficulty.map(diff => (
            <span key={diff} className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
              {diff}
              <button
                onClick={() => updateFilter('difficulty', 
                  filter.difficulty!.filter(d => d !== diff)
                )}
                className="ml-1 text-yellow-600 hover:text-yellow-800"
              >×</button>
            </span>
          ))}
          
          {filter.officialOnly && (
            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Official Only
              <button
                onClick={() => updateFilter('officialOnly', false)}
                className="ml-1 text-green-600 hover:text-green-800"
              >×</button>
            </span>
          )}
          
          {filter.excludeCompleted && (
            <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
              Hide Completed
              <button
                onClick={() => updateFilter('excludeCompleted', false)}
                className="ml-1 text-purple-600 hover:text-purple-800"
              >×</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}