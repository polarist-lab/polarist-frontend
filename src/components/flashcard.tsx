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
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';

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
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (word.audioUrl) {
      const audioInstance = new Audio(word.audioUrl);
      audioInstance.onended = () => setIsPlaying(false);
      setAudio(audioInstance);
    }
    return () => {
      audio?.pause();
    };
  }, [word.audioUrl]);

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
  const difficultyBadge = createMetadataBadge(word.difficulty, 'topLeft');
  const navButtons = createNavigationButtonProps(onPrevious, onNext, 'wordbook', pressedButton);
  
  const handleCardClick = () => {
    onToggle();
  };

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audio) {
      if (isPlaying) {
        audio.pause();
        audio.currentTime = 0;
      }
      audio.play().catch(err => console.error("Audio play failed:", err));
      setIsPlaying(true);
    }
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
              
              <div className={difficultyBadge.className}>
                {difficultyBadge.content}
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
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className={'korean-text text-4xl font-bold'}>
                  {word.korean}
                </div>
                <button 
                  onClick={word.audioUrl ? handlePlayAudio : undefined} 
                  disabled={!word.audioUrl}
                  className={`p-3 rounded-full shadow-lg transition-all duration-200 ease-in-out group relative
                    ${word.audioUrl 
                      ? 'bg-blue-500 hover:bg-blue-600 hover:scale-110' 
                      : 'bg-gray-400 cursor-not-allowed opacity-70'}`}
                  aria-label={word.audioUrl ? "Play audio" : "Audio not available"}
                >
                  {word.audioUrl ? (
                    <SpeakerWaveIcon className={`h-6 w-6 text-white ${isPlaying ? 'animate-pulse' : ''}`} />
                  ) : (
                    <SpeakerXMarkIcon className="h-6 w-6 text-white" />
                  )}
                  {!word.audioUrl && (
                    <div className="absolute bottom-full mb-2 w-max px-3 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Audio not available
                      <div className="tooltip-arrow" data-popper-arrow></div>
                    </div>
                  )}
                </button>
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