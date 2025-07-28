import { LocaleHanjaConfig, UserHanjaSettings } from './types';
import { Locale } from './i18n/config';

// 언어별 한자 친숙도 및 기본 설정
export const LOCALE_HANJA_CONFIG: Record<string, LocaleHanjaConfig> = {
  // 한자 기본 활성화 (높은 친숙도)
  'ja': {
    defaultEnabled: true,
    preferredScript: 'traditional',
    showToggle: true,
    showHint: false // 이미 활성화되어 있으므로 힌트 불필요
  },
  'zh-CN': {
    defaultEnabled: true,
    preferredScript: 'simplified',
    showToggle: true,
    showHint: false
  },
  'zh-TW': {
    defaultEnabled: true,
    preferredScript: 'traditional',
    showToggle: true,
    showHint: false
  },
  'ko': {
    defaultEnabled: true,
    preferredScript: 'traditional',
    showToggle: true,
    showHint: false
  },
  
  // 선택적 표시 (중간 친숙도)
  'vi': {
    defaultEnabled: false,
    preferredScript: 'traditional',
    showToggle: true,
    showHint: true,
    maxHintCount: 5
  },
  
  // 기본 비활성화 (낮은 친숙도)
  'en': {
    defaultEnabled: false,
    preferredScript: 'traditional',
    showToggle: true,
    showHint: true,
    maxHintCount: 10
  },
  'es': {
    defaultEnabled: false,
    preferredScript: 'traditional',
    showToggle: true,
    showHint: true,
    maxHintCount: 10
  },
  'fr': {
    defaultEnabled: false,
    preferredScript: 'traditional',
    showToggle: true,
    showHint: true,
    maxHintCount: 10
  },
  'de': {
    defaultEnabled: false,
    preferredScript: 'traditional',
    showToggle: true,
    showHint: true,
    maxHintCount: 10
  },
  'pt': {
    defaultEnabled: false,
    preferredScript: 'traditional',
    showToggle: true,
    showHint: true,
    maxHintCount: 10
  },
  'it': {
    defaultEnabled: false,
    preferredScript: 'traditional',
    showToggle: true,
    showHint: true,
    maxHintCount: 10
  },
  'ru': {
    defaultEnabled: false,
    preferredScript: 'traditional',
    showToggle: true,
    showHint: true,
    maxHintCount: 10
  }
};

// 기본 설정 (정의되지 않은 언어용)
const DEFAULT_HANJA_CONFIG: LocaleHanjaConfig = {
  defaultEnabled: false,
  preferredScript: 'traditional',
  showToggle: true,
  showHint: true,
  maxHintCount: 10
};

// 한자 친숙 언어 목록
export const HANJA_FRIENDLY_LOCALES = ['ja', 'zh-CN', 'zh-TW', 'ko'];

// 한자 생소 언어 목록 (힌트 필요)
export const HANJA_UNFAMILIAR_LOCALES = ['en', 'es', 'fr', 'de', 'pt', 'it', 'ru'];

// 언어별 설정 조회
export function getLocaleHanjaConfig(locale: Locale): LocaleHanjaConfig {
  return LOCALE_HANJA_CONFIG[locale] || DEFAULT_HANJA_CONFIG;
}

// 언어별 한자 토글 표시 여부
export function shouldShowHanjaToggle(locale: Locale): boolean {
  const config = getLocaleHanjaConfig(locale);
  return config.showToggle;
}

// 언어별 한자 힌트 표시 여부
export function shouldShowHanjaHint(locale: Locale, hintsSeen: number): boolean {
  const config = getLocaleHanjaConfig(locale);
  if (!config.showHint) return false;
  if (config.maxHintCount && hintsSeen >= config.maxHintCount) return false;
  return true;
}

// 언어별 기본 한자 활성화 여부
export function isHanjaEnabledByDefault(locale: Locale): boolean {
  const config = getLocaleHanjaConfig(locale);
  return config.defaultEnabled;
}

// 언어별 선호 한자 스크립트
export function getPreferredHanjaScript(locale: Locale): 'traditional' | 'simplified' {
  const config = getLocaleHanjaConfig(locale);
  return config.preferredScript;
}

// 사용자 한자 설정 관리
export class HanjaSettingsManager {
  private static SETTINGS_KEY = 'polarist-hanja-settings';

  // 사용자 설정 로드
  static getUserSettings(locale: Locale): UserHanjaSettings {
    if (typeof window === 'undefined') {
      // 서버 사이드에서는 기본값 반환
      const config = getLocaleHanjaConfig(locale);
      return {
        enabled: config.defaultEnabled,
        script: config.preferredScript,
        showEtymology: false,
        hintsSeen: 0
      };
    }

    const saved = localStorage.getItem(this.SETTINGS_KEY);
    const defaultConfig = getLocaleHanjaConfig(locale);
    
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        enabled: parsed.enabled ?? defaultConfig.defaultEnabled,
        script: parsed.script ?? defaultConfig.preferredScript,
        showEtymology: parsed.showEtymology ?? false,
        hintsSeen: parsed.hintsSeen ?? 0
      };
    }

    return {
      enabled: defaultConfig.defaultEnabled,
      script: defaultConfig.preferredScript,
      showEtymology: false,
      hintsSeen: 0
    };
  }

  // 사용자 설정 저장
  static saveUserSettings(settings: UserHanjaSettings): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }

  // 한자 모드 토글
  static toggleHanjaMode(locale: Locale): UserHanjaSettings {
    const current = this.getUserSettings(locale);
    const updated = { ...current, enabled: !current.enabled };
    this.saveUserSettings(updated);
    return updated;
  }

  // 힌트 표시 횟수 증가
  static incrementHintsSeen(locale: Locale): UserHanjaSettings {
    const current = this.getUserSettings(locale);
    const updated = { ...current, hintsSeen: current.hintsSeen + 1 };
    this.saveUserSettings(updated);
    return updated;
  }

  // 한자 스크립트 변경
  static setHanjaScript(locale: Locale, script: 'traditional' | 'simplified' | 'both'): UserHanjaSettings {
    const current = this.getUserSettings(locale);
    const updated = { ...current, script };
    this.saveUserSettings(updated);
    return updated;
  }

  // 설정 초기화
  static resetSettings(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.SETTINGS_KEY);
  }
}

// 언어별 한자 힌트 메시지
export const HANJA_HINT_MESSAGES: Record<string, string> = {
  'ja': '漢字表示',
  'zh-CN': '汉字显示',
  'zh-TW': '漢字顯示',
  'ko': '한자 표시',
  'vi': 'Hiển thị Hán tự',
  'en': 'Show Chinese characters',
  'es': 'Mostrar caracteres chinos',
  'fr': 'Afficher les caractères chinois',
  'de': 'Chinesische Zeichen anzeigen',
  'pt': 'Mostrar caracteres chineses',
  'it': 'Mostra caratteri cinesi',
  'ru': 'Показать китайские иероглифы'
};

export function getHanjaHintMessage(locale: Locale): string {
  return HANJA_HINT_MESSAGES[locale] || HANJA_HINT_MESSAGES['en'];
}