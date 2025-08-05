'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Locale, isValidLocale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';
import { WORDBOOK_PRESETS, DIFFICULTY_GROUPS, WordbookPreset } from '@/data/wordbook-presets';
import { THEMED_WORDBOOK_PRESETS, THEMED_WORDBOOK_CATEGORIES, ThemedWordbookPreset } from '@/data/themed-wordbook-presets';
import VocabularyCard from '@/components/study/vocabulary-card';
import EnhancedVocabularyCard from '@/components/study/enhanced-vocabulary-card';

export default function VocabularyPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params?.locale as string;
  const validLocale: Locale = isValidLocale(locale) ? locale : 'en';
  const { t } = useTranslations(validLocale);

  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Korean high-frequency dataset as featured wordbook (legacy format for compatibility)
  const koreanDatasetWordbook: WordbookPreset = {
    id: 'korean-high-frequency',
    titleKey: 'wordbooks.koreanHighFrequency',
    descriptionKey: 'wordbooks.koreanHighFrequencyDesc',
    icon: '🇰🇷',
    color: 'bg-gradient-to-br from-blue-500 to-purple-600',
    difficulties: ['absolute-beginner', 'beginner'],
    wordCount: 200,
    minFrequency: 100,
  };

  // Featured themed wordbook - Fruits
  const featuredThemedWordbook = THEMED_WORDBOOK_PRESETS.find(preset => preset.featured) || THEMED_WORDBOOK_PRESETS[0];

  // Filter themed wordbooks based on category, difficulty and search
  const getFilteredThemedWordbooks = () => {
    let filtered = THEMED_WORDBOOK_PRESETS;
    
    if (selectedCategory !== 'all') {
      const categoryGroup = THEMED_WORDBOOK_CATEGORIES.find(group => group.id === selectedCategory);
      if (categoryGroup) {
        filtered = categoryGroup.presets;
      }
    }
    
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(preset => {
        // Check if the wordbook has words in the selected difficulty level
        const difficultyKey = selectedDifficulty.replace('-group', '') as keyof typeof preset.difficultyBreakdown;
        return preset.difficultyBreakdown[difficultyKey] > 0;
      });
    }
    
    if (searchQuery) {
      filtered = filtered.filter(preset => 
        t(preset.titleKey).toLowerCase().includes(searchQuery.toLowerCase()) ||
        t(preset.descriptionKey).toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const handleWordbookSelect = (wordbook: WordbookPreset) => {
    if (wordbook.id === 'korean-high-frequency') {
      // Navigate to words page without wordbook parameter to use Korean dataset
      router.push(`/${validLocale}/study/words`);
    } else {
      // Navigate with wordbook parameter
      router.push(`/${validLocale}/study/words?wordbook=${wordbook.id}`);
    }
  };

  const handleThemedWordbookSelect = (wordbook: ThemedWordbookPreset, selectedDifficulties?: string[]) => {
    let url = `/${validLocale}/study/words?theme=${wordbook.id}`;
    if (selectedDifficulties && selectedDifficulties.length > 0) {
      url += `&difficulties=${selectedDifficulties.join(',')}`;
    }
    router.push(url);
  };

  const handleBackToStudy = () => {
    router.push(`/${validLocale}/study`);
  };

  const filteredThemedWordbooks = getFilteredThemedWordbooks();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBackToStudy}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Study Center
            </button>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              📖 Choose Your Vocabulary
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Select a themed wordbook to start learning Korean vocabulary with interactive flashcards
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search wordbooks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="md:w-64">
            <select
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="beginner-group">Beginner Level</option>
              <option value="intermediate-group">Intermediate Level</option>
              <option value="advanced-group">Advanced Level</option>
            </select>
          </div>
        </div>

        {/* Featured Wordbook - Korean High-Frequency */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            ⭐ Featured Collection
          </h2>
          <div className="max-w-lg mx-auto md:mx-0">
            <VocabularyCard
              wordbook={koreanDatasetWordbook}
              onSelect={handleWordbookSelect}
              featured={true}
            />
          </div>
        </div>

        {/* Regular Wordbooks */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            📚 All Wordbooks
          </h2>
          
          {filteredThemedWordbooks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📖</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No wordbooks found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredThemedWordbooks.map((wordbook) => (
                <EnhancedVocabularyCard
                  key={wordbook.id}
                  wordbook={wordbook}
                  onSelect={handleThemedWordbookSelect}
                  locale={validLocale}
                />
              ))}
            </div>
          )}
        </div>

        {/* Study Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📊 Learning Progress
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Wordbooks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">1,247</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Words Learned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">85%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Average Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">23</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Study Streak (days)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}