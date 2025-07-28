/**
 * 향상된 한국어 레벨 진단 시스템
 * 한국어 4대 기능 (듣기, 말하기, 읽기, 쓰기) + 문자 체계를 체계적으로 평가
 */

export interface AssessmentQuestion {
  id: string;
  category: 'hangul' | 'listening' | 'reading' | 'speaking' | 'vocabulary' | 'grammar' | 'cultural';
  subcategory?: string;
  type: 'self-report' | 'multiple-choice' | 'true-false' | 'scale' | 'text-input';
  question: string;
  questionKo?: string; // 한국어 버전
  options?: { value: string | number; label: string; labelKo?: string }[];
  correctAnswer?: number | string;
  difficulty: 'absolute-beginner' | 'beginner' | 'intermediate' | 'upper-intermediate' | 'advanced' | 'expert';
  points: number; // 정답 시 획득 점수
  skillWeight: {
    hangul: number;
    listening: number;
    reading: number;
    speaking: number;
    vocabulary: number;
    grammar: number;
    cultural: number;
  };
}

// 빠른 진단용 자가 평가 질문들 (2-3분)
export const QUICK_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // 한글 기초 능력
  {
    id: 'hangul-basic',
    category: 'hangul',
    type: 'scale',
    question: 'How well can you read Korean letters (Hangul)?',
    questionKo: '한글을 얼마나 잘 읽을 수 있나요?',
    options: [
      { value: 0, label: 'Cannot read at all', labelKo: '전혀 읽을 수 없음' },
      { value: 1, label: 'Can read basic letters', labelKo: '기본 자모만 읽을 수 있음' },
      { value: 2, label: 'Can read simple words', labelKo: '간단한 단어를 읽을 수 있음' },
      { value: 3, label: 'Can read sentences', labelKo: '문장을 읽을 수 있음' },
      { value: 4, label: 'Can read fluently', labelKo: '유창하게 읽을 수 있음' }
    ],
    difficulty: 'beginner',
    points: 10,
    skillWeight: { hangul: 1, listening: 0, reading: 0.3, speaking: 0, vocabulary: 0.2, grammar: 0, cultural: 0 }
  },

  // 어휘 수준
  {
    id: 'vocabulary-level',
    category: 'vocabulary',
    type: 'scale',
    question: 'How many Korean words do you know approximately?',
    questionKo: '대략 얼마나 많은 한국어 단어를 알고 있나요?',
    options: [
      { value: 0, label: 'Less than 10 words', labelKo: '10개 미만' },
      { value: 1, label: '10-50 words', labelKo: '10-50개' },
      { value: 2, label: '50-200 words', labelKo: '50-200개' },
      { value: 3, label: '200-500 words', labelKo: '200-500개' },
      { value: 4, label: 'More than 500 words', labelKo: '500개 이상' }
    ],
    difficulty: 'beginner',
    points: 15,
    skillWeight: { hangul: 0, listening: 0.2, reading: 0.3, speaking: 0.3, vocabulary: 1, grammar: 0.1, cultural: 0.1 }
  },

  // 문장 인지 능력
  {
    id: 'sentence-recognition',
    category: 'vocabulary',
    type: 'scale',
    question: 'How many Korean sentences can you understand or use?',
    questionKo: '얼마나 많은 한국어 문장을 이해하거나 사용할 수 있나요?',
    options: [
      { value: 0, label: 'None', labelKo: '없음' },
      { value: 1, label: '1-5 basic sentences', labelKo: '1-5개 기본 문장' },
      { value: 2, label: '5-20 sentences', labelKo: '5-20개 문장' },
      { value: 3, label: '20-50 sentences', labelKo: '20-50개 문장' },
      { value: 4, label: 'More than 50 sentences', labelKo: '50개 이상' }
    ],
    difficulty: 'beginner',
    points: 15,
    skillWeight: { hangul: 0, listening: 0.2, reading: 0.3, speaking: 0.3, vocabulary: 0.3, grammar: 0.2, cultural: 0 }
  },

  // 듣기 능력
  {
    id: 'listening-ability',
    category: 'listening',
    type: 'scale',
    question: 'How well can you understand spoken Korean?',
    questionKo: '한국어 듣기를 얼마나 잘 할 수 있나요?',
    options: [
      { value: 0, label: 'Cannot understand at all', labelKo: '전혀 이해할 수 없음' },
      { value: 1, label: 'Can catch a few words', labelKo: '몇 개 단어만 들을 수 있음' },
      { value: 2, label: 'Can understand simple phrases', labelKo: '간단한 구문을 이해할 수 있음' },
      { value: 3, label: 'Can understand basic conversations', labelKo: '기본적인 대화를 이해할 수 있음' },
      { value: 4, label: 'Can understand most conversations', labelKo: '대부분의 대화를 이해할 수 있음' }
    ],
    difficulty: 'intermediate',
    points: 20,
    skillWeight: { hangul: 0, listening: 1, reading: 0, speaking: 0.2, vocabulary: 0.3, grammar: 0.2, cultural: 0.2 }
  },

  // 말하기 능력 - 자기소개
  {
    id: 'speaking-introduction',
    category: 'speaking',
    type: 'scale',
    question: 'Can you introduce yourself in Korean?',
    questionKo: '한국어로 자기소개를 할 수 있나요?',
    options: [
      { value: 0, label: 'Cannot introduce myself', labelKo: '자기소개를 할 수 없음' },
      { value: 1, label: 'Can say name only', labelKo: '이름만 말할 수 있음' },
      { value: 2, label: 'Can say name and basic info', labelKo: '이름과 기본 정보만 말할 수 있음' },
      { value: 3, label: 'Can give detailed introduction', labelKo: '상세한 자기소개를 할 수 있음' },
      { value: 4, label: 'Can introduce myself naturally', labelKo: '자연스럽게 자기소개를 할 수 있음' }
    ],
    difficulty: 'beginner',
    points: 20,
    skillWeight: { hangul: 0, listening: 0.1, reading: 0, speaking: 1, vocabulary: 0.4, grammar: 0.3, cultural: 0.2 }
  },

  // 전반적인 한국어 경험
  {
    id: 'overall-experience',
    category: 'cultural',
    type: 'scale',
    question: 'How would you describe your overall Korean language experience?',
    questionKo: '전반적인 한국어 경험을 어떻게 평가하시겠어요?',
    options: [
      { value: 0, label: 'Complete beginner', labelKo: '완전 초보자' },
      { value: 1, label: 'Basic level', labelKo: '기초 수준' },
      { value: 2, label: 'Intermediate level', labelKo: '중급 수준' },
      { value: 3, label: 'Upper-intermediate level', labelKo: '중상급 수준' },
      { value: 4, label: 'Advanced level', labelKo: '고급 수준' }
    ],
    difficulty: 'intermediate',
    points: 10,
    skillWeight: { hangul: 0.1, listening: 0.2, reading: 0.2, speaking: 0.2, vocabulary: 0.2, grammar: 0.2, cultural: 0.3 }
  }
];

