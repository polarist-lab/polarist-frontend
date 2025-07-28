'use client';

import { PostCategory } from '@/lib/community/types';
import { Locale } from '@/lib/i18n/config';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange?: (category: string) => void;
  locale: Locale;
}

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  locale
}: CategoryFilterProps) {
  const categories = [
    {
      id: 'all',
      label: { ko: '전체', en: 'All' },
      icon: '📚',
      color: 'bg-gray-100 text-gray-800'
    },
    {
      id: 'grammar',
      label: { ko: '문법', en: 'Grammar' },
      icon: '📝',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'vocabulary',
      label: { ko: '어휘', en: 'Vocabulary' },
      icon: '💭',
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'pronunciation',
      label: { ko: '발음', en: 'Pronunciation' },
      icon: '🗣️',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'culture',
      label: { ko: '문화', en: 'Culture' },
      icon: '🎭',
      color: 'bg-pink-100 text-pink-800'
    },
    {
      id: 'exam',
      label: { ko: '시험', en: 'Exam Prep' },
      icon: '📋',
      color: 'bg-orange-100 text-orange-800'
    },
    {
      id: 'conversation',
      label: { ko: '회화', en: 'Conversation' },
      icon: '💬',
      color: 'bg-indigo-100 text-indigo-800'
    },
    {
      id: 'writing',
      label: { ko: '쓰기', en: 'Writing' },
      icon: '✍️',
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 'listening',
      label: { ko: '듣기', en: 'Listening' },
      icon: '👂',
      color: 'bg-teal-100 text-teal-800'
    },
    {
      id: 'reading',
      label: { ko: '읽기', en: 'Reading' },
      icon: '📖',
      color: 'bg-cyan-100 text-cyan-800'
    },
    {
      id: 'general',
      label: { ko: '일반', en: 'General' },
      icon: '🌟',
      color: 'bg-gray-100 text-gray-800'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-3">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange?.(category.id as PostCategory | 'all')}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              selectedCategory === category.id
                ? `${category.color} ring-2 ring-blue-300 shadow-sm`
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="text-base">{category.icon}</span>
            <span>{category.label[locale]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}