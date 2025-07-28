import { Translation } from '../types';

export const zhTw: Translation = {
  common: {
    home: '首頁',
    study: '學習', 
    test: '測驗',
    progress: '進度',
    startOver: '重新開始',
    next: '下一個',
    previous: '上一個',
    congratulations: '恭喜！',
    studyAgain: '再次學習',
  },

  home: {
    title: 'Polarist',
    subtitle: '用互動閃卡學習韓語',
    welcome: '歡迎來到韓語學習！',
    description: '用我們的互動閃卡系統開始學習最常用的韓語單字。適合想要建立堅實韓語詞彙基礎的初學者。',
    totalWords: '總單字數',
    wordsMastered: '已掌握單字', 
    wordsStudied: '已學習單字',
    overallProgress: '整體進度',
    progressByCategory: '分類進度',
    progressByDifficulty: '難度進度',
    continueStudying: '繼續學習',
    takeTest: '進行測驗',
    startJourney: '開始您的學習之旅，學習一些閃卡吧！',
    mostCommonWords: '最常用單字',
    interactiveCards: '互動卡片',
    mobileFriendly: '手機友善',
    mostCommonWordsDesc: '學習日常對話中最頻繁使用的韓語單字。',
    interactiveCardsDesc: '精美的3D翻轉動畫讓學習變得有趣且令人印象深刻。',
    mobileFriendlyDesc: '隨時隨地學習，我們的響應式設計針對手機進行了優化。',
  },

  study: {
    title: '學習模式',
    loading: '載入單字中...',
    instructions: '點擊卡片在韓語模式和完整資訊檢視之間切換',
    wordOf: '第 {{current}} 個單字，共 {{total}} 個',
    clickToSeeFullInfo: '點擊查看完整資訊',
    clickToSwitchToKoreanOnly: '點擊切換到韓語模式',
    keyboardShortcuts: '鍵盤快捷鍵',
    toggleInfo: '切換資訊',
    restart: '重新開始',
    toggleView: '切換檢視',
    youHaveSeen: '您已經看完所有',
    words: '單字！',
  },

  progress: {
    title: '您的進度',
    subtitle: '追蹤您的韓語學習之旅',
  },

  auth: {
    welcome: '✨ 歡迎來到 Polarist',
    signupSubtitle: '選擇帳號進行註冊',
    signinSubtitle: '選擇帳號進行登入',
    continueWithGoogle: '使用 Google 繼續',
    continueWithApple: '使用 Apple 繼續',
    comingSoon: '(即將推出)',
    cancel: '取消',
    signupProcessing: '註冊中...',
    signinProcessing: '登入中...',
    signupComplete: '註冊完成！正在跳轉到首頁...',
    signinComplete: '登入完成！正在跳轉到首頁...',
    redirectingHome: '正在跳轉到首頁...',
    authError: '驗證過程中發生錯誤，請重試。',
  },

  meta: {
    title: 'Polarist - 用閃卡學習韓語',
    description: '用互動閃卡掌握最常用的韓語單字。適合開始韓語學習之旅的繁體中文使用者。',
    keywords: '韓語,語言學習,閃卡,K-pop,K-drama,한국어,繁體中文',
  },

  targetLanguage: {
    name: '韓語',
    nativeName: '한국어',
    flag: '🇰🇷',
    direction: 'ltr',
  },
};