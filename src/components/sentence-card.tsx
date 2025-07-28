'use client';

import { useState } from 'react';
import { KoreanSentence } from '@/lib/types';
import { Locale } from '@/lib/i18n/config';
import {
  createUnifiedCardClasses,
  createMetadataBadge,
  createNavigationButtonProps,
  UNIFIED_CARD_LAYOUT
} from '@/lib/unified-card-styles';

interface SentenceCardProps {
  sentence: KoreanSentence;
  showFullInfo?: boolean;
  onToggle?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  showNavigation?: boolean;
  locale?: Locale;
  className?: string;
}

export function SentenceCard({
  sentence,
  showFullInfo = false,
  onToggle,
  onNext,
  onPrevious,
  showNavigation = false,
  locale = 'en',
  className = ''
}: SentenceCardProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [pressedButton, setPressedButton] = useState<string | null>(null);

  // 통합 스타일 클래스 생성
  const cardClasses = createUnifiedCardClasses('sentence', undefined, pressedButton === 'card');
  const categoryBadge = createMetadataBadge(sentence.category, 'topLeft');
  const difficultyBadge = createMetadataBadge(sentence.difficulty, 'topRight');
  const navButtons = createNavigationButtonProps(onPrevious, onNext, 'sentence', pressedButton);

  const handleCardClick = () => {
    if (onToggle) {
      simulateButtonPress('card');
      setIsFlipping(true);
      setTimeout(() => setIsFlipping(false), 300);
      onToggle();
    }
  };

  const simulateButtonPress = (buttonType: string) => {
    setPressedButton(buttonType);
    setTimeout(() => setPressedButton(null), 150);
  };

  const handleNavigationClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  const handleNext = () => {
    simulateButtonPress('next');
    onNext?.();
  };

  const handlePrevious = () => {
    simulateButtonPress('previous');
    onPrevious?.();
  };

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Main Card */}
      <div
        className={`${cardClasses.container} ${showFullInfo ? 'flipped' : ''} ${isFlipping ? 'animate-flip' : ''}`}
        onClick={handleCardClick}
        data-sentencecard
      >
        <div className={cardClasses.inner}>
          {/* Front of the card (Korean Only Mode) */}
          <div className={`flip-card-front ${cardClasses.front}`}>
            <div className={cardClasses.content}>
              <div className={`korean-text ${UNIFIED_CARD_LAYOUT.mainText.medium} leading-relaxed`}>
                {sentence.korean}
              </div>
              
              <div className={UNIFIED_CARD_LAYOUT.pronunciation}>
                [{sentence.pronunciation}]
              </div>

              <div className={UNIFIED_CARD_LAYOUT.instruction}>
                💡 Tap to see translation & grammar
              </div>
              
              <div className={categoryBadge.className}>
                {categoryBadge.content}
              </div>
            </div>
          </div>
          
          {/* Back of the card (Full Info Mode) */}
          <div className={`flip-card-back ${cardClasses.back}`}>
            <div className={cardClasses.content}>
              <div className={`korean-text text-2xl font-bold mb-2`}>
                {sentence.korean}
              </div>
              
              <div className={UNIFIED_CARD_LAYOUT.pronunciation}>
                [{sentence.pronunciation}]
              </div>

              <div className={UNIFIED_CARD_LAYOUT.translation}>
                &quot;{sentence.english}&quot;
              </div>

              {/* Grammar points */}
              {sentence.grammar && sentence.grammar.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-semibold text-white/90 mb-2">
                    Grammar Focus:
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {sentence.grammar.map((point, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white/20 text-white"
                      >
                        {point}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {sentence.notes && (
                <div className="mb-4">
                  <div className="text-sm font-semibold text-white/90 mb-2">
                    📝 Notes:
                  </div>
                  <div className="text-sm text-white/80 bg-white/10 px-3 py-2 rounded-lg">
                    {sentence.notes}
                  </div>
                </div>
              )}

              <div className={UNIFIED_CARD_LAYOUT.instruction}>
                💡 Tap to practice Korean-only mode
              </div>
              
              <div className={categoryBadge.className}>
                {categoryBadge.content}
              </div>
              <div className={difficultyBadge.className}>
                {difficultyBadge.content}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - Separated with proper spacing */}
      {showNavigation && (
        <div className={UNIFIED_CARD_LAYOUT.navigationContainer}>
          <button
            className={navButtons.previousButton.className}
            onClick={onPrevious ? (e) => handleNavigationClick(e, handlePrevious) : undefined}
            disabled={navButtons.previousButton.disabled}
          >
            ← Previous
          </button>
          <button
            className={navButtons.nextButton.className}
            onClick={onNext ? (e) => handleNavigationClick(e, handleNext) : undefined}
            disabled={navButtons.nextButton.disabled}
          >
            Next →
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes flip {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(180deg); }
          100% { transform: rotateY(0deg); }
        }
        
        .animate-flip {
          animation: flip 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}