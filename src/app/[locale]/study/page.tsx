'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Locale, isValidLocale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';

interface StudyCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  comingSoon?: boolean;
  progress?: number;
}

export default function StudyPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params?.locale as string;
  const validLocale: Locale = isValidLocale(locale) ? locale : 'en';
  const { t } = useTranslations(validLocale);

  const studyCategories: StudyCategory[] = [
    {
      id: 'roadmap',
      title: 'Learning Roadmap',
      description: 'Structured learning path with Iron 5 and progressive lessons',
      icon: '🗺️',
      href: `/${validLocale}/iron5`,
      progress: 25
    },
    {
      id: 'words',
      title: 'Vocabulary',
      description: 'Learn Korean words with interactive flashcards',
      icon: '📖',
      href: `/${validLocale}/study/words`,
      progress: 60
    },
    {
      id: 'sentences',
      title: 'Sentences',
      description: 'Practice with real Korean sentences and contexts',
      icon: '💬',
      href: `/${validLocale}/study/sentences`,
      comingSoon: true
    },
    {
      id: 'grammar',
      title: 'Grammar',
      description: 'Master Korean grammar patterns and structures',
      icon: '📝',
      href: `/${validLocale}/study/grammar`,
      comingSoon: true
    }
  ];

  const handleCategoryClick = (category: StudyCategory) => {
    if (category.comingSoon) {
      return; // Do nothing for coming soon categories
    }
    router.push(category.href);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Study Center
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose your learning path and start mastering Korean
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {studyCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className={`
                relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700
                transition-all duration-200 hover:shadow-md hover:-translate-y-1
                ${category.comingSoon 
                  ? 'opacity-75 cursor-not-allowed' 
                  : 'cursor-pointer hover:border-blue-300 dark:hover:border-blue-600'
                }
              `}
            >
              {/* Coming Soon Badge */}
              {category.comingSoon && (
                <div className="absolute top-3 right-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-medium px-2 py-1 rounded-full">
                  Coming Soon
                </div>
              )}

              <div className="p-6">
                {/* Icon */}
                <div className="text-4xl mb-4">
                  {category.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {category.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {category.description}
                </p>

                {/* Progress Bar */}
                {category.progress !== undefined && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Progress
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {category.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${category.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="flex items-center justify-between">
                  <span className={`
                    text-sm font-medium
                    ${category.comingSoon 
                      ? 'text-gray-400 dark:text-gray-500' 
                      : 'text-blue-600 dark:text-blue-400'
                    }
                  `}>
                    {category.comingSoon ? 'Coming Soon' : 'Start Learning'}
                  </span>
                  {!category.comingSoon && (
                    <svg 
                      className="w-5 h-5 text-blue-600 dark:text-blue-400 transition-transform group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Your Learning Stats
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">127</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Words Learned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">8</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Days Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">2</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Chapters Done</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">45m</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Study Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}