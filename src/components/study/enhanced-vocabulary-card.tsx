'use client';

import { useState } from 'react';
import { ThemedWordbookPreset, getDifficultyStats } from '@/data/themed-wordbook-presets';
import { useTranslations } from '@/lib/i18n';
import { Locale } from '@/lib/i18n/config';
import { Difficulty } from '@/lib/types';

interface EnhancedVocabularyCardProps {
  wordbook: ThemedWordbookPreset;
  onSelect: (wordbook: ThemedWordbookPreset, selectedDifficulties?: Difficulty[]) => void;
  featured?: boolean;
  locale?: Locale;
}

export default function EnhancedVocabularyCard({ 
  wordbook, 
  onSelect, 
  featured = false, 
  locale = 'en' 
}: EnhancedVocabularyCardProps) {
  const { t } = useTranslations(locale);
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const difficultyStats = getDifficultyStats(wordbook);

  const getDifficultyColor = (difficulty: Difficulty) => {
    const colors = {
      'absolute-beginner': 'bg-green-500 text-white',
      'beginner': 'bg-blue-500 text-white',
      'intermediate': 'bg-yellow-500 text-white',
      'advanced': 'bg-purple-500 text-white'
    };
    return colors[difficulty] || 'bg-gray-500 text-white';
  };

  const getSelectedWordCount = () => {
    if (selectedDifficulties.length === 0) return wordbook.totalWords;
    return selectedDifficulties.reduce((total, difficulty) => {
      return total + (wordbook.difficultyBreakdown[difficulty] || 0);
    }, 0);
  };

  const handleDifficultyToggle = (difficulty: Difficulty) => {
    setSelectedDifficulties(prev => {
      if (prev.includes(difficulty)) {
        return prev.filter(d => d !== difficulty);
      } else {
        return [...prev, difficulty];
      }
    });
  };

  const handleStartLearning = () => {
    const difficulties = selectedDifficulties.length > 0 ? selectedDifficulties : undefined;
    onSelect(wordbook, difficulties);
  };

  const getRecommendedPath = () => {
    const beginner = wordbook.difficultyBreakdown['absolute-beginner'];
    const intermediate = wordbook.difficultyBreakdown['beginner'];
    
    if (beginner > 0) return 'Start with basics';
    if (intermediate > 0) return 'Good for beginners';
    return 'Advanced learners';
  };

  return (
    <div 
      className={`
        group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700
        transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer
        ${featured ? 'ring-2 ring-blue-500 dark:ring-blue-400' : 'hover:border-blue-300 dark:hover:border-blue-600'}
      `}
      onClick={(e) => {
        // Only handle card click if not interacting with filters or buttons
        if (!(e.target as HTMLElement).closest('button') && !(e.target as HTMLElement).closest('[role="button"]')) {
          handleStartLearning();
        }
      }}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          ⭐ Featured
        </div>
      )}

      <div className="p-6">
        {/* Header with Icon and Theme */}
        <div className="flex items-start justify-between mb-4">
          <div className={`
            ${featured ? 'text-5xl' : 'text-4xl'} 
            transition-transform duration-300 group-hover:scale-110
          `}>
            {wordbook.icon}
          </div>
          <div className="text-right">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              {t(`categories.${wordbook.category}`)}
            </span>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {getRecommendedPath()}
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className={`
          ${featured ? 'text-xl' : 'text-lg'} 
          font-bold text-gray-900 dark:text-white mb-2 line-clamp-2
        `}>
          {t(wordbook.titleKey)}
        </h3>

        {/* Description */}
        <div className="text-gray-600 dark:text-gray-400 text-sm mb-4 h-[60px] overflow-hidden">
          <p className="line-clamp-3">
            {t(wordbook.descriptionKey)}
          </p>
        </div>

        {/* Word Count Summary */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {getSelectedWordCount()}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {selectedDifficulties.length > 0 ? 'Selected' : 'Total'} Words
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {wordbook.minFrequency}+
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Min Frequency</div>
            </div>
          </div>
          
          {/* Progress (mock data for now) */}
          <div className="text-right">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {Math.floor(Math.random() * 100)}%
            </div>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Difficulty Levels:
            </h4>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowFilters(!showFilters);
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {difficultyStats.map(({ difficulty, count, percentage }) => (
              <div
                key={difficulty}
                onClick={(e) => {
                  e.stopPropagation();
                  if (showFilters) handleDifficultyToggle(difficulty);
                }}
                className={`
                  text-center p-2 rounded-lg transition-all cursor-pointer
                  ${showFilters ? (
                    selectedDifficulties.includes(difficulty) 
                      ? getDifficultyColor(difficulty)
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  ) : 'bg-gray-50 dark:bg-gray-700'}
                  ${showFilters ? 'hover:scale-105' : ''}
                `}
              >
                <div className="text-sm font-bold">{count}</div>
                <div className="text-xs">
                  {difficulty === 'absolute-beginner' ? 'Abs. Beg.' : 
                   difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </div>
                <div className="text-xs opacity-75">{percentage}%</div>
              </div>
            ))}
          </div>

          {selectedDifficulties.length > 0 && (
            <div className="mt-2 text-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDifficulties([]);
                }}
                className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Learning Path Suggestion */}
        {!showFilters && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">
              💡 Recommended Learning Path:
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-300">
              {wordbook.difficultyBreakdown['absolute-beginner'] > 0 && 
                `Start with ${wordbook.difficultyBreakdown['absolute-beginner']} basic words → `}
              {wordbook.difficultyBreakdown['beginner'] > 0 && 
                `Learn ${wordbook.difficultyBreakdown['beginner']} beginner words → `}
              {wordbook.difficultyBreakdown['intermediate'] > 0 && 
                `Master ${wordbook.difficultyBreakdown['intermediate']} intermediate words`}
            </div>
          </div>
        )}

      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}