// 정밀 진단용 세부 질문들 (10-15분)
export const DETAILED_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // === 한글 능력 세부 측정 ===
  {
    id: 'hangul-consonants',
    category: 'hangul',
    subcategory: 'consonants',
    type: 'multiple-choice',
    question: 'What sound does the Korean letter "ㄱ" make?',
    questionKo: '한국어 자음 "ㄱ"은 어떤 소리를 내나요?',
    options: [
      { value: 'g/k', label: 'g/k sound' },
      { value: 'n', label: 'n sound' },
      { value: 'm', label: 'm sound' },
      { value: 'd/t', label: 'd/t sound' }
    ],
    correctAnswer: 'g/k',
    difficulty: 'absolute-beginner',
    points: 5,
    skillWeight: { hangul: 1, listening: 0, reading: 0.2, speaking: 0.1, vocabulary: 0, grammar: 0, cultural: 0 }
  },

  {
    id: 'hangul-double-consonants',
    category: 'hangul',
    subcategory: 'double-consonants',
    type: 'multiple-choice',
    question: 'Which of these is a Korean double consonant (쌍자음)?',
    questionKo: '다음 중 한국어 쌍자음은 무엇인가요?',
    options: [
      { value: 'ㄱ', label: 'ㄱ' },
      { value: 'ㄲ', label: 'ㄲ' },
      { value: 'ㄴ', label: 'ㄴ' },
      { value: 'ㅁ', label: 'ㅁ' }
    ],
    correctAnswer: 'ㄲ',
    difficulty: 'beginner',
    points: 8,
    skillWeight: { hangul: 1, listening: 0.1, reading: 0.3, speaking: 0.2, vocabulary: 0, grammar: 0, cultural: 0 }
  },

  {
    id: 'hangul-vowels',
    category: 'hangul',
    subcategory: 'vowels',
    type: 'multiple-choice',
    question: 'What sound does "ㅏ" make?',
    questionKo: '모음 "ㅏ"는 어떤 소리를 내나요?',
    options: [
      { value: 'ah', label: 'ah (like "father")' },
      { value: 'oh', label: 'oh (like "go")' },
      { value: 'uh', label: 'uh (like "cup")' },
      { value: 'ee', label: 'ee (like "see")' }
    ],
    correctAnswer: 'ah',
    difficulty: 'absolute-beginner',
    points: 5,
    skillWeight: { hangul: 1, listening: 0.1, reading: 0.2, speaking: 0.2, vocabulary: 0, grammar: 0, cultural: 0 }
  },

  // === 어휘 능력 세부 측정 ===
  {
    id: 'vocab-greetings',
    category: 'vocabulary',
    subcategory: 'greetings',
    type: 'multiple-choice',
    question: 'What does "안녕하세요" mean?',
    questionKo: '"안녕하세요"는 무슨 뜻인가요?',
    options: [
      { value: 'hello', label: 'Hello' },
      { value: 'goodbye', label: 'Goodbye' },
      { value: 'thank you', label: 'Thank you' },
      { value: 'excuse me', label: 'Excuse me' }
    ],
    correctAnswer: 'hello',
    difficulty: 'absolute-beginner',
    points: 5,
    skillWeight: { hangul: 0, listening: 0.2, reading: 0.2, speaking: 0.3, vocabulary: 1, grammar: 0, cultural: 0.3 }
  },

  {
    id: 'vocab-numbers',
    category: 'vocabulary',
    subcategory: 'numbers',
    type: 'multiple-choice',
    question: 'What does "하나" mean?',
    questionKo: '"하나"는 무슨 뜻인가요?',
    options: [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' },
      { value: 'three', label: 'Three' },
      { value: 'zero', label: 'Zero' }
    ],
    correctAnswer: 'one',
    difficulty: 'beginner',
    points: 8,
    skillWeight: { hangul: 0, listening: 0.2, reading: 0.2, speaking: 0.2, vocabulary: 1, grammar: 0.1, cultural: 0 }
  },

  // === 문법 능력 측정 ===
  {
    id: 'grammar-particles',
    category: 'grammar',
    subcategory: 'particles',
    type: 'multiple-choice',
    question: 'Choose the correct particle: 저는 한국어___ 배워요',
    questionKo: '올바른 조사를 선택하세요: 저는 한국어___ 배워요',
    options: [
      { value: '를', label: '를' },
      { value: '가', label: '가' },
      { value: '에', label: '에' },
      { value: '와', label: '와' }
    ],
    correctAnswer: '를',
    difficulty: 'intermediate',
    points: 15,
    skillWeight: { hangul: 0, listening: 0.1, reading: 0.3, speaking: 0.3, vocabulary: 0.2, grammar: 1, cultural: 0 }
  },

  // === 듣기 능력 세부 측정 ===
  {
    id: 'listening-basic',
    category: 'listening',
    subcategory: 'basic',
    type: 'self-report',
    question: 'Can you understand when someone speaks slowly in Korean about everyday topics?',
    questionKo: '누군가 일상적인 주제에 대해 천천히 한국어로 말할 때 이해할 수 있나요?',
    options: [
      { value: 0, label: 'Never', labelKo: '전혀 안됨' },
      { value: 1, label: 'Rarely', labelKo: '거의 안됨' },
      { value: 2, label: 'Sometimes', labelKo: '가끔' },
      { value: 3, label: 'Often', labelKo: '자주' },
      { value: 4, label: 'Always', labelKo: '항상' }
    ],
    difficulty: 'intermediate',
    points: 15,
    skillWeight: { hangul: 0, listening: 1, reading: 0, speaking: 0.2, vocabulary: 0.4, grammar: 0.3, cultural: 0.2 }
  },

  // === 읽기 능력 세부 측정 ===
  {
    id: 'reading-comprehension',
    category: 'reading',
    subcategory: 'comprehension',
    type: 'self-report',
    question: 'Can you read and understand simple Korean texts (like signs, menus)?',
    questionKo: '간단한 한국어 텍스트(간판, 메뉴 등)를 읽고 이해할 수 있나요?',
    options: [
      { value: 0, label: 'Cannot read at all', labelKo: '전혀 읽을 수 없음' },
      { value: 1, label: 'Can read but not understand', labelKo: '읽을 수는 있지만 이해할 수 없음' },
      { value: 2, label: 'Can understand some words', labelKo: '일부 단어를 이해할 수 있음' },
      { value: 3, label: 'Can understand most content', labelKo: '대부분의 내용을 이해할 수 있음' },
      { value: 4, label: 'Can understand completely', labelKo: '완전히 이해할 수 있음' }
    ],
    difficulty: 'intermediate',
    points: 15,
    skillWeight: { hangul: 0.2, listening: 0, reading: 1, speaking: 0, vocabulary: 0.5, grammar: 0.3, cultural: 0.2 }
  },

  // === 말하기 능력 세부 측정 ===
  {
    id: 'speaking-conversation',
    category: 'speaking',
    subcategory: 'conversation',
    type: 'self-report',
    question: 'Can you have a basic conversation in Korean (asking directions, ordering food)?',
    questionKo: '한국어로 기본적인 대화(길 묻기, 음식 주문 등)를 할 수 있나요?',
    options: [
      { value: 0, label: 'Cannot speak at all', labelKo: '전혀 말할 수 없음' },
      { value: 1, label: 'Can say isolated words', labelKo: '단어만 말할 수 있음' },
      { value: 2, label: 'Can make simple sentences', labelKo: '간단한 문장을 만들 수 있음' },
      { value: 3, label: 'Can have basic conversations', labelKo: '기본적인 대화를 할 수 있음' },
      { value: 4, label: 'Can speak fluently', labelKo: '유창하게 말할 수 있음' }
    ],
    difficulty: 'intermediate',
    points: 20,
    skillWeight: { hangul: 0, listening: 0.2, reading: 0, speaking: 1, vocabulary: 0.4, grammar: 0.4, cultural: 0.3 }
  },

  // === 문화적 이해도 측정 ===
  {
    id: 'cultural-honorifics',
    category: 'cultural',
    subcategory: 'honorifics',
    type: 'multiple-choice',
    question: 'When meeting someone older or in a higher position, which greeting is more appropriate?',
    questionKo: '나이가 많거나 지위가 높은 사람을 만날 때 더 적절한 인사는?',
    options: [
      { value: '안녕', label: '안녕' },
      { value: '안녕하세요', label: '안녕하세요' },
      { value: '안녕하십니까', label: '안녕하십니까' },
      { value: '어서오세요', label: '어서오세요' }
    ],
    correctAnswer: '안녕하십니까',
    difficulty: 'upper-intermediate',
    points: 15,
    skillWeight: { hangul: 0, listening: 0.1, reading: 0.1, speaking: 0.4, vocabulary: 0.2, grammar: 0.3, cultural: 1 }
  }
];

