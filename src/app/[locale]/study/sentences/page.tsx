'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Locale, isValidLocale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';
import { SENTENCE_COLLECTION_PRESETS, SENTENCE_DIFFICULTY_GROUPS, SentenceCollectionPreset } from '@/data/sentence-collection-presets';
import SentenceCard from '@/components/study/sentence-card';

export default function SentencesPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params?.locale as string;
  const validLocale: Locale = isValidLocale(locale) ? locale : 'en';
  const { t } = useTranslations(validLocale);

  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Featured sentence collection - Greetings Basic
  const featuredCollection = SENTENCE_COLLECTION_PRESETS.find(preset => preset.id === 'greetings-basic')!;

  // Convert to sentence format for SentenceCard
  const featuredSentence = {
    id: 1,
    korean: '안녕하세요',
    english: 'Essential Korean greetings and polite expressions',
    pronunciation: 'an-nyeong-ha-se-yo',
    grammar: ['honorifics', 'greetings'],
    vocabulary: [],
    difficulty: featuredCollection.difficulty,
    category: featuredCollection.category,
    notes: 'Perfect starting point for Korean conversation'
  };

  // Filter sentence collections based on difficulty and search
  const getFilteredCollections = () => {
    let filtered = SENTENCE_COLLECTION_PRESETS;
    
    if (selectedDifficulty !== 'all') {
      const difficultyGroup = SENTENCE_DIFFICULTY_GROUPS.find(group => group.id === selectedDifficulty);
      if (difficultyGroup) {
        filtered = difficultyGroup.presets;
      }
    }
    
    if (searchQuery) {
      filtered = filtered.filter(preset => 
        t(preset.titleKey).toLowerCase().includes(searchQuery.toLowerCase()) ||
        t(preset.descriptionKey).toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const handleCollectionSelect = (collection: SentenceCollectionPreset) => {
    // Navigate to sentences learning page
    router.push(`/${validLocale}/study/sentences/${collection.id}`);
  };

  const handleFeaturedSelect = () => {
    router.push(`/${validLocale}/study/sentences/${featuredCollection.id}`);
  };

  const handleBackToStudy = () => {
    router.push(`/${validLocale}/study`);
  };

  const filteredCollections = getFilteredCollections();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBackToStudy}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Study Center
            </button>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              💬 Choose Your Sentences
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Practice Korean conversation with real sentence patterns and natural expressions
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
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Search sentence collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="md:w-64">
            <select
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="beginner-sentences">Beginner Level</option>
              <option value="intermediate-sentences">Intermediate Level</option>
              <option value="advanced-sentences">Advanced Level</option>
            </select>
          </div>
        </div>

        {/* Featured Collection - Greetings Basic */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            ⭐ Featured Collection
          </h2>
          <div className="max-w-lg mx-auto md:mx-0">
            <SentenceCard
              sentence={featuredSentence}
              onSelect={handleFeaturedSelect}
              featured={true}
            />
          </div>
        </div>

        {/* Regular Collections */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            📚 All Sentence Collections
          </h2>
          
          {filteredCollections.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">💬</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No collections found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCollections.map((collection) => {
                // Convert collection to sentence format for SentenceCard
                const collectionAsSentence = {
                  id: parseInt(collection.id.split('-')[0]) || 1,
                  korean: t(collection.titleKey),
                  english: t(collection.descriptionKey),
                  grammar: collection.grammarFocus,
                  vocabulary: [],
                  difficulty: collection.difficulty,
                  category: collection.category,
                  notes: `${collection.sentenceCount} sentences • ${collection.vocabularyLevel} level`
                };

                return (
                  <SentenceCard
                    key={collection.id}
                    sentence={collectionAsSentence}
                    onSelect={() => handleCollectionSelect(collection)}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Study Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📊 Sentence Learning Progress
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">8</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Collections Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">156</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Sentences Practiced</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">92%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Average Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">15</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Grammar Points</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}