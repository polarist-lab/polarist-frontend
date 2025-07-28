'use client'

import { useState, useEffect } from 'react';
import { KoreanWord, UserHanjaSettings } from '@/lib/types';
import { useTranslations } from '@/lib/i18n';
import { Locale, isValidLocale } from '@/lib/i18n/config';
import { HanjaToggleMini } from './hanja-toggle';
import { HanjaSettingsManager, shouldShowHanjaToggle, shouldShowHanjaHint } from '@/lib/hanja-config';
import { getHanjaInfo, getHanjaDisplay } from '@/data/hanja-words';
import { 
  createUnifiedCardClasses, 
  createMetadataBadge, 
  createNavigationButtonProps,
  UNIFIED_CARD_LAYOUT 
} from '@/lib/unified-card-styles';

interface FlashcardProps {
  word: KoreanWord;
  showFullInfo: boolean;
  onToggle: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  showNavigation?: boolean;
  locale?: string;
}

export function Flashcard({
  word,
  showFullInfo,
  onToggle,
  onNext,
  onPrevious,
  showNavigation = false,
  locale = 'en'
}: FlashcardProps) {
  const validLocale: Locale = isValidLocale(locale) ? locale : 'en';
  const { t } = useTranslations(validLocale);
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  const [hanjaSettings, setHanjaSettings] = useState<UserHanjaSettings | null>(null);
  const [showHanjaHintState, setShowHanjaHintState] = useState(false);

  // 한자 설정 로드
  useEffect(() => {
    const settings = HanjaSettingsManager.getUserSettings(validLocale);
    setHanjaSettings(settings);
    
    // 힌트 표시 여부 확인
    const shouldShowHint = shouldShowHanjaHint(validLocale, settings.hintsSeen);
    setShowHanjaHintState(shouldShowHint && !!word.isHanjaOrigin);
  }, [validLocale, word.isHanjaOrigin]);

  // 한자 정보 가져오기
  const hanjaInfo = word.isHanjaOrigin ? getHanjaInfo(word.korean) : null;

  // 통합 스타일 클래스 생성
  const cardClasses = createUnifiedCardClasses('wordbook', undefined, pressedButton === 'card');
  const categoryBadge = createMetadataBadge(word.category, 'topLeft');
  const difficultyBadge = createMetadataBadge(word.difficulty, 'topRight');
  const navButtons = createNavigationButtonProps(onPrevious, onNext, 'wordbook', pressedButton);
  
  const handleCardClick = () => {
    onToggle();
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

  const handleHanjaToggle = (enabled: boolean) => {
    const updated = HanjaSettingsManager.toggleHanjaMode(validLocale);
    setHanjaSettings(updated);
    
    // 힌트를 클릭한 경우 힌트 카운트 증가
    if (showHanjaHintState && enabled) {
      HanjaSettingsManager.incrementHintsSeen(validLocale);
      setShowHanjaHintState(false);
    }
  };

  const handleHanjaHintClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = HanjaSettingsManager.toggleHanjaMode(validLocale);
    const incrementedSettings = HanjaSettingsManager.incrementHintsSeen(validLocale);
    setHanjaSettings(incrementedSettings);
    setShowHanjaHintState(false);
  };

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
          event.preventDefault();
          simulateButtonPress('card');
          onToggle();
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
      {/* Flashcard */}
      <div
        className={`${cardClasses.container} ${showFullInfo ? 'flipped' : ''}`}
        onClick={handleCardClick}
        data-flashcard
      >
        <div className={cardClasses.inner}>
          {/* Front of the card (Korean Only Mode) */}
          <div className={`flip-card-front ${cardClasses.front}`}>
            <div className={cardClasses.content}>
              <div className={`korean-text ${UNIFIED_CARD_LAYOUT.mainText.large}`}>
                {word.korean}
              </div>
              
              {/* 한자 표시 (설정에 따라) */}
              {hanjaSettings?.enabled && hanjaInfo && (
                <div className={UNIFIED_CARD_LAYOUT.subText}>
                  ({getHanjaDisplay(word.korean, hanjaSettings.script)})
                </div>
              )}
              
              {/* 한자 힌트 (서양어 사용자용) */}
              {showHanjaHintState && hanjaInfo && !hanjaSettings?.enabled && (
                <button
                  onClick={handleHanjaHintClick}
                  className="mb-4 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
                  title="Click to see Chinese characters"
                >
                  💡 Also in Chinese
                </button>
              )}
              
              <div className={UNIFIED_CARD_LAYOUT.instruction}>
                {t('study.clickToSeeFullInfo')}
              </div>
              
              <div className={categoryBadge.className}>
                {categoryBadge.content}
              </div>

              {/* 한자 토글 버튼 */}
              {shouldShowHanjaToggle(validLocale) && word.isHanjaOrigin && hanjaSettings && (
                <div className={UNIFIED_CARD_LAYOUT.toggleButton}>
                  <HanjaToggleMini
                    locale={validLocale}
                    enabled={hanjaSettings.enabled}
                    onToggle={handleHanjaToggle}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Back of the card (Full Info Mode) */}
          <div className={`flip-card-back ${cardClasses.back}`}>
            <div className={cardClasses.content}>
              <div className={`korean-text text-4xl font-bold mb-2`}>
                {word.korean}
              </div>
              
              {/* 한자 표시 (설정에 따라) */}
              {hanjaSettings?.enabled && hanjaInfo && (
                <div className="text-white/90 text-xl font-medium mb-2">
                  ({getHanjaDisplay(word.korean, hanjaSettings.script)})
                </div>
              )}
              
              <div className={UNIFIED_CARD_LAYOUT.pronunciation}>
                [{word.pronunciation}]
              </div>
              
              {/* 한자 어원 설명 (한자 모드일 때) */}
              {hanjaSettings?.enabled && hanjaSettings.showEtymology && hanjaInfo?.meaning && (
                <div className="text-white/80 text-sm mb-3 bg-white/10 px-3 py-2 rounded-lg">
                  <span className="font-medium">한자 의미:</span> {hanjaInfo.meaning}
                </div>
              )}
              
              <div className={UNIFIED_CARD_LAYOUT.translation}>
                {word.english}
              </div>
              
              {/* 한자 어원 (상세 모드) */}
              {hanjaSettings?.enabled && hanjaInfo?.etymology && (
                <div className={UNIFIED_CARD_LAYOUT.etymology}>
                  Etymology: {hanjaInfo.etymology}
                </div>
              )}
              
              <div className={UNIFIED_CARD_LAYOUT.instruction}>
                {t('study.clickToSwitchToKoreanOnly')}
              </div>
              
              <div className={categoryBadge.className}>
                {categoryBadge.content}
              </div>
              <div className={difficultyBadge.className}>
                {difficultyBadge.content}
              </div>

              {/* 한자 토글 버튼 (뒷면에서도 표시) */}
              {shouldShowHanjaToggle(validLocale) && word.isHanjaOrigin && hanjaSettings && (
                <div className={UNIFIED_CARD_LAYOUT.toggleButtonBack}>
                  <HanjaToggleMini
                    locale={validLocale}
                    enabled={hanjaSettings.enabled}
                    onToggle={handleHanjaToggle}
                  />
                </div>
              )}
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
    </div>
  );
}
