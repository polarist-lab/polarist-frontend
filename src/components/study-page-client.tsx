'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Flashcard } from '@/components/flashcard';
import { CardDeck } from '@/components/card-deck';
import WordFilter from '@/components/word-filter';
import WordSearch from '@/components/word-search';
import { getRandomWordSet } from '@/data/expanded-korean-words';
import { KoreanWord } from '@/lib/types';
import { Locale, isValidLocale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';
import { WORDBOOK_PRESETS } from '@/data/wordbook-presets';

export default function StudyPageClient() {
  const params = useParams();
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
    setWordbookTitle(t('wordbooks.beginner'));
    setMounted(true);
  }, [mounted, t]);

  const handleWordsChange = (newWords: KoreanWord[]) => {
    setWords(newWords);
    setCurrentIndex(0); // Reset to first card
    setShowFullInfo(false); // Reset card flip state
    setWordbookTitle(t('wordbooks.createCustom'));
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md mx-auto space-y-4">
        {/* Wordbook Title */}
        {wordbookTitle && (
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-800 mb-2">
              {wordbookTitle}
            </h1>
          </div>
        )}
        
        {/* Word Search */}
        <WordSearch 
          onSelectWord={handleSelectWord}
          onSelectAll={handleSelectAllSearchResults}
          className="mb-4"
        />
        
        {/* Word Filter */}
        <WordFilter onWordsChange={handleWordsChange} className="mb-4" />
        
        {/* Word Count Display */}
        {words.length > 0 && (
          <div className="text-center text-sm text-gray-600">
            {t('common.totalWordsCount', { count: words.length, current: currentIndex + 1, total: words.length })}
          </div>
        )}
        
        {/* Card Deck */}
        <CardDeck 
          words={words} 
          currentIndex={currentIndex}
          onCardClick={handleToggle}
          onNext={handleNext}
          onPrevious={handlePrevious}
          showFullInfo={showFullInfo}
          locale={validLocale}
        />
        
        {/* Back to Wordbooks Button */}
        <div className="text-center pt-4">
          <button
            onClick={() => window.location.href = `/${validLocale}`}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium underline"
          >
            ← {t('wordbooks.selectWordbook')}
          </button>
        </div>
      </div>
    </div>
  );
}