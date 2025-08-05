'use client';

import { KoreanSentence } from '@/lib/types';
import { useTranslations } from '@/lib/i18n';
import { Locale } from '@/lib/i18n/config';

interface SentenceCardProps {
  sentence: KoreanSentence;
  onSelect: (sentence: KoreanSentence) => void;
  featured?: boolean;
  locale?: Locale;
}

export default function SentenceCard({ sentence, onSelect, featured = false, locale = 'en' }: SentenceCardProps) {
  const { t } = useTranslations(locale);

  const getDifficultyBadge = () => {
    const difficulty = sentence.difficulty;
    if (difficulty === 'absolute-beginner') {
      return { text: 'Absolute Beginner', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
    } else if (difficulty === 'beginner') {
      return { text: 'Beginner', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
    } else if (difficulty === 'intermediate') {
      return { text: 'Intermediate', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' };
    } else if (difficulty === 'advanced') {
      return { text: 'Advanced', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' };
    }
    return { text: 'Mixed', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' };
  };

  const difficultyBadge = getDifficultyBadge();

  return (
    <div
      onClick={() => onSelect(sentence)}
      className={`
        group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700
        transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer
        ${featured ? 'ring-2 ring-green-500 dark:ring-green-400' : 'hover:border-green-300 dark:hover:border-green-600'}
      `}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          ⭐ Featured
        </div>
      )}

      <div className="p-6">
        {/* Header with Icon and Difficulty */}
        <div className="flex items-start justify-between mb-4">
          <div className={`
            ${featured ? 'text-5xl' : 'text-4xl'} 
            transition-transform duration-300 group-hover:scale-110
          `}>
            💬
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyBadge.color}`}>
            {difficultyBadge.text}
          </span>
        </div>

        {/* Korean Sentence Preview */}
        <h3 className={`
          ${featured ? 'text-xl' : 'text-lg'} 
          font-bold text-gray-900 dark:text-white mb-2 line-clamp-2
        `}>
          {sentence.korean}
        </h3>

        {/* English Translation */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {sentence.english}
        </p>

        {/* Pronunciation */}
        {sentence.pronunciation && (
          <p className="text-blue-600 dark:text-blue-400 text-xs mb-4 font-mono">
            [{sentence.pronunciation}]
          </p>
        )}

        {/* Grammar Tags */}
        {sentence.grammar && sentence.grammar.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {sentence.grammar.slice(0, 3).map((grammar) => (
                <span
                  key={grammar}
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200"
                >
                  {grammar}
                </span>
              ))}
              {sentence.grammar.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200">
                  +{sentence.grammar.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {sentence.vocabulary?.length || 0}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Vocab Words</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {sentence.category}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Category</div>
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

        {/* Action */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-green-600 dark:text-green-400">
            Practice Sentence
          </span>
          <svg 
            className="w-5 h-5 text-green-600 dark:text-green-400 transition-transform duration-300 group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-emerald-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}