'use client'

import { useState, useEffect } from 'react';
import { Locale } from '@/lib/i18n/config';
import { 
  shouldShowHanjaToggle, 
  getHanjaHintMessage,
  HanjaSettingsManager 
} from '@/lib/hanja-config';
import { UserHanjaSettings } from '@/lib/types';

interface HanjaToggleProps {
  locale: Locale;
  onToggle?: (enabled: boolean) => void;
  className?: string;
}

export function HanjaToggle({ locale, onToggle, className = '' }: HanjaToggleProps) {
  const [settings, setSettings] = useState<UserHanjaSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 클라이언트 사이드에서만 설정 로드
    const loadSettings = () => {
      const userSettings = HanjaSettingsManager.getUserSettings(locale);
      setSettings(userSettings);
      setIsLoading(false);
    };

    loadSettings();
  }, [locale]);

  const handleToggle = () => {
    if (!settings) return;

    const updated = HanjaSettingsManager.toggleHanjaMode(locale);
    setSettings(updated);
    onToggle?.(updated.enabled);
  };

  // 서버 사이드 렌더링 중이거나 토글을 표시하지 않는 언어면 숨김
  if (isLoading || !shouldShowHanjaToggle(locale) || !settings) {
    return null;
  }

  const hintMessage = getHanjaHintMessage(locale);

  return (
    <button
      onClick={handleToggle}
      className={`
        hanja-toggle-btn
        flex items-center gap-1.5 px-3 py-1.5 
        rounded-lg border transition-all duration-200
        text-sm font-medium
        ${settings.enabled 
          ? 'bg-blue-500 text-white border-blue-500 shadow-sm' 
          : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }
        ${className}
      `}
      title={hintMessage}
      aria-label={hintMessage}
    >
      <span className="text-base">
        {settings.enabled ? '漢' : 'A'}
      </span>
      <span className="hidden sm:inline">
        {settings.enabled ? (
          locale === 'en' ? 'Hanja' : 
          locale === 'ja' ? '漢字' :
          locale === 'zh-CN' ? '汉字' :
          locale === 'zh-TW' ? '漢字' :
          locale === 'ko' ? '한자' : 'Hanja'
        ) : (
          locale === 'en' ? 'Show' :
          locale === 'ja' ? '表示' :
          locale === 'zh-CN' ? '显示' :
          locale === 'zh-TW' ? '顯示' :
          locale === 'ko' ? '표시' : 'Show'
        )}
      </span>
    </button>
  );
}

// 간단한 아이콘만 표시하는 미니 버전
interface HanjaToggleMiniProps {
  locale: Locale;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  className?: string;
}

export function HanjaToggleMini({ locale, enabled, onToggle, className = '' }: HanjaToggleMiniProps) {
  if (!shouldShowHanjaToggle(locale)) {
    return null;
  }

  const handleToggle = () => {
    const updated = HanjaSettingsManager.toggleHanjaMode(locale);
    onToggle(updated.enabled);
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        hanja-toggle-mini
        w-8 h-8 rounded-full 
        flex items-center justify-center
        transition-all duration-200
        text-sm font-bold
        ${enabled 
          ? 'bg-blue-500 text-white shadow-sm' 
          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
        }
        ${className}
      `}
      title={getHanjaHintMessage(locale)}
      aria-label={getHanjaHintMessage(locale)}
    >
      {enabled ? '漢' : 'A'}
    </button>
  );
}