// App Router 기반 i18n 설정

export const locales = [
  'en', 'en-gb', 'jp', 'id', 'es', 'ar', 'th', 'vi', 
  'zh-tw', 'zh-cn', 'pt', 'hi'
] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

// 언어별 메타데이터
export const localeConfig = {
  en: {
    name: 'English (US)',
    nativeName: 'English (US)',
    flag: '🇺🇸',
    dir: 'ltr' as const,
  },
  'en-gb': {
    name: 'English (UK)',
    nativeName: 'English (UK)',
    flag: '🇬🇧',
    dir: 'ltr' as const,
  },
  jp: {
    name: 'Japanese', 
    nativeName: '日本語',
    flag: '🇯🇵',
    dir: 'ltr' as const,
  },
  id: {
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia', 
    flag: '🇮🇩',
    dir: 'ltr' as const,
  },
  es: {
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    dir: 'ltr' as const,
  },
  ar: {
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    dir: 'rtl' as const,
  },
  th: {
    name: 'Thai',
    nativeName: 'ไทย',
    flag: '🇹🇭',
    dir: 'ltr' as const,
  },
  vi: {
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    flag: '🇻🇳',
    dir: 'ltr' as const,
  },
  'zh-tw': {
    name: 'Traditional Chinese',
    nativeName: '繁體中文',
    flag: '🇹🇼',
    dir: 'ltr' as const,
  },
  'zh-cn': {
    name: 'Simplified Chinese',
    nativeName: '简体中文',
    flag: '🇨🇳',
    dir: 'ltr' as const,
  },
  pt: {
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇵🇹',
    dir: 'ltr' as const,
  },
  hi: {
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    dir: 'ltr' as const,
  },
} as const;

// 로케일 검증 함수
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

// 브라우저 언어 감지
export function getLocaleFromHeaders(acceptLanguage?: string): Locale {
  if (!acceptLanguage) return defaultLocale;
  
  // Accept-Language 헤더 파싱
  const languages = acceptLanguage
    .split(',')
    .map(lang => lang.trim().split(';')[0])
    .map(lang => lang.split('-')[0]); // en-US -> en
  
  for (const lang of languages) {
    if (lang === 'ja') return 'jp'; // 일본어 매핑
    if (isValidLocale(lang)) return lang;
  }
  
  return defaultLocale;
}

// 로케일별 URL 생성
export function getLocalizedPath(pathname: string, locale: Locale): string {
  if (locale === defaultLocale) return pathname;
  return `/${locale}${pathname === '/' ? '' : pathname}`;
}

// URL에서 로케일 추출
export function getLocaleFromPathname(pathname: string): { locale: Locale; pathname: string } {
  const segments = pathname.split('/');
  const maybeLocale = segments[1];
  
  if (isValidLocale(maybeLocale)) {
    return {
      locale: maybeLocale,
      pathname: '/' + segments.slice(2).join('/') || '/',
    };
  }
  
  return {
    locale: defaultLocale,
    pathname,
  };
}