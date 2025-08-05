'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Locale, isValidLocale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';
import { getSentencesByCollectionId, SENTENCE_COLLECTION_PRESETS } from '@/data/sentence-collection-presets';
import { KoreanSentence } from '@/lib/types';

export default function SentenceLearningPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params?.locale as string;
  const collectionId = params?.id as string;
  const validLocale: Locale = isValidLocale(locale) ? locale : 'en';
  const { t } = useTranslations(validLocale);

  const [sentences, setSentences] = useState<KoreanSentence[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullInfo, setShowFullInfo] = useState(false);
  const [collectionTitle, setCollectionTitle] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  // Initialize with sentences from selected collection
  useEffect(() => {
    if (mounted) return; // Prevent multiple initializations
    
    const loadSentences = async () => {
      const collection = SENTENCE_COLLECTION_PRESETS.find(p => p.id === collectionId);
      if (collection) {
        const collectionSentences = getSentencesByCollectionId(collectionId);
        setSentences(collectionSentences);
        setCollectionTitle(t(collection.titleKey));
        setMounted(true);
      } else {
        // If collection not found, redirect back
        router.push(`/${validLocale}/study/sentences`);
      }
    };

    loadSentences();
  }, [collectionId, t, router, validLocale, mounted]);

  const handleCardClick = () => {
    setShowFullInfo(!showFullInfo);
  };

  const handleNext = () => {
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowFullInfo(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowFullInfo(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setShowFullInfo(false);
  };

  const handleBackToSentences = () => {
    router.push(`/${validLocale}/study/sentences`);
  };

  if (!mounted || sentences.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">💬</div>
          <div className="text-lg text-gray-600 dark:text-gray-400">Loading sentences...</div>
        </div>
      </div>
    );
  }

  const currentSentence = sentences[currentIndex];
  const isLastSentence = currentIndex === sentences.length - 1;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBackToSentences}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Sentences
            </button>
            
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Sentence {currentIndex + 1} of {sentences.length}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {collectionTitle}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Click sentences to toggle between Korean-only and full information view
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(((currentIndex + 1) / sentences.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / sentences.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Sentence Card */}
        <div className="mb-8">
          <div
            onClick={handleCardClick}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 cursor-pointer transition-all duration-300 hover:shadow-xl"
          >
            {/* Korean Sentence */}
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {currentSentence.korean}
              </h2>
              
              {showFullInfo && (
                <>
                  {/* Pronunciation */}
                  {currentSentence.pronunciation && (
                    <p className="text-lg text-blue-600 dark:text-blue-400 mb-4 font-mono">
                      [{currentSentence.pronunciation}]
                    </p>
                  )}
                  
                  {/* English Translation */}
                  <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
                    {currentSentence.english}
                  </p>
                  
                  {/* Grammar Points */}
                  {currentSentence.grammar && currentSentence.grammar.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Grammar Focus:</h3>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {currentSentence.grammar.map((grammar) => (
                          <span
                            key={grammar}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200"
                          >
                            {grammar}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Category & Difficulty */}
                  <div className="flex justify-center gap-4 mb-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-200">
                      {currentSentence.category}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-200">
                      {currentSentence.difficulty}
                    </span>
                  </div>
                  
                  {/* Notes */}
                  {currentSentence.notes && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        💡 {currentSentence.notes}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Toggle Hint */}
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {showFullInfo ? 'Click to show Korean only' : 'Click to see full information'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <button
            onClick={handleRestart}
            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            🔄 Restart
          </button>

          {!isLastSentence ? (
            <button
              onClick={handleNext}
              className="flex items-center px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Next
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => router.push(`/${validLocale}/study/sentences`)}
              className="flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Complete Collection
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Keyboard Shortcuts */}
        <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Keyboard Shortcuts:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600 dark:text-gray-400">
            <div><kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Space</kbd> Toggle info</div>
            <div><kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">←</kbd> Previous</div>
            <div><kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">→</kbd> Next</div>
            <div><kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">R</kbd> Restart</div>
          </div>
        </div>
      </div>

      {isLastSentence && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Collection Complete!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You've practiced all {sentences.length} sentences in this collection.
          </p>
        </div>
      )}
    </div>
  );
}