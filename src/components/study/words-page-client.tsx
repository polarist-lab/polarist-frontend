'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Flashcard } from '@/components/flashcard';
import { CardDeck } from '@/components/card-deck';
import WordFilter from '@/components/word-filter';
import WordSearch from '@/components/word-search';
import { getRandomWordSet } from '@/data/expanded-korean-words';
import { getRandomKoreanWordSet } from '@/data/korean-vocabulary-loader';
import { getThemedWordSet, isValidTheme } from '@/data/themed-wordbook-loader';
import { KoreanWord, Difficulty } from '@/lib/types';
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
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>([]);
  const [allWords, setAllWords] = useState<KoreanWord[]>([]);
  const [filteredWords, setFilteredWords] = useState<KoreanWord[]>([]);

  // Initialize with words from selected wordbook or default
  useEffect(() => {
    if (mounted) return; // Prevent multiple initializations
    
    // Get parameters from URL query
    const urlParams = new URLSearchParams(window.location.search);
    const wordbookId = urlParams.get('wordbook');
    const themeId = urlParams.get('theme');
    const difficultiesParam = urlParams.get('difficulties');
    
    const loadWords = async () => {
      // Check for theme-based wordbook first
      if (themeId && isValidTheme(themeId)) {
        try {
          const difficulties = difficultiesParam 
            ? difficultiesParam.split(',') as Difficulty[]
            : undefined;
            
          const themedWords = await getThemedWordSet(themeId, difficulties);
          if (themedWords.length > 0) {
            setAllWords(themedWords);
            setWords(themedWords);
            setFilteredWords(themedWords);
            setWordbookTitle(t(`wordbooks.${themeId}`));
            console.log(`Successfully fetched ${themedWords.length} themed words. First word: ${themedWords[0]?.word}`);
            setMounted(true);
            return;
          }
        } catch (error) {
          console.error('Failed to load themed wordbook:', error);
        }
      }
      
      // Fallback to preset wordbook
      if (wordbookId) {
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
          console.log(`Successfully fetched ${wordbookWords.length} preset words. First word: ${wordbookWords[0]?.word}`);
          setMounted(true);
          return;
        }
      }
      
      // Default: Load from Korean vocabulary dataset
      try {
        const koreanWords = await getRandomKoreanWordSet(30, [], ['absolute-beginner', 'beginner'], 100);
        if (koreanWords.length > 0) {
          setWords(koreanWords);
          setWordbookTitle('한국어 자주 사용되는 단어 (Korean High-Frequency Words)');
          console.log(`Successfully fetched ${koreanWords.length} Korean vocabulary words. First word: ${koreanWords[0]?.word}`);
        } else {
          // Fallback to expanded words
          const defaultWords = getRandomWordSet(20, [], ['absolute-beginner', 'beginner'], 50);
          setWords(defaultWords);
          setWordbookTitle('Vocabulary Practice');
          console.log(`Successfully fetched ${defaultWords.length} fallback words. First word: ${defaultWords[0]?.word}`);
        }
      } catch (error) {
        console.error('Error loading Korean vocabulary:', error);
        // Fallback to expanded words
        const defaultWords = getRandomWordSet(20, [], ['absolute-beginner', 'beginner'], 50);
        setWords(defaultWords);
        setWordbookTitle('Vocabulary Practice');
        console.log(`Successfully fetched ${defaultWords.length} fallback words. First word: ${defaultWords[0]?.word}`);
      }
      
      setMounted(true);
    };
    
    loadWords();
  }, [mounted, t]);

  // Filter words based on selected difficulties
  const filterWords = (difficulties: Difficulty[]) => {
    if (difficulties.length === 0) {
      return allWords;
    }
    return allWords.filter(word => difficulties.includes(word.difficulty));
  };

  // Handle difficulty filter toggle
  const handleDifficultyToggle = (difficulty: Difficulty) => {
    const newSelectedDifficulties = selectedDifficulties.includes(difficulty)
      ? selectedDifficulties.filter(d => d !== difficulty)
      : [...selectedDifficulties, difficulty];
    
    setSelectedDifficulties(newSelectedDifficulties);
    const filtered = filterWords(newSelectedDifficulties);
    setWords(filtered);
    setFilteredWords(filtered);
    setCurrentIndex(0);
    setShowFullInfo(false);
  };

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
          <div className="flex items-center">
            <button
              onClick={handleBackToStudy}
              className="flex items-center justify-center w-9 h-9 mr-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              📖 {wordbookTitle}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Threads-style Filter Tags */}
        {allWords.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setSelectedDifficulties([]);
                  setWords(allWords);
                  setFilteredWords(allWords);
                  setCurrentIndex(0);
                  setShowFullInfo(false);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                  selectedDifficulties.length === 0
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                All ({allWords.length})
              </button>
              
              {['absolute-beginner', 'beginner', 'intermediate', 'advanced'].map((difficulty) => {
                const count = allWords.filter(word => word.difficulty === difficulty).length;
                if (count === 0) return null;
                
                const isSelected = selectedDifficulties.includes(difficulty as Difficulty);
                const difficultyColors = {
                  'absolute-beginner': isSelected ? 'bg-green-500 text-white shadow-md' : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50',
                  'beginner': isSelected ? 'bg-blue-500 text-white shadow-md' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50',
                  'intermediate': isSelected ? 'bg-yellow-500 text-white shadow-md' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50',
                  'advanced': isSelected ? 'bg-purple-500 text-white shadow-md' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50'
                };
                
                return (
                  <button
                    key={difficulty}
                    onClick={() => handleDifficultyToggle(difficulty as Difficulty)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${difficultyColors[difficulty as keyof typeof difficultyColors]}`}
                  >
                    {difficulty === 'absolute-beginner' ? 'Abs. Beginner' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} ({count})
                  </button>
                );
              })}
            </div>
            
            {/* Active filters summary */}
            {selectedDifficulties.length > 0 && (
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                Showing {words.length} words • {selectedDifficulties.length} filter{selectedDifficulties.length !== 1 ? 's' : ''} active
              </div>
            )}
          </div>
        )}

        {/* Flashcard - Full Width */}
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <CardDeck 
              words={words} 
              currentIndex={currentIndex}
              onCardClick={handleToggle}
              onNext={handleNext}
              onPrevious={handlePrevious}
              showFullInfo={showFullInfo}
              showNavigation={true}
              locale={validLocale}
            />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-8 flex justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center gap-8 text-sm">
              <div className="text-center">
                <div className="font-semibold text-gray-900 dark:text-white">{words.length}</div>
                <div className="text-gray-500 dark:text-gray-400">Total Words</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900 dark:text-white">{currentIndex + 1}</div>
                <div className="text-gray-500 dark:text-gray-400">Current</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {Math.round(((currentIndex + 1) / words.length) * 100)}%
                </div>
                <div className="text-gray-500 dark:text-gray-400">Progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}