// 레벨 계산 알고리즘
export interface SkillScores {
  hangul: number;
  listening: number;
  reading: number;
  speaking: number;
  vocabulary: number;
  grammar: number;
  cultural: number;
}

export interface AssessmentResult {
  overallLevel: string;
  overallScore: number;
  skillScores: SkillScores;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  isTemporary: boolean;
  assessmentType: 'quick' | 'detailed';
  completedAt: Date;
}

export class LevelAssessmentEngine {
  static calculateLevel(answers: Record<string, any>, assessmentType: 'quick' | 'detailed'): AssessmentResult {
    const questions = assessmentType === 'quick' ? QUICK_ASSESSMENT_QUESTIONS : DETAILED_ASSESSMENT_QUESTIONS;
    
    let skillScores: SkillScores = {
      hangul: 0,
      listening: 0,
      reading: 0,
      speaking: 0,
      vocabulary: 0,
      grammar: 0,
      cultural: 0
    };

    let totalPoints = 0;
    let maxPoints = 0;

    // 점수 계산
    questions.forEach(question => {
      const answer = answers[question.id];
      if (answer !== undefined) {
        let points = 0;
        
        if (question.type === 'multiple-choice' && answer === question.correctAnswer) {
          points = question.points;
        } else if (question.type === 'scale' || question.type === 'self-report') {
          const maxValue = Math.max(...(question.options?.map(opt => Number(opt.value)) || [4]));
          points = (Number(answer) / maxValue) * question.points;
        }

        totalPoints += points;
        
        // 각 스킬별 점수 가중 적용
        Object.entries(question.skillWeight).forEach(([skill, weight]) => {
          skillScores[skill as keyof SkillScores] += points * weight;
        });
      }
      
      maxPoints += question.points;
    });

    // 전체 점수 (0-100)
    const overallScore = Math.round((totalPoints / maxPoints) * 100);

    // 각 스킬 정규화 (0-100)
    const maxSkillScores = this.calculateMaxSkillScores(questions);
    Object.keys(skillScores).forEach(skill => {
      const key = skill as keyof SkillScores;
      if (maxSkillScores[key] > 0) {
        skillScores[key] = Math.round((skillScores[key] / maxSkillScores[key]) * 100);
      }
    });

    // 레벨 결정
    const overallLevel = this.determineLevel(overallScore);

    // 강점/약점 분석
    const { strengths, weaknesses } = this.analyzeStrengthsWeaknesses(skillScores);

    // 추천사항 생성
    const recommendations = this.generateRecommendations(overallLevel, skillScores, weaknesses);

    return {
      overallLevel,
      overallScore,
      skillScores,
      strengths,
      weaknesses,
      recommendations,
      isTemporary: true,
      assessmentType,
      completedAt: new Date()
    };
  }

