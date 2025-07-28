'use client'

import { useState, useEffect } from 'react';
import { KoreanCharacter } from '@/lib/types';
import { useTranslations } from '@/lib/i18n';
import { Locale, isValidLocale } from '@/lib/i18n/config';
import { 
  createUnifiedCardClasses, 
  createMetadataBadge, 
  createNavigationButtonProps,
  UNIFIED_CARD_LAYOUT,
  getCharacterTypeColors
} from '@/lib/unified-card-styles';

interface CharacterCardProps {
  character: KoreanCharacter;
  showFullInfo: boolean;
  onToggle: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  showNavigation?: boolean;
  locale?: string;
}

export function CharacterCard({
  character,
  showFullInfo,
  onToggle,
  onNext,
  onPrevious,
  showNavigation = false,
  locale = 'en'
}: CharacterCardProps) {
  const validLocale: Locale = isValidLocale(locale) ? locale : 'en';
  const { t } = useTranslations(validLocale);
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  
  const handleCardClick = () => {
    // 한글 카드는 뒤집기 기능 비활성화
    // onToggle();
  };

  const handleNext = () => {
    simulateButtonPress('next');
    onNext?.();
  };

  const handlePrevious = () => {
    simulateButtonPress('previous');
    onPrevious?.();
  };

  const simulateButtonPress = (buttonType: string) => {
    setPressedButton(buttonType);
    setTimeout(() => setPressedButton(null), 150);
  };

  const handleNavigationClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation(); // Prevent card flip when clicking navigation
    action();
  };

  const getTypeName = () => {
    switch (character.type) {
      case 'vowel':
        return 'Vowel';
      case 'complex-vowel':
        return 'Complex Vowel';
      case 'consonant':
        return 'Consonant';
      case 'double-consonant':
        return 'Double Consonant';
      case 'syllable':
        return 'Syllable';
      case 'vowel-review':
        return 'Vowel Review';
      default:
        return 'Character';
    }
  };

  // 통합 스타일 클래스 생성
  const cardClasses = createUnifiedCardClasses('character', character.type, pressedButton === 'card');
  const typeBadge = createMetadataBadge(getTypeName(), 'topLeft');
  const navButtons = createNavigationButtonProps(onPrevious, onNext, 'character', pressedButton);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          if (onPrevious) {
            event.preventDefault();
            handlePrevious();
          }
          break;
        case 'ArrowRight':
          if (onNext) {
            event.preventDefault();
            handleNext();
          }
          break;
        case 'ArrowUp':
        case 'ArrowDown':
        case ' ':
          // 한글 카드는 뒤집기 기능 비활성화
          // event.preventDefault();
          // simulateButtonPress('card');
          // onToggle();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNext, onPrevious, onToggle]);

  return (
    <div className="w-full space-y-6">
      {/* Character Card */}
      <div
        className="w-full h-80 cursor-default select-none focus:outline-none"
        data-charactercard
      >
        <div className="w-full h-full rounded-2xl shadow-lg border border-gray-200 bg-white text-gray-800 flex items-center justify-center">
          <div className="text-center p-8 w-full relative">
            {/* 한글 문자 */}
            <div className="korean-text text-8xl font-bold mb-4 drop-shadow-lg">
              {character.character}
            </div>
            
            {/* 한글 이름 */}
            <div className="text-gray-800 text-2xl font-medium mb-2">
              {character.characterName}
            </div>
            
            {/* 영어 발음 */}
            <div className="text-gray-700 text-xl italic font-mono mb-4 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
              [{character.pronunciation}]
            </div>

            {/* 태그 정보 - 상단 좌측에만 표시 */}
            {character.tags && character.tags.length > 0 && (
              <div className="absolute top-4 left-4">
                <div className="flex gap-2 flex-wrap">
                  {character.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium border border-gray-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
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
    </div>
  );
}