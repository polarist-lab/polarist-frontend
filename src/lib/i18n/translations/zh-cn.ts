import { Translation } from '../types';

export const zhCn: Translation = {
  common: {
    home: '首页',
    study: '学习', 
    test: '测试',
    progress: '进度',
    startOver: '重新开始',
    next: '下一个',
    previous: '上一个',
    congratulations: '恭喜！',
    studyAgain: '再次学习',
  },

  home: {
    title: 'Polarist',
    subtitle: '用互动闪卡学习韩语',
    welcome: '欢迎来到韩语学习！',
    description: '用我们的互动闪卡系统开始学习最常用的韩语单词。适合想要建立坚实韩语词汇基础的初学者。',
    totalWords: '总单词数',
    wordsMastered: '已掌握单词', 
    wordsStudied: '已学习单词',
    overallProgress: '整体进度',
    progressByCategory: '分类进度',
    progressByDifficulty: '难度进度',
    continueStudying: '继续学习',
    takeTest: '进行测试',
    startJourney: '开始您的学习之旅，学习一些闪卡吧！',
    mostCommonWords: '最常用单词',
    interactiveCards: '互动卡片',
    mobileFriendly: '手机友好',
    mostCommonWordsDesc: '学习日常对话中最频繁使用的韩语单词。',
    interactiveCardsDesc: '精美的3D翻转动画让学习变得有趣且令人印象深刻。',
    mobileFriendlyDesc: '随时随地学习，我们的响应式设计针对手机进行了优化。',
  },

  study: {
    title: '学习模式',
    loading: '加载单词中...',
    instructions: '点击卡片在韩语模式和完整信息视图之间切换',
    wordOf: '第 {{current}} 个单词，共 {{total}} 个',
    clickToSeeFullInfo: '点击查看完整信息',
    clickToSwitchToKoreanOnly: '点击切换到韩语模式',
    keyboardShortcuts: '键盘快捷键',
    toggleInfo: '切换信息',
    restart: '重新开始',
    toggleView: '切换视图',
    youHaveSeen: '您已经看完所有',
    words: '单词！',
  },

  progress: {
    title: '您的进度',
    subtitle: '追踪您的韩语学习之旅',
  },

  auth: {
    welcome: '✨ 欢迎来到 Polarist',
    signupSubtitle: '选择账号进行注册',
    signinSubtitle: '选择账号进行登录',
    continueWithGoogle: '使用 Google 继续',
    continueWithApple: '使用 Apple 继续',
    comingSoon: '(即将推出)',
    cancel: '取消',
    signupProcessing: '注册中...',
    signinProcessing: '登录中...',
    signupComplete: '注册完成！正在跳转到首页...',
    signinComplete: '登录完成！正在跳转到首页...',
    redirectingHome: '正在跳转到首页...',
    authError: '认证过程中发生错误，请重试。',
  },

  meta: {
    title: 'Polarist - 用闪卡学习韩语',
    description: '用互动闪卡掌握最常用的韩语单词。适合开始韩语学习之旅的简体中文用户。',
    keywords: '韩语,语言学习,闪卡,K-pop,K-drama,한국어,简体中文',
  },

  targetLanguage: {
    name: '韩语',
    nativeName: '한국어',
    flag: '🇰🇷',
    direction: 'ltr',
  },
};