  private static calculateMaxSkillScores(questions: AssessmentQuestion[]): SkillScores {
    let maxScores: SkillScores = {
      hangul: 0,
      listening: 0,
      reading: 0,
      speaking: 0,
      vocabulary: 0,
      grammar: 0,
      cultural: 0
    };

    questions.forEach(question => {
      Object.entries(question.skillWeight).forEach(([skill, weight]) => {
        maxScores[skill as keyof SkillScores] += question.points * weight;
      });
    });

    return maxScores;
  }

  private static determineLevel(score: number): string {
    if (score >= 90) return 'expert';
    if (score >= 75) return 'advanced';
    if (score >= 60) return 'upper-intermediate';
    if (score >= 45) return 'intermediate';
    if (score >= 25) return 'beginner';
    return 'absolute-beginner';
  }

  private static analyzeStrengthsWeaknesses(skillScores: SkillScores): { strengths: string[]; weaknesses: string[] } {
    const skills = Object.entries(skillScores);
    const avgScore = Object.values(skillScores).reduce((sum, score) => sum + score, 0) / skills.length;

    const strengths = skills
      .filter(([_, score]) => score > avgScore + 10)
      .map(([skill, _]) => skill);

    const weaknesses = skills
      .filter(([_, score]) => score < avgScore - 10)
      .map(([skill, _]) => skill);

    return { strengths, weaknesses };
  }

