'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Flashcard } from '@/components/flashcard';
import { CardDeck } from '@/components/card-deck';
import WordFilter from '@/components/word-filter';
import WordSearch from '@/components/word-search';
import { getRandomWordSet } from '@/data/expanded-korean-words';
import { KoreanWord } from '@/lib/types';
import { Locale, isValidLocale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';
import { WORDBOOK_PRESETS } from '@/data/wordbook-presets';

export default function WordsPageClient() {
  const params = useParams();
  const router = useRouter();
  const locale = params?.locale as string;
  const validLocale: Locale = isValidLocale(locale) ? locale : 'en';
  const { t } = useTranslations(validLocale);

  const [words, setWords] = useState<KoreanWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullInfo, setShowFullInfo] = useState(false);
  const [wordbookTitle, setWordbookTitle] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  // Initialize with words from selected wordbook or default
  useEffect(() => {
    if (mounted) return; // Prevent multiple initializations
    
    // Get wordbook ID from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const wordbookId = urlParams.get('wordbook');
    
    if (wordbookId) {
      // Load preset wordbook
      const preset = WORDBOOK_PRESETS.find(p => p.id === wordbookId);
      if (preset) {
        const wordbookWords = getRandomWordSet(
          preset.wordCount,
          preset.categories || [],
          preset.difficulties,
          preset.minFrequency
        );
        setWords(wordbookWords);
        setWordbookTitle(t(preset.titleKey));
        setMounted(true);
        return;
      }
    }
    
    // Default fallback
    const defaultWords = getRandomWordSet(20, [], ['absolute-beginner', 'beginner'], 50);
    setWords(defaultWords);
    setWordbookTitle('Vocabulary Practice');
    setMounted(true);
  }, [mounted, t]);

  const handleWordsChange = (newWords: KoreanWord[]) => {
    setWords(newWords);
    setCurrentIndex(0); // Reset to first card
    setShowFullInfo(false); // Reset card flip state
    setWordbookTitle('Custom Vocabulary');
  };

  const handleSelectWord = (word: KoreanWord) => {
    setWords([word]);
    setCurrentIndex(0);
    setShowFullInfo(false);
  };

  const handleSelectAllSearchResults = (words: KoreanWord[]) => {
    setWords(words);
    setCurrentIndex(0);
    setShowFullInfo(false);
  };

  const handleToggle = () => {
    setShowFullInfo(!showFullInfo);
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      // Keep current card flip state - don't reset showFullInfo
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      // Keep current card flip state - don't reset showFullInfo
    }
  };

  const handleBackToStudy = () => {
    router.push(`/${validLocale}/study`);
  };

  if (words.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 animate-pulse">
            <div className="space-y-6">
              <div className="h-4 bg-gray-200 rounded-full w-3/4 mx-auto"></div>
              <div className="h-12 bg-gray-200 rounded-lg"></div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded-full"></div>
                <div className="h-3 bg-gray-200 rounded-full w-5/6"></div>
              </div>
              <div className="flex justify-between pt-4">
                <div className="h-10 bg-gray-200 rounded-lg w-20"></div>
                <div className="h-10 bg-gray-200 rounded-lg w-20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={handleBackToStudy}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-2"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Study Center
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                📖 {wordbookTitle}
              </h1>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Card {currentIndex + 1} of {words.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Word Search */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Search Words
              </h3>
              <WordSearch 
                onSelectWord={handleSelectWord}
                onSelectAll={handleSelectAllSearchResults}
              />
            </div>
            
            {/* Word Filter */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Filter Words
              </h3>
              <WordFilter onWordsChange={handleWordsChange} />
            </div>

            {/* Study Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Session Stats
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total Words:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{words.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Current:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{currentIndex + 1}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Progress:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {Math.round(((currentIndex + 1) / words.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Center - Flashcard */}
          <div className="lg:col-span-2">
            <CardDeck 
              words={words} 
              currentIndex={currentIndex}
              onCardClick={handleToggle}
              onNext={handleNext}
              onPrevious={handlePrevious}
              showFullInfo={showFullInfo}
              locale={validLocale}
            />
          </div>
        </div>
      </div>
    </div>
  );
}