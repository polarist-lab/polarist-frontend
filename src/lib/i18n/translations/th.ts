import { Translation } from '../types';

export const th: Translation = {
  common: {
    home: 'หน้าหลัก',
    study: 'เรียน', 
    test: 'ทดสอบ',
    progress: 'ความคืบหน้า',
    startOver: 'เริ่มใหม่',
    next: 'ถัดไป',
    previous: 'ก่อนหน้า',
    congratulations: 'ยินดีด้วย!',
    studyAgain: 'เรียนอีกครั้ง',
  },

  home: {
    title: 'Polarist',
    subtitle: 'เรียนภาษาเกาหลีด้วยแฟลชการ์ดแบบอินเทอร์แอคทีฟ',
    welcome: 'ยินดีต้อนรับสู่การเรียนภาษาเกาหลี!',
    description: 'เริ่มเรียนคำภาษาเกาหลีที่ใช้บ่อยที่สุดด้วยระบบแฟลชการ์ดแบบอินเทอร์แอคทีฟของเรา เหมาะสำหรับผู้เริ่มต้นที่ต้องการสร้างพื้นฐานคำศัพท์ภาษาเกาหลีที่แข็งแกร่ง',
    totalWords: 'คำทั้งหมด',
    wordsMastered: 'คำที่เชี่ยวชาญแล้ว', 
    wordsStudied: 'คำที่เรียนแล้ว',
    overallProgress: 'ความคืบหน้าโดยรวม',
    progressByCategory: 'ความคืบหน้าตามหมวดหมู่',
    progressByDifficulty: 'ความคืบหน้าตามระดับความยาก',
    continueStudying: 'เรียนต่อ',
    takeTest: 'ทำแบบทดสอบ',
    startJourney: 'เริ่มต้นการเรียนรู้ของคุณด้วยการศึกษาแฟลชการ์ด!',
    mostCommonWords: 'คำที่ใช้บ่อยที่สุด',
    interactiveCards: 'การ์ดแบบอินเทอร์แอคทีฟ',
    mobileFriendly: 'เป็นมิตรกับมือถือ',
    mostCommonWordsDesc: 'เรียนคำภาษาเกาหลีที่ใช้บ่อยที่สุดในการสนทนาประจำวัน',
    interactiveCardsDesc: 'แอนิเมชัน 3D ที่สวยงามทำให้การเรียนรู้น่าสนใจและจดจำได้',
    mobileFriendlyDesc: 'เรียนได้ทุกที่ทุกเวลาด้วยการออกแบบที่ตอบสนองและเหมาะสำหรับมือถือ',
  },

  study: {
    title: 'โหมดเรียน',
    loading: 'กำลังโหลดคำศัพท์...',
    instructions: 'คลิกการ์ดเพื่อสลับระหว่างมุมมองภาษาเกาหลีเท่านั้นและข้อมูลเต็ม',
    wordOf: 'คำที่ {{current}} จาก {{total}}',
    clickToSeeFullInfo: 'คลิกเพื่อดูข้อมูลเต็ม',
    clickToSwitchToKoreanOnly: 'คลิกเพื่อเปลี่ยนเป็นโหมดภาษาเกาหลีเท่านั้น',
    keyboardShortcuts: 'ทางลัดแป้นพิมพ์',
    toggleInfo: 'สลับข้อมูล',
    restart: 'เริ่มใหม่',
    toggleView: 'สลับมุมมอง',
    youHaveSeen: 'คุณได้เห็นทั้งหมด',
    words: 'คำแล้ว!',
  },

  progress: {
    title: 'ความคืบหน้าของคุณ',
    subtitle: 'ติดตามการเรียนรู้ภาษาเกาหลีของคุณ',
  },

  auth: {
    welcome: '✨ ยินดีต้อนรับสู่ Polarist',
    signupSubtitle: 'เลือกบัญชีสำหรับสมัครสมาชิก',
    signinSubtitle: 'เลือกบัญชีสำหรับเข้าสู่ระบบ',
    continueWithGoogle: 'ดำเนินการต่อด้วย Google',
    continueWithApple: 'ดำเนินการต่อด้วย Apple',
    comingSoon: '(เร็วๆ นี้)',
    cancel: 'ยกเลิก',
    signupProcessing: 'กำลังสมัครสมาชิก...',
    signinProcessing: 'กำลังเข้าสู่ระบบ...',
    signupComplete: 'สมัครสมาชิกเสร็จสิ้น! กำลังเปลี่ยนเส้นทางไปหน้าหลัก...',
    signinComplete: 'เข้าสู่ระบบเสร็จสิ้น! กำลังเปลี่ยนเส้นทางไปหน้าหลัก...',
    redirectingHome: 'กำลังเปลี่ยนเส้นทางไปหน้าหลัก...',
    authError: 'เกิดข้อผิดพลาดระหว่างการตรวจสอบสิทธิ์ กรุณาลองใหม่อีกครั้ง',
  },

  meta: {
    title: 'Polarist - เรียนภาษาเกาหลีด้วยแฟลชการ์ด',
    description: 'เชี่ยวชาญคำภาษาเกาหลีที่ใช้บ่อยที่สุดด้วยแฟลชการ์ดแบบอินเทอร์แอคทีฟ เหมาะสำหรับคนไทยที่เริ่มต้นการเรียนภาษาเกาหลี',
    keywords: 'เกาหลี,การเรียนภาษา,แฟลชการ์ด,K-pop,K-drama,한국어,ไทย',
  },

  targetLanguage: {
    name: 'ภาษาเกาหลี',
    nativeName: '한국어',
    flag: '🇰🇷',
    direction: 'ltr',
  },
};