  private static generateRecommendations(level: string, skillScores: SkillScores, weaknesses: string[]): string[] {
    const recommendations: string[] = [];

    // 레벨별 기본 추천
    switch (level) {
      case 'absolute-beginner':
        recommendations.push('Start with basic Hangul learning');
        recommendations.push('Focus on essential greetings and phrases');
        break;
      case 'beginner':
        recommendations.push('Expand your vocabulary with common words');
        recommendations.push('Practice basic sentence structures');
        break;
      case 'intermediate':
        recommendations.push('Work on listening comprehension');
        recommendations.push('Practice everyday conversations');
        break;
      default:
        recommendations.push('Continue building advanced skills');
    }

    // 약점 기반 추천
    weaknesses.forEach(weakness => {
      switch (weakness) {
        case 'hangul':
          recommendations.push('Practice reading Korean characters more');
          break;
        case 'listening':
          recommendations.push('Listen to Korean audio content regularly');
          break;
        case 'speaking':
          recommendations.push('Practice speaking with conversation exercises');
          break;
        case 'vocabulary':
          recommendations.push('Expand your vocabulary with flashcards');
          break;
        case 'grammar':
          recommendations.push('Study Korean grammar patterns');
          break;
        case 'cultural':
          recommendations.push('Learn about Korean culture and etiquette');
          break;
      }
    });

    return recommendations.slice(0, 5); // 최대 5개 추천
  }
}