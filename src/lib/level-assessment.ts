import { MiniTestQuestion, Difficulty } from './types';

// 레벨 평가용 미니테스트 질문들
export const MINI_TEST_QUESTIONS: MiniTestQuestion[] = [
  // 자음/모음 인식 (기초)
  {
    id: 'char-001',
    type: 'character-recognition',
    question: 'What sound does this Korean character make? ㅏ',
    options: ['ah', 'oh', 'oo', 'ee'],
    correctAnswer: 0,
    difficulty: 'absolute-beginner',
    category: 'character-recognition'
  },
  {
    id: 'char-002',
    type: 'character-recognition',
    question: 'Which character makes the "g/k" sound?',
    options: ['ㄴ', 'ㄱ', 'ㄷ', 'ㅁ'],
    correctAnswer: 1,
    difficulty: 'absolute-beginner',
    category: 'character-recognition'
  },
  {
    id: 'char-003',
    type: 'character-recognition',
    question: 'What does this character say? ㅎ',
    options: ['h', 'k', 'n', 'p'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'character-recognition'
  },

  // 기초 단어 인식
  {
    id: 'word-001',
    type: 'word-recognition',
    question: 'What does "안녕하세요" mean?',
    options: ['Goodbye', 'Thank you', 'Hello', 'Excuse me'],
    correctAnswer: 2,
    difficulty: 'absolute-beginner',
    category: 'word-recognition'
  },
  {
    id: 'word-002',
    type: 'word-recognition',
    question: 'Which word means "water"?',
    options: ['물', '불', '풀', '굴'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'word-recognition'
  },
  {
    id: 'word-003',
    type: 'word-recognition',
    question: 'What does "학교" mean?',
    options: ['Hospital', 'School', 'Library', 'Store'],
    correctAnswer: 1,
    difficulty: 'beginner',
    category: 'word-recognition'
  },
  {
    id: 'word-004',
    type: 'word-recognition',
    question: 'Which means "delicious"?',
    options: ['예쁘다', '맛있다', '크다', '작다'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'word-recognition'
  },

  // 문장 이해
  {
    id: 'sent-001',
    type: 'sentence-comprehension',
    question: 'What does "저는 학생입니다" mean?',
    options: [
      'I am a teacher',
      'I am a student', 
      'You are a student',
      'He is a student'
    ],
    correctAnswer: 1,
    difficulty: 'beginner',
    category: 'sentence-comprehension'
  },
  {
    id: 'sent-002',
    type: 'sentence-comprehension',
    question: 'Complete: "이것은 _____ 입니다." (This is a book)',
    options: ['책', '집', '차', '꽃'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'sentence-comprehension'
  },
  {
    id: 'sent-003',
    type: 'sentence-comprehension',
    question: 'What is the polite way to say "What is this?"',
    options: [
      '이게 뭐야?',
      '이것은 무엇입니까?',
      '뭐지?',
      '이거야?'
    ],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'sentence-comprehension'
  },
  {
    id: 'sent-004',
    type: 'sentence-comprehension',
    question: 'Which sentence means "I can speak Korean a little"?',
    options: [
      '한국어를 잘 해요',
      '한국어를 못해요', 
      '한국어를 조금 할 수 있어요',
      '한국어를 배워요'
    ],
    correctAnswer: 2,
    difficulty: 'upper-intermediate',
    category: 'sentence-comprehension'
  }
];

// 자가진단 질문들
export const SELF_ASSESSMENT_QUESTIONS = [
  {
    id: 'hangul-reading',
    question: 'Can you read Korean letters (Hangul)?',
    type: 'boolean',
    key: 'canReadHangul' as keyof any
  },
  {
    id: 'korean-experience',
    question: 'How would you describe your Korean experience?',
    type: 'choice',
    options: [
      { value: 'none', label: 'Complete beginner - no Korean knowledge' },
      { value: 'basic', label: 'Basic - know some words/phrases' },
      { value: 'intermediate', label: 'Intermediate - can have simple conversations' },
      { value: 'advanced', label: 'Advanced - comfortable with most situations' }
    ],
    key: 'koreanExperience' as keyof any
  },
  {
    id: 'learning-goals',
    question: 'What are your learning goals? (Select all that apply)',
    type: 'multiple',
    options: [
      { value: 'conversation', label: 'Daily conversation' },
      { value: 'business', label: 'Business Korean' },
      { value: 'travel', label: 'Travel in Korea' },
      { value: 'culture', label: 'Understanding K-pop/dramas' },
      { value: 'academic', label: 'Academic study' },
      { value: 'family', label: 'Communicating with Korean family/friends' }
    ],
    key: 'learningGoals' as keyof any
  },
  {
    id: 'study-time',
    question: 'How much time can you dedicate to studying Korean per week?',
    type: 'choice',
    options: [
      { value: 1, label: '1-2 hours per week' },
      { value: 3, label: '3-5 hours per week' },
      { value: 7, label: '5-10 hours per week' },
      { value: 15, label: 'More than 10 hours per week' }
    ],
    key: 'studyTimePerWeek' as keyof any
  },
  {
    id: 'learning-style',
    question: 'How do you prefer to learn?',
    type: 'choice',
    options: [
      { value: 'visual', label: 'Visual - reading, flashcards, written exercises' },
      { value: 'audio', label: 'Audio - listening, speaking, pronunciation practice' },
      { value: 'mixed', label: 'Mixed - combination of visual and audio methods' }
    ],
    key: 'preferredLearningStyle' as keyof any
  }
];

// 레벨별 설명
export const LEVEL_DESCRIPTIONS: Record<Difficulty, { title: string; description: string; features: string[] }> = {
  'absolute-beginner': {
    title: 'Absolute Beginner',
    description: 'Perfect for those just starting their Korean journey!',
    features: [
      'Learn Korean alphabet (Hangul)',
      'Basic pronunciation',
      'Essential greetings and phrases',
      'Numbers and basic vocabulary'
    ]
  },
  'beginner': {
    title: 'Beginner',
    description: 'You know some basics and ready to expand your knowledge.',
    features: [
      'Basic sentence structure',
      'Common daily vocabulary',
      'Simple present tense',
      'Basic conversation skills'
    ]
  },
  'intermediate': {
    title: 'Intermediate',
    description: 'You can handle basic conversations and want to improve fluency.',
    features: [
      'Past and future tenses',
      'More complex sentence structures',
      'Expanded vocabulary',
      'Casual vs. formal speech'
    ]
  },
  'upper-intermediate': {
    title: 'Upper Intermediate',
    description: 'You\'re comfortable with Korean and ready for advanced topics.',
    features: [
      'Complex grammar patterns',
      'Nuanced vocabulary',
      'Cultural expressions',
      'Advanced conversation topics'
    ]
  },
  'advanced': {
    title: 'Advanced',
    description: 'You have strong Korean skills and want to achieve fluency.',
    features: [
      'Advanced grammar and expressions',
      'Specialized vocabulary',
      'Business and academic Korean',
      'Native-like fluency goals'
    ]
  },
  'expert': {
    title: 'Expert',
    description: 'You\'re nearly fluent and want to perfect your Korean.',
    features: [
      'Idiomatic expressions',
      'Literature and poetry',
      'Professional Korean',
      'Cultural nuances'
    ]
  }
};

// 테스트 관련 유틸리티 함수들
export class LevelAssessment {
  // 적응형 테스트 - 답변에 따라 다음 질문 선택
  static getNextQuestions(
    currentLevel: Difficulty,
    correctAnswers: number,
    totalAnswered: number,
    maxQuestions: number = 8
  ): MiniTestQuestion[] {
    if (totalAnswered >= maxQuestions) {
      return [];
    }

    const accuracy = totalAnswered > 0 ? correctAnswers / totalAnswered : 0.5;
    let targetDifficulties: Difficulty[];

    // 정답률에 따라 다음 질문 난이도 조정
    if (accuracy > 0.8) {
      // 잘하고 있으면 더 어려운 문제
      targetDifficulties = this.getNextDifficultyLevels(currentLevel, 'up');
    } else if (accuracy < 0.4) {
      // 어려워하면 더 쉬운 문제
      targetDifficulties = this.getNextDifficultyLevels(currentLevel, 'down');
    } else {
      // 비슷한 난이도 유지
      targetDifficulties = [currentLevel];
    }

    // 타입별로 균형있게 선택
    const questionTypes = ['character-recognition', 'word-recognition', 'sentence-comprehension'];
    const questionsPerType = Math.ceil((maxQuestions - totalAnswered) / questionTypes.length);
    
    const selectedQuestions: MiniTestQuestion[] = [];
    
    for (const type of questionTypes) {
      const availableQuestions = MINI_TEST_QUESTIONS.filter(q => 
        q.type === type && 
        targetDifficulties.includes(q.difficulty)
      );
      
      const shuffled = this.shuffleArray([...availableQuestions]);
      selectedQuestions.push(...shuffled.slice(0, questionsPerType));
    }

    return this.shuffleArray(selectedQuestions).slice(0, maxQuestions - totalAnswered);
  }

  // 초기 질문 셋 (레벨 감지용)
  static getInitialQuestions(): MiniTestQuestion[] {
    // 각 타입별로 쉬운 문제부터 시작
    const initialQuestions = MINI_TEST_QUESTIONS.filter(q => 
      ['absolute-beginner', 'beginner'].includes(q.difficulty)
    );
    
    return this.shuffleArray(initialQuestions).slice(0, 3);
  }

  // 결과 분석
  static analyzeResults(
    questions: MiniTestQuestion[],
    answers: number[],
    timeSpent: number
  ) {
    const totalQuestions = questions.length;
    let correctAnswers = 0;
    const categoryScores: Record<string, { correct: number; total: number }> = {};

    // 카테고리별 점수 계산
    questions.forEach((question, index) => {
      const isCorrect = answers[index] === question.correctAnswer;
      if (isCorrect) correctAnswers++;

      if (!categoryScores[question.category]) {
        categoryScores[question.category] = { correct: 0, total: 0 };
      }
      categoryScores[question.category].total++;
      if (isCorrect) {
        categoryScores[question.category].correct++;
      }
    });

    // 강점/약점 분석
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    Object.entries(categoryScores).forEach(([category, score]) => {
      const accuracy = score.correct / score.total;
      if (accuracy >= 0.7) {
        strengths.push(category);
      } else if (accuracy < 0.4) {
        weaknesses.push(category);
      }
    });

    // 추정 레벨 계산
    const accuracy = correctAnswers / totalQuestions;
    const estimatedLevel = this.estimateLevelFromAccuracy(accuracy, questions);

    return {
      totalQuestions,
      correctAnswers,
      categoryScores,
      estimatedLevel,
      strengths,
      weaknesses,
      timeSpent
    };
  }

  // Private 유틸리티 함수들
  private static getNextDifficultyLevels(current: Difficulty, direction: 'up' | 'down'): Difficulty[] {
    const levels: Difficulty[] = ['absolute-beginner', 'beginner', 'intermediate', 'upper-intermediate', 'advanced', 'expert'];
    const currentIndex = levels.indexOf(current);
    
    if (direction === 'up') {
      return levels.slice(Math.min(currentIndex + 1, levels.length - 1), levels.length);
    } else {
      return levels.slice(0, Math.max(currentIndex, 1));
    }
  }

  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private static estimateLevelFromAccuracy(accuracy: number, questions: MiniTestQuestion[]): Difficulty {
    // 평균 난이도 계산
    const difficultyWeights = {
      'absolute-beginner': 1,
      'beginner': 2,
      'intermediate': 3,
      'upper-intermediate': 4,
      'advanced': 5,
      'expert': 6
    };

    const avgDifficulty = questions.reduce((sum, q) => sum + difficultyWeights[q.difficulty], 0) / questions.length;
    const adjustedScore = accuracy * avgDifficulty;

    if (adjustedScore < 1.5) return 'absolute-beginner';
    if (adjustedScore < 2.5) return 'beginner';
    if (adjustedScore < 3.5) return 'intermediate';
    if (adjustedScore < 4.5) return 'upper-intermediate';
    if (adjustedScore < 5.5) return 'advanced';
    return 'expert';
  }
}