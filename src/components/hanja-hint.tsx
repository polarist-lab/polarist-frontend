'use client'

import { useState, useEffect } from 'react';
import { Locale } from '@/lib/i18n/config';
import { KoreanWord } from '@/lib/types';
import { 
  shouldShowHanjaHint,
  HanjaSettingsManager,
  getHanjaHintMessage,
  HANJA_UNFAMILIAR_LOCALES
} from '@/lib/hanja-config';
import { getHanjaInfo, getHanjaDisplay } from '@/data/hanja-words';

interface HanjaHintProps {
  word: KoreanWord;
  locale: Locale;
  onActivate?: () => void;
  className?: string;
}

export function HanjaHint({ word, locale, onActivate, className = '' }: HanjaHintProps) {
  const [showHint, setShowHint] = useState(false);
  const [hintsSeen, setHintsSeen] = useState(0);

  useEffect(() => {
    const settings = HanjaSettingsManager.getUserSettings(locale);
    setHintsSeen(settings.hintsSeen);
    
    // 힌트 표시 조건 확인
    const shouldShow = 
      !settings.enabled && // 한자 모드가 꺼져있고
      word.isHanjaOrigin && // 한자어이고
      HANJA_UNFAMILIAR_LOCALES.includes(locale) && // 한자 생소 언어이고
      shouldShowHanjaHint(locale, settings.hintsSeen); // 힌트 허용 횟수 내
    
    setShowHint(shouldShow);
  }, [word.isHanjaOrigin, locale]);

  const handleHintClick = () => {
    // 한자 모드 활성화
    const updated = HanjaSettingsManager.toggleHanjaMode(locale);
    
    // 힌트 카운트 증가
    HanjaSettingsManager.incrementHintsSeen(locale);
    
    setShowHint(false);
    onActivate?.();
  };

  if (!showHint) {
    return null;
  }

  const hanjaInfo = getHanjaInfo(word.korean);
  if (!hanjaInfo) {
    return null;
  }

  // 언어별 힌트 메시지
  const getLocalizedHintText = () => {
    switch (locale) {
      case 'en':
        return '💡 This word uses Chinese characters';
      case 'es':
        return '💡 Esta palabra usa caracteres chinos';
      case 'fr':
        return '💡 Ce mot utilise des caractères chinois';
      case 'de':
        return '💡 Dieses Wort verwendet chinesische Zeichen';
      case 'pt':
        return '💡 Esta palavra usa caracteres chineses';
      case 'it':
        return '💡 Questa parola usa caratteri cinesi';
      case 'ru':
        return '💡 Это слово использует китайские иероглифы';
      default:
        return '💡 Also in Chinese characters';
    }
  };

  const getButtonText = () => {
    switch (locale) {
      case 'en':
        return 'Show Hanja';
      case 'es':
        return 'Mostrar Hanja';
      case 'fr':
        return 'Voir Hanja';
      case 'de':
        return 'Hanja zeigen';
      case 'pt':
        return 'Mostrar Hanja';
      case 'it':
        return 'Mostra Hanja';
      case 'ru':
        return 'Показать ханча';
      default:
        return 'Show';
    }
  };

  return (
    <div className={`hanja-hint ${className}`}>
      <div className="text-center space-y-2">
        <div className="text-sm text-white/80">
          {getLocalizedHintText()}
        </div>
        <button
          onClick={handleHintClick}
          className="
            px-4 py-2 bg-white/20 hover:bg-white/30 
            rounded-lg text-sm font-medium
            transition-all duration-200
            border border-white/30
            flex items-center gap-2 mx-auto
          "
          title={`${word.korean} = ${hanjaInfo.traditional}`}
        >
          <span className="text-lg">{hanjaInfo.traditional}</span>
          <span>{getButtonText()}</span>
        </button>
        
        {/* 진도 표시 */}
        {hintsSeen > 0 && (
          <div className="text-xs text-white/60">
            Hint {hintsSeen + 1} of 10
          </div>
        )}
      </div>
    </div>
  );
}

// 더 단순한 인라인 힌트 버전
interface HanjaInlineHintProps {
  word: KoreanWord;
  locale: Locale;
  onActivate?: () => void;
}

export function HanjaInlineHint({ word, locale, onActivate }: HanjaInlineHintProps) {
  const [canShowHint, setCanShowHint] = useState(false);

  useEffect(() => {
    const settings = HanjaSettingsManager.getUserSettings(locale);
    const shouldShow = 
      !settings.enabled &&
      word.isHanjaOrigin &&
      HANJA_UNFAMILIAR_LOCALES.includes(locale) &&
      shouldShowHanjaHint(locale, settings.hintsSeen);
    
    setCanShowHint(shouldShow);
  }, [word.isHanjaOrigin, locale]);

  const handleClick = () => {
    HanjaSettingsManager.toggleHanjaMode(locale);
    HanjaSettingsManager.incrementHintsSeen(locale);
    setCanShowHint(false);
    onActivate?.();
  };

  if (!canShowHint) {
    return null;
  }

  const hanjaInfo = getHanjaInfo(word.korean);
  if (!hanjaInfo) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      className="
        inline-flex items-center gap-1 
        text-xs px-2 py-1 
        bg-blue-100 hover:bg-blue-200 
        text-blue-700 rounded-full
        transition-colors duration-200
      "
      title={`${word.korean} in Chinese characters: ${hanjaInfo.traditional}`}
    >
      <span>📝</span>
      <span>Hanja</span>
    </button>
  );
}