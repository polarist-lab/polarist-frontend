'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from '@/lib/i18n';
import { Locale } from '@/lib/i18n/config';
import { WORDBOOK_PRESETS, DIFFICULTY_GROUPS, WordbookPreset } from '@/data/wordbook-presets';
import { getRandomWordSet } from '@/data/expanded-korean-words';

interface WordbookSelectionProps {
  onSelectWordbook: (words: any[]) => void;
}

export default function WordbookSelection({ onSelectWordbook }: WordbookSelectionProps) {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as Locale;
  const { t } = useTranslations(locale);
  const [selectedView, setSelectedView] = useState<'all' | 'difficulty'>('all');

  // Helper function to map difficulty keys to translation keys
  const getDifficultyTranslationKey = (difficulty: string): string => {
    const keyMap: Record<string, string> = {
      'absolute-beginner': 'absoluteBeginner',
      'upper-intermediate': 'upperIntermediate',
      'beginner': 'beginner',
      'intermediate': 'intermediate',
      'advanced': 'advanced',
      'expert': 'expert'
    };
    return keyMap[difficulty] || difficulty;
  };

  const handleWordbookSelect = (preset: WordbookPreset) => {
    // 단어장 설정에 따라 단어들을 가져옴
    const words = getRandomWordSet(
      preset.wordCount,
      preset.categories || [],
      preset.difficulties,
      preset.minFrequency
    );
    
    // 단어 학습 페이지로 이동
    router.push(`/${locale}/study?wordbook=${preset.id}`);
  };

  const WordbookCard = ({ preset }: { preset: WordbookPreset }) => (
    <button
      onClick={() => handleWordbookSelect(preset)}
      className="group relative overflow-hidden rounded-xl bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 p-6 text-left w-full hover:scale-105"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`${preset.color} text-white rounded-full w-12 h-12 flex items-center justify-center text-xl shrink-0`}>
          {preset.icon}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-gray-700">
            {t(preset.titleKey)}
          </h3>
          <p className="text-gray-600 text-sm mb-3 leading-relaxed">
            {t(preset.descriptionKey)}
          </p>
          
          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {preset.wordCount} {t('common.words')}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {preset.difficulties.map(d => t(`difficulty.${getDifficultyTranslationKey(d)}`)).join(', ')}
            </span>
          </div>
        </div>

        {/* Arrow Icon */}
        <div className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('wordbooks.selectWordbook')}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t('wordbooks.selectWordbookDesc')}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setSelectedView('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedView === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('wordbooks.allWordbooks')}
            </button>
            <button
              onClick={() => setSelectedView('difficulty')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedView === 'difficulty'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('wordbooks.byDifficulty')}
            </button>
          </div>
        </div>

        {/* Content */}
        {selectedView === 'all' ? (
          // All Wordbooks View
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WORDBOOK_PRESETS.map((preset) => (
              <WordbookCard key={preset.id} preset={preset} />
            ))}
          </div>
        ) : (
          // Difficulty Groups View
          <div className="space-y-8">
            {DIFFICULTY_GROUPS.map((group) => (
              <div key={group.id}>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                  {t(group.titleKey)}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.presets.map((preset) => (
                    <WordbookCard key={preset.id} preset={preset} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Custom Wordbook Option */}
        <div className="mt-12 text-center">
          <div className="border-t border-gray-200 pt-8">
            <button
              onClick={() => router.push(`/${locale}/study`)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t('wordbooks.createCustom')}
            </button>
            <p className="text-sm text-gray-500 mt-2">
              {t('wordbooks.createCustomDesc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}