'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { KoreanSentence } from '@/lib/types';
import { SentenceCard } from './sentence-card';
import { LearningTracker } from '@/lib/learning-tracker';
import { Locale } from '@/lib/i18n/config';

interface SentenceDeckProps {
  sentences: KoreanSentence[];
  currentIndex?: number;
  onCardClick?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  showFullInfo?: boolean;
  onProgress?: (current: number, total: number) => void;
  locale?: Locale;
  contentId?: string;
}

export function SentenceDeck({ 
  sentences, 
  currentIndex: externalCurrentIndex,
  onCardClick,
  onNext: externalOnNext,
  onPrevious: externalOnPrevious,
  showFullInfo: externalShowFullInfo,
  onProgress,
  locale = 'en',
  contentId
}: SentenceDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(externalCurrentIndex ?? 0);
  const [showFullInfo, setShowFullInfo] = useState(externalShowFullInfo ?? false);
  const [showKeyboardGuide, setShowKeyboardGuide] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentSentence = sentences[currentIndex];
  const totalSentences = sentences.length;

  // Sync with external props if provided
  useEffect(() => {
    if (externalCurrentIndex !== undefined) {
      setCurrentIndex(externalCurrentIndex);
    }
  }, [externalCurrentIndex]);

  useEffect(() => {
    if (externalShowFullInfo !== undefined) {
      setShowFullInfo(externalShowFullInfo);
    }
  }, [externalShowFullInfo]);

  // Progress tracking
  useEffect(() => {
    onProgress?.(currentIndex + 1, totalSentences);
    // Record sentence view action
    if (currentSentence && contentId) {
      LearningTracker.recordStudyAction({
        contentId,
        contentType: 'sentence',
        itemId: currentSentence.id,
        action: 'view',
        timestamp: new Date(),
        mode: showFullInfo ? 'full-info' : 'korean-only'
      });
    }
  }, [currentIndex, totalSentences, onProgress, currentSentence, showFullInfo, contentId]);

  // Handler functions (defined before useEffect to avoid initialization errors)
  const handleNext = useCallback(() => {
    if (externalOnNext) {
      externalOnNext();
    } else if (currentIndex < sentences.length - 1) {
      setCurrentIndex(prev => {
        const newIndex = prev + 1;
        // Record view action for new sentence
        if (sentences[newIndex] && contentId) {
          LearningTracker.recordStudyAction({
            contentId,
            contentType: 'sentence',
            itemId: sentences[newIndex].id,
            action: 'view',
            timestamp: new Date(),
            mode: showFullInfo ? 'full-info' : 'korean-only'
          });
        }
        return newIndex;
      });
    }
  }, [externalOnNext, currentIndex, sentences.length, sentences, showFullInfo, contentId]);

  const handlePrevious = useCallback(() => {
    if (externalOnPrevious) {
      externalOnPrevious();
    } else if (currentIndex > 0) {
      setCurrentIndex(prev => {
        const newIndex = prev - 1;
        // Record view action for previous sentence
        if (sentences[newIndex] && contentId) {
          LearningTracker.recordStudyAction({
            contentId,
            contentType: 'sentence',
            itemId: sentences[newIndex].id,
            action: 'view',
            timestamp: new Date(),
            mode: showFullInfo ? 'full-info' : 'korean-only'
          });
        }
        return newIndex;
      });
    }
  }, [externalOnPrevious, currentIndex, sentences, showFullInfo, contentId]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setShowFullInfo(false);
    // Record view action for first sentence
    if (sentences.length > 0 && contentId) {
      LearningTracker.recordStudyAction({
        contentId,
        contentType: 'sentence',
        itemId: sentences[0].id,
        action: 'view',
        timestamp: new Date(),
        mode: 'korean-only'
      });
    }
  }, [sentences, contentId]);

  const handleCardToggle = useCallback(() => {
    // Always toggle internal state first
    setShowFullInfo(prev => {
      const newShowFullInfo = !prev;
      
      // Record toggle action
      if (currentSentence && contentId) {
        LearningTracker.recordStudyAction({
          contentId,
          contentType: 'sentence',
          itemId: currentSentence.id,
          action: 'toggle_mode',
          timestamp: new Date(),
          mode: newShowFullInfo ? 'full-info' : 'korean-only'
        });
      }
      
      return newShowFullInfo;
    });
    
    // Call external handler if provided
    if (onCardClick) {
      onCardClick();
    }
  }, [currentSentence, onCardClick, contentId]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default behavior for navigation keys
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(event.key)) {
        event.preventDefault();
      }

      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          handlePrevious();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          handleNext();
          break;
        case ' ': // Spacebar
          handleCardToggle();
          break;
        case 'r':
        case 'R':
          if (event.ctrlKey || event.metaKey) return; // Don't interfere with browser refresh
          handleRestart();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNext, handlePrevious, handleCardToggle, handleRestart]);

  // Hide keyboard guide after first interaction
  useEffect(() => {
    const timer = setTimeout(() => setShowKeyboardGuide(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!currentSentence) {
    return (
      <div className="text-center p-12 bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="text-6xl mb-4 opacity-50">💬</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No sentences available</h3>
        <p className="text-gray-600">Please add some sentences to start practicing!</p>
      </div>
    );
  }

  const isLastSentence = currentIndex === sentences.length - 1;
  const progressPercentage = ((currentIndex + 1) / totalSentences) * 100;

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto p-4 outline-none"
    >
      {/* Simple Progress */}
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-700">
            Sentence {currentIndex + 1} of {totalSentences}
          </span>
          <span className="text-sm font-bold text-blue-600">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Sentence Card */}
      <SentenceCard 
        sentence={currentSentence}
        showFullInfo={showFullInfo}
        onToggle={handleCardToggle}
        onNext={!isLastSentence ? handleNext : undefined}
        onPrevious={currentIndex > 0 ? handlePrevious : undefined}
        showNavigation={true}
        locale={locale}
      />



      {/* Keyboard Shortcuts Guide */}
      {showKeyboardGuide && (
        <div className="bg-gray-100 rounded-lg p-3 text-center animate-fade-in">
          <div className="text-xs text-gray-600 font-medium mb-1">Keyboard Shortcuts:</div>
          <div className="text-xs text-gray-500">
            ← → Navigation • ↑ ↓ Navigation • Space Toggle • R Restart
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}