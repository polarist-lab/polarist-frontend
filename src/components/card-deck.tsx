'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import { KoreanWord } from '@/lib/types';
import { Flashcard } from './flashcard';
import { LearningTracker } from '@/lib/learning-tracker';

interface CardDeckProps {
  words: KoreanWord[];
  currentIndex?: number;
  onCardClick?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  showFullInfo?: boolean;
  onProgress?: (current: number, total: number) => void;
  locale?: string;
}

export function CardDeck({ 
  words, 
  currentIndex: externalCurrentIndex,
  onCardClick,
  onNext: externalOnNext,
  onPrevious: externalOnPrevious,
  showFullInfo: externalShowFullInfo,
  onProgress,
  locale = 'en'
}: CardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(externalCurrentIndex ?? 0);
  const [showFullInfo, setShowFullInfo] = useState(externalShowFullInfo ?? false);

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
  const [showKeyboardGuide, setShowKeyboardGuide] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentWord = words[currentIndex];
  const totalWords = words.length;

  useEffect(() => {
    onProgress?.(currentIndex + 1, totalWords);
    // Record initial view when component mounts or card changes
    if (currentWord) {
      LearningTracker.recordStudyAction({
        wordId: currentWord.id,
        action: 'view',
        timestamp: new Date(),
        mode: showFullInfo ? 'full-info' : 'korean-only'
      });
    }
  }, [currentIndex, totalWords, onProgress, currentWord, showFullInfo]);

  // Handler functions (defined before useEffect to avoid initialization errors)
  const handleNext = useCallback(() => {
    if (externalOnNext) {
      externalOnNext();
    } else if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => {
        const newIndex = prev + 1;
        // Record view action for new card
        if (words[newIndex]) {
          LearningTracker.recordStudyAction({
            wordId: words[newIndex].id,
            action: 'view',
            timestamp: new Date(),
            mode: showFullInfo ? 'full-info' : 'korean-only'
          });
        }
        return newIndex;
      });
    }
  }, [externalOnNext, currentIndex, words.length, words, showFullInfo]);

  const handlePrevious = useCallback(() => {
    if (externalOnPrevious) {
      externalOnPrevious();
    } else if (currentIndex > 0) {
      setCurrentIndex(prev => {
        const newIndex = prev - 1;
        // Record view action for new card
        if (words[newIndex]) {
          LearningTracker.recordStudyAction({
            wordId: words[newIndex].id,
            action: 'view',
            timestamp: new Date(),
            mode: showFullInfo ? 'full-info' : 'korean-only'
          });
        }
        return newIndex;
      });
    }
  }, [externalOnPrevious, currentIndex, words, showFullInfo]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setShowFullInfo(false);
    // Record view action for first card
    if (words.length > 0) {
      LearningTracker.recordStudyAction({
        wordId: words[0].id,
        action: 'view',
        timestamp: new Date(),
        mode: 'korean-only'
      });
    }
  }, [words]);

  const handleCardToggle = useCallback(() => {
    // Always toggle internal state first
    setShowFullInfo(prev => {
      const newShowFullInfo = !prev;
      
      // Record toggle action
      if (currentWord) {
        LearningTracker.recordStudyAction({
          wordId: currentWord.id,
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
  }, [currentWord, onCardClick]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default behavior for navigation keys
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(event.key)) {
        event.preventDefault();
      }

      switch (event.key) {
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'ArrowUp':
        case 'ArrowDown':
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

  if (!currentWord) {
    return (
      <div className="text-center p-12 bg-card rounded-2xl shadow-lg border border-border">
        <div className="text-6xl mb-4 opacity-50">📚</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No words available</h3>
        <p className="text-foreground/60">Please add some words to start studying!</p>
      </div>
    );
  }

  const isLastCard = currentIndex === words.length - 1;
  const progressPercentage = ((currentIndex + 1) / totalWords) * 100;

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto p-4 outline-none"
    >

      {/* Simple Progress */}
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-foreground/80">
            Word {currentIndex + 1} of {totalWords}
          </span>
          <span className="text-sm font-bold text-primary">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-border rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary-dark transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <Flashcard
        word={currentWord}
        showFullInfo={showFullInfo}
        onToggle={handleCardToggle}
        onNext={!isLastCard ? handleNext : undefined}
        onPrevious={currentIndex > 0 ? handlePrevious : undefined}
        showNavigation={true}
        locale={locale}
      />

      {/* Simple Controls */}
      <div className="flex justify-center">
        <button 
          className="bg-white text-foreground border-2 border-border hover:border-primary px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:opacity-80 cursor-pointer active:translate-y-0"
          onClick={handleRestart}
        >
          Start Over
        </button>
      </div>

      {/* Keyboard Guide */}
      {showKeyboardGuide && (
        <div className="w-full max-w-md bg-foreground/5 rounded-lg p-4 mt-4 relative">
          <button 
            className="absolute top-2 right-2 w-6 h-6 bg-foreground/10 hover:bg-foreground/20 rounded-full flex items-center justify-center text-foreground/60 hover:text-foreground text-xs font-bold hover:opacity-80 cursor-pointer transition-all duration-200"
            onClick={() => setShowKeyboardGuide(false)}
            aria-label="Close keyboard guide"
          >
            ×
          </button>
          <h4 className="text-sm font-semibold text-foreground mb-2">⌨️ Keyboard Shortcuts</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-foreground/70">
            <div>← → Previous/Next</div>
            <div>↑ ↓ Space Toggle info</div>
            <div>R Restart</div>
            <div>Click Toggle view</div>
          </div>
        </div>
      )}

      {/* Completion Message */}
      {isLastCard && (
        <div className="w-full max-w-md bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-2xl text-center shadow-xl">
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="text-xl font-bold mb-2">Congratulations!</h3>
          <p className="text-white/90 mb-4">
            You&apos;ve seen all {totalWords} words!
          </p>
          <button 
            className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-50 hover:opacity-80 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            onClick={handleRestart}
          >
            Study Again
          </button>
        </div>
      )}
    </div>
  );
}