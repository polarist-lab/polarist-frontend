import { ContentType } from './types';

// 통합 카드 레이아웃 표준
export const UNIFIED_CARD_LAYOUT = {
  // 카드 기본 구조
  container: 'flip-card w-full h-80 cursor-pointer select-none focus:outline-none',
  inner: 'flip-card-inner w-full h-full rounded-2xl shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
  
  // 카드 면 공통 스타일
  face: 'w-full h-full rounded-2xl bg-white text-gray-800 flex items-center justify-center',
  content: 'text-center p-8 w-full relative',
  
  // 메타데이터 배지 위치 (통일)
  topLeftBadge: 'absolute top-4 left-4 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium border border-gray-200',
  topRightBadge: 'absolute top-4 right-4 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium border border-gray-200',
  bottomRightBadge: 'absolute bottom-4 right-4',
  
  // 토글 버튼 위치 (통일)
  toggleButton: 'absolute top-4 right-4',
  toggleButtonBack: 'absolute bottom-4 right-4',
  
  // 주요 텍스트 크기 (콘텐츠별 조정 가능)
  mainText: {
    large: 'text-5xl font-bold mb-4',      // 단어
    extraLarge: 'text-8xl font-bold mb-6', // 문자
    medium: 'text-3xl font-bold mb-4'      // 문장
  },
  
  // 보조 텍스트
  subText: 'text-gray-600 text-xl font-medium mb-4',
  pronunciation: 'text-gray-700 text-xl italic font-mono mb-4 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200',
  translation: 'text-2xl font-semibold mb-6 text-gray-800',
  
  // 설명 텍스트
  instruction: 'text-gray-500 text-sm font-medium',
  etymology: 'text-gray-500 text-sm mb-4 italic',
  
  // 네비게이션 버튼 (통일)
  navigationContainer: 'flex gap-4 w-full',
  prevButton: `
    flex-1 bg-gray-100 text-gray-700 border border-gray-200 px-6 py-3 rounded-lg 
    font-medium transition-all duration-200 hover:bg-gray-200 hover:shadow-md 
    hover:-translate-y-0.5 cursor-pointer active:translate-y-0
  `,
  nextButton: `
    flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 
    hover:bg-gray-800 hover:shadow-md hover:-translate-y-0.5 cursor-pointer active:translate-y-0
  `,
  
  // 비활성화된 버튼
  disabledButton: 'opacity-50 cursor-not-allowed'
} as const;

// 콘텐츠 타입별 색상 시스템 (화이트 테마로 통일)
export const CONTENT_TYPE_COLORS = {
  wordbook: {
    front: 'bg-white',
    back: 'bg-white',
    navigation: 'bg-gray-900'
  },
  sentence: {
    front: 'bg-white',
    back: 'bg-white',
    navigation: 'bg-gray-900'
  },
  character: {
    front: 'bg-white',
    back: 'bg-white',
    navigation: 'bg-gray-900'
  },
  roadmap: {
    front: 'bg-white',
    back: 'bg-white',
    navigation: 'bg-gray-900'
  }
} as const;

// 문자 타입별 세부 색상 (화이트 테마로 통일, 아이콘 컬러로 구분)
export const CHARACTER_TYPE_COLORS = {
  vowel: {
    front: 'bg-white',
    back: 'bg-white',
    navigation: 'bg-gray-900',
    accent: 'text-red-500'
  },
  'complex-vowel': {
    front: 'bg-white',
    back: 'bg-white',
    navigation: 'bg-gray-900',
    accent: 'text-pink-500'
  },
  consonant: {
    front: 'bg-white',
    back: 'bg-white',
    navigation: 'bg-gray-900',
    accent: 'text-blue-500'
  },
  'double-consonant': {
    front: 'bg-white',
    back: 'bg-white',
    navigation: 'bg-gray-900',
    accent: 'text-purple-500'
  },
  syllable: {
    front: 'bg-white',
    back: 'bg-white',
    navigation: 'bg-gray-900',
    accent: 'text-green-500'
  },
  'vowel-review': {
    front: 'bg-white',
    back: 'bg-white',
    navigation: 'bg-gray-900',
    accent: 'text-teal-500'
  }
} as const;

// 스타일 헬퍼 함수들
export function getContentTypeColors(contentType: ContentType) {
  return CONTENT_TYPE_COLORS[contentType] || CONTENT_TYPE_COLORS.wordbook;
}

export function getCharacterTypeColors(characterType: string) {
  return CHARACTER_TYPE_COLORS[characterType as keyof typeof CHARACTER_TYPE_COLORS] || CHARACTER_TYPE_COLORS.consonant;
}

// 통합 카드 클래스 생성 헬퍼
export function createUnifiedCardClasses(
  contentType: ContentType,
  subType?: string,
  pressed?: boolean
) {
  const colors = subType && contentType === 'character' 
    ? getCharacterTypeColors(subType)
    : getContentTypeColors(contentType);
    
  return {
    container: `${UNIFIED_CARD_LAYOUT.container} ${pressed ? 'scale-95' : ''}`,
    inner: UNIFIED_CARD_LAYOUT.inner,
    front: `${UNIFIED_CARD_LAYOUT.face} ${colors.front}`,
    back: `${UNIFIED_CARD_LAYOUT.face} ${colors.back}`,
    content: UNIFIED_CARD_LAYOUT.content,
    navigationNext: `${UNIFIED_CARD_LAYOUT.nextButton} ${colors.navigation}`,
    colors
  };
}

// 반응형 텍스트 크기
export function getResponsiveTextSize(contentType: ContentType) {
  switch (contentType) {
    case 'character':
      return UNIFIED_CARD_LAYOUT.mainText.extraLarge;
    case 'sentence':
      return UNIFIED_CARD_LAYOUT.mainText.medium;
    case 'wordbook':
    default:
      return UNIFIED_CARD_LAYOUT.mainText.large;
  }
}

// 공통 메타데이터 배지 스타일
export function createMetadataBadge(content: string, position: 'topLeft' | 'topRight' = 'topLeft') {
  const positionClass = position === 'topLeft' 
    ? UNIFIED_CARD_LAYOUT.topLeftBadge 
    : UNIFIED_CARD_LAYOUT.topRightBadge;
    
  return {
    className: `${positionClass} capitalize`,
    content
  };
}

// 공통 네비게이션 버튼 props
export function createNavigationButtonProps(
  onPrevious?: () => void,
  onNext?: () => void,
  contentType: ContentType = 'wordbook',
  pressedButton?: string | null
) {
  const colors = getContentTypeColors(contentType);
  
  return {
    previousButton: {
      className: `${UNIFIED_CARD_LAYOUT.prevButton} ${
        !onPrevious ? UNIFIED_CARD_LAYOUT.disabledButton : ''
      } ${pressedButton === 'previous' ? 'translate-y-0 shadow-inner' : ''}`,
      onClick: onPrevious,
      disabled: !onPrevious
    },
    nextButton: {
      className: `${UNIFIED_CARD_LAYOUT.nextButton} ${colors.navigation} ${
        !onNext ? UNIFIED_CARD_LAYOUT.disabledButton : ''
      } ${pressedButton === 'next' ? 'translate-y-0 shadow-inner opacity-90' : ''}`,
      onClick: onNext,
      disabled: !onNext
    }
  };
}