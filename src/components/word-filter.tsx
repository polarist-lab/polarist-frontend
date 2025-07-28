'use client';

import { useState } from 'react';
import { getAllCategories, getAllDifficulties, getRandomWordSet } from '@/data/expanded-korean-words';
import { KoreanWord, Category, Difficulty } from '@/lib/types';
import { useTranslations } from '@/lib/i18n';
import { useParams } from 'next/navigation';
import { Locale } from '@/lib/i18n/config';

interface WordFilterProps {
  onWordsChange: (words: KoreanWord[]) => void;
  className?: string;
}

export default function WordFilter({ onWordsChange, className = '' }: WordFilterProps) {
  const params = useParams();
  const locale = params.locale as Locale;
  const { t } = useTranslations(locale);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(['absolute-beginner', 'beginner']);
  const [wordCount, setWordCount] = useState(20);
  const [minFrequency, setMinFrequency] = useState(30);

  const categories = getAllCategories();
  const difficulties = getAllDifficulties();

  const getCategoryLabel = (category: string): string => {
    const categoryKey = category.replace('-', '') as keyof typeof t.categories;
    return t(`categories.${categoryKey}`) || category;
  };

  const getDifficultyLabel = (difficulty: string): string => {
    // Map difficulty keys properly
    const keyMap: Record<string, string> = {
      'absolute-beginner': 'absoluteBeginner',
      'upper-intermediate': 'upperIntermediate',
      'beginner': 'beginner',
      'intermediate': 'intermediate',
      'advanced': 'advanced',  
      'expert': 'expert'
    };
    const mappedKey = keyMap[difficulty] || difficulty;
    return t(`difficulty.${mappedKey}`) || difficulty;
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleDifficultyChange = (difficulty: string) => {
    setSelectedDifficulties(prev => 
      prev.includes(difficulty)
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const handleQuickSet = (count: number, preset?: { categories?: string[], difficulties?: string[] }) => {
    const categories = preset?.categories || selectedCategories;
    const difficulties = preset?.difficulties || selectedDifficulties;
    
    const words = getRandomWordSet(count, categories, difficulties, minFrequency);
    onWordsChange(words);
    setIsOpen(false);
  };

  const handleApplyFilter = () => {
    const words = getRandomWordSet(wordCount, selectedCategories, selectedDifficulties, minFrequency);
    onWordsChange(words);
    setIsOpen(false);
  };

  const handleSaveWordbook = async () => {
    // Get current words and save as wordbook
    const words = getRandomWordSet(wordCount, selectedCategories, selectedDifficulties, minFrequency);
    
    // For now, just show a simple prompt (we'll improve this UI later)
    const name = prompt(t('wordFilter.wordbookNamePrompt'));
    if (!name) return;
    
    const description = prompt(t('wordFilter.wordbookDescPrompt')) || '';
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        alert(t('auth.loginRequired'));
        return;
      }

      const response = await fetch('http://localhost:4000/api/wordbooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          description,
          wordIds: words.map(w => w.id),
          categories: selectedCategories,
          difficulties: selectedDifficulties
        })
      });

      if (response.ok) {
        alert(t('wordFilter.wordbookSaved'));
        onWordsChange(words);
        setIsOpen(false);
      } else {
        alert(t('wordFilter.wordbookSaveFailed'));
      }
    } catch (error) {
      console.error('Error saving wordbook:', error);
      alert(t('wordFilter.wordbookSaveError'));
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:opacity-80 cursor-pointer transition-all duration-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
        </svg>
        {t('wordFilter.wordSelection')}
      </button>

      {/* Quick Action Buttons */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => handleQuickSet(10, { difficulties: ['absolute-beginner', 'beginner'] })}
          className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 hover:opacity-80 cursor-pointer transition-all duration-200"
        >
          {t('wordFilter.easy10')}
        </button>
        <button
          onClick={() => handleQuickSet(50)}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 hover:opacity-80 cursor-pointer transition-all duration-200"
        >
          {t('wordFilter.select50')}
        </button>
        <button
          onClick={() => handleQuickSet(100)}
          className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 hover:opacity-80 cursor-pointer transition-all duration-200"
        >
          {t('wordFilter.select100')}
        </button>
      </div>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
          <div className="space-y-4">
            {/* Word Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('wordFilter.wordCount', { count: wordCount })}
              </label>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Difficulty Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('wordFilter.difficultySelection')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {difficulties.map(difficulty => (
                  <label key={difficulty} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedDifficulties.includes(difficulty)}
                      onChange={() => handleDifficultyChange(difficulty)}
                      className="rounded"
                    />
                    <span>{getDifficultyLabel(difficulty)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('wordFilter.categoryOptional')}
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {categories.map(category => (
                  <label key={category} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="rounded"
                    />
                    <span>{getCategoryLabel(category)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Frequency Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('wordFilter.minFrequency', { frequency: minFrequency })}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={minFrequency}
                onChange={(e) => setMinFrequency(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{t('wordFilter.allWords')}</span>
                <span>{t('wordFilter.frequentlyUsed')}</span>
              </div>
            </div>

            {/* Apply Buttons */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={handleApplyFilter}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 hover:opacity-80 cursor-pointer transition-all duration-200"
                >
                  {t('wordFilter.apply')}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 hover:opacity-80 cursor-pointer transition-all duration-200"
                >
                  {t('wordFilter.close')}
                </button>
              </div>
              
              <button
                onClick={handleSaveWordbook}
                className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 hover:opacity-80 cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {t('wordFilter.saveCustomWordbook')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}