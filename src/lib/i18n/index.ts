// 다국어 지원 메인 시스템

import { Locale, defaultLocale } from './config';
import { Translation } from './types';
import { en } from './translations/en';
import { enGb } from './translations/en-gb';
import { jp } from './translations/jp';
import { id } from './translations/id';
import { es } from './translations/es';
import { ar } from './translations/ar';
import { th } from './translations/th';
import { vi } from './translations/vi';
import { zhTw } from './translations/zh-tw';
import { zhCn } from './translations/zh-cn';
import { pt } from './translations/pt';
import { hi } from './translations/hi';

// 번역 데이터 맵
const translations: Record<Locale, Translation> = {
  en,
  'en-gb': enGb,
  jp,
  id,
  es,
  ar,
  th,
  vi,
  'zh-tw': zhTw,
  'zh-cn': zhCn,
  pt,
  hi,
};

// 번역 텍스트 가져오기
export function getTranslations(locale: Locale): Translation {
  return translations[locale] || translations[defaultLocale];
}

// 중첩된 객체에서 키로 값 추출 (예: 'home.title' -> translation.home.title)
export function getNestedTranslation(
  translations: Translation,
  key: string,
  params?: Record<string, string | number>
): string {
  const keys = key.split('.');
  let value: unknown = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key; // 키를 그대로 반환
    }
  }
  
  if (typeof value !== 'string') {
    console.warn(`Translation value is not a string: ${key}`);
    return key;
  }
  
  // 매개변수 치환 (예: "Word {{current}} of {{total}}")
  if (params) {
    return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
      return params[paramKey]?.toString() || match;
    });
  }
  
  return value;
}

// 번역 훅 유틸리티
export function useTranslations(locale: Locale) {
  const translations = getTranslations(locale);
  
  const t = (key: string, params?: Record<string, string | number>) => {
    return getNestedTranslation(translations, key, params);
  };
  
  return { t, translations };
}

// 로케일별 메타데이터
export function getLocaleMeta(locale: Locale) {
  const translations = getTranslations(locale);
  return {
    title: translations.meta.title,
    description: translations.meta.description,
    keywords: translations.meta.keywords,
    lang: locale,
    dir: translations.targetLanguage.direction,
  };
}

// 내보내기
export * from './config';
export * from './types';
export { translations };