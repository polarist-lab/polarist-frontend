import { BilingualPost, KoreanLearnerProfile } from './types';

// Mock user profiles for testing
export const mockUser: KoreanLearnerProfile = {
  id: '1',
  username: 'john_doe',
  displayName: 'John Doe',
  email: 'john@example.com',
  nativeLanguage: 'en',
  topikLevel: 3,
  joinedAt: new Date('2024-01-15'),
  lastActiveAt: new Date(),
  bio: 'Learning Korean for 2 years',
  learningGoals: ['Daily conversation', 'Business Korean'],
  specialties: [],
  mentorshipPreference: 'receive',
  studyStreak: 15,
  totalPoints: 1250,
  badges: [],
  totalCorrectionsGiven: 0,
  totalCorrectionsReceived: 12,
  helpfulCorrectionsCount: 0,
  isVerified: false
};

export const mockMentor: KoreanLearnerProfile = {
  id: '2',
  username: 'korean_teacher',
  displayName: '박선생',
  email: 'teacher@example.com',
  nativeLanguage: 'ko',
  topikLevel: 6,
  joinedAt: new Date('2023-05-20'),
  lastActiveAt: new Date(),
  bio: 'Korean language teacher with 5 years experience',
  learningGoals: [],
  specialties: ['Grammar', 'Business Korean'],
  mentorshipPreference: 'provide',
  studyStreak: 120,
  totalPoints: 8500,
  badges: [],
  totalCorrectionsGiven: 156,
  totalCorrectionsReceived: 2,
  helpfulCorrectionsCount: 145,
  isVerified: true
};

export const mockIntermediateUser: KoreanLearnerProfile = {
  id: '3',
  username: 'sarah_kim',
  displayName: 'Sarah Kim',
  email: 'sarah@example.com',
  nativeLanguage: 'en',
  topikLevel: 4,
  joinedAt: new Date('2023-08-10'),
  lastActiveAt: new Date(),
  bio: 'Korean-American learning to improve my Korean',
  learningGoals: ['Academic Korean', 'Cultural understanding'],
  specialties: ['Pronunciation'],
  mentorshipPreference: 'both',
  studyStreak: 45,
  totalPoints: 3200,
  badges: [],
  totalCorrectionsGiven: 28,
  totalCorrectionsReceived: 15,
  helpfulCorrectionsCount: 22,
  isVerified: false
};

// Mock posts data for testing
export const mockPosts: BilingualPost[] = [
  {
    id: '1',
    authorId: '1',
    author: mockUser,
    originalText: "I had a wonderful day today! I went to a Korean cafe with my friends and tried some delicious Korean desserts. The atmosphere was so cozy and the staff was very friendly.",
    originalLanguage: 'en',
    translatedText: "오늘 정말 좋은 하루였어요! 친구들과 한국 카페에 가서 맛있는 한국 디저트를 먹었어요. 분위기가 너무 아늑하고 직원들이 매우 친절했어요.",
    translatedLanguage: 'ko',
    category: 'daily-life',
    difficulty: 'intermediate',
    tags: ['cafe', 'friends', 'food'],
    needsCorrection: true,
    likes: 24,
    comments: 8,
    shares: 3,
    bookmarks: 12,
    views: 156,
    isLikedByUser: false,
    isBookmarkedByUser: true,
    corrections: [
      {
        id: '1',
        postId: '1',
        authorId: '2',
        author: mockMentor,
        correctionType: 'grammar',
        severity: 'minor',
        corrections: [
          {
            id: '1',
            startIndex: 0,
            endIndex: 15,
            originalText: '좋은 하루였어요',
            correctedText: '좋은 하루를 보냈어요',
            type: 'grammar',
            explanation: '"보내다"를 사용하면 더 자연스러워요'
          }
        ],
        generalFeedback: '전반적으로 잘 번역하셨네요! 자연스러운 표현을 위해 약간의 수정을 제안합니다.',
        helpfulCount: 8,
        isMarkedHelpfulByUser: false,
        replies: [],
        createdAt: new Date('2024-08-04T14:30:00'),
        updatedAt: new Date('2024-08-04T14:30:00')
      }
    ],
    createdAt: new Date('2024-08-04T12:00:00'),
    updatedAt: new Date('2024-08-04T12:00:00'),
    publishedAt: new Date('2024-08-04T12:00:00'),
    isPublished: true,
    voiceData: {
      id: '1',
      audioUrl: '/audio/sample.mp3',
      duration: 45,
      transcription: '오늘 정말 좋은 하루였어요',
      accuracyScore: 87,
      waveformData: [],
      language: 'ko',
      isProcessing: false,
      uploadedAt: new Date('2024-08-04T12:00:00')
    }
  },
  {
    id: '2',
    authorId: '1',
    author: mockUser,
    originalText: "Learning Korean grammar is challenging but rewarding. Today I studied the difference between -은/는 and -이/가 particles.",
    originalLanguage: 'en',
    translatedText: "한국어 문법을 배우는 것은 어렵지만 보람이 있어요. 오늘은 은/는과 이/가 조사의 차이점을 공부했어요.",
    translatedLanguage: 'ko',
    category: 'grammar',
    difficulty: 'intermediate',
    tags: ['grammar', 'particles', 'study'],
    needsCorrection: false,
    likes: 45,
    comments: 12,
    shares: 8,
    bookmarks: 23,
    views: 289,
    isLikedByUser: true,
    isBookmarkedByUser: false,
    corrections: [],
    createdAt: new Date('2024-08-03T16:45:00'),
    updatedAt: new Date('2024-08-03T16:45:00'),
    publishedAt: new Date('2024-08-03T16:45:00'),
    isPublished: true
  },
  {
    id: '3',
    authorId: '3',
    author: mockIntermediateUser,
    originalText: "I'm planning to take the TOPIK exam next month. Any tips for the writing section?",
    originalLanguage: 'en',
    translatedText: "다음 달에 토픽 시험을 볼 예정입니다. 쓰기 영역에 대한 팁이 있나요?",
    translatedLanguage: 'ko',
    category: 'study-tips',
    difficulty: 'advanced',
    tags: ['TOPIK', 'exam', 'writing'],
    needsCorrection: true,
    likes: 18,
    comments: 15,
    shares: 5,
    bookmarks: 8,
    views: 142,
    isLikedByUser: false,
    isBookmarkedByUser: false,
    corrections: [
      {
        id: '2',
        postId: '3',
        authorId: '2',
        author: mockMentor,
        correctionType: 'vocabulary',
        severity: 'minor',
        corrections: [
          {
            id: '2',
            startIndex: 0,
            endIndex: 8,
            originalText: '볼 예정입니다',
            correctedText: '치를 예정입니다',
            type: 'vocabulary',
            explanation: '시험은 "치다"라는 동사를 사용합니다'
          }
        ],
        generalFeedback: '토픽 시험 준비 화이팅! 쓰기는 문법과 어휘를 정확히 사용하는 것이 중요해요.',
        helpfulCount: 12,
        isMarkedHelpfulByUser: true,
        replies: [
          {
            id: '1',
            parentId: '2',
            authorId: '3',
            author: mockIntermediateUser,
            content: '감사합니다! 정말 도움이 되었어요.',
            likes: 3,
            createdAt: new Date('2024-08-02T11:15:00'),
            updatedAt: new Date('2024-08-02T11:15:00')
          }
        ],
        createdAt: new Date('2024-08-02T10:30:00'),
        updatedAt: new Date('2024-08-02T10:30:00')
      }
    ],
    createdAt: new Date('2024-08-02T09:20:00'),
    updatedAt: new Date('2024-08-02T09:20:00'),
    publishedAt: new Date('2024-08-02T09:20:00'),
    isPublished: true
  },
  {
    id: '4',
    authorId: '2',
    author: mockMentor,
    originalText: "Here's a tip for Korean learners: When learning new vocabulary, try to learn words in context rather than isolated word lists.",
    originalLanguage: 'en',
    translatedText: "한국어 학습자들을 위한 팁입니다: 새로운 어휘를 배울 때는 단어 목록만 외우지 말고 문맥 속에서 배우세요.",
    translatedLanguage: 'ko',
    category: 'study-tips',
    difficulty: 'beginner',
    tags: ['vocabulary', 'tips', 'learning'],
    needsCorrection: false,
    likes: 67,
    comments: 22,
    shares: 15,
    bookmarks: 34,
    views: 423,
    isLikedByUser: true,
    isBookmarkedByUser: true,
    corrections: [],
    createdAt: new Date('2024-08-01T14:00:00'),
    updatedAt: new Date('2024-08-01T14:00:00'),
    publishedAt: new Date('2024-08-01T14:00:00'),
    isPublished: true
  },
  {
    id: '5',
    authorId: '1',
    author: mockUser,
    originalText: "I watched a Korean drama without subtitles today and understood about 60% of it! I'm so proud of my progress.",
    originalLanguage: 'en',
    translatedText: "오늘 자막 없이 한국 드라마를 봤는데 60% 정도 이해했어요! 제 발전이 너무 자랑스러워요.",
    translatedLanguage: 'ko',
    category: 'entertainment',
    difficulty: 'intermediate',
    tags: ['kdrama', 'progress', 'listening'],
    needsCorrection: true,
    likes: 89,
    comments: 18,
    shares: 12,
    bookmarks: 25,
    views: 334,
    isLikedByUser: false,
    isBookmarkedByUser: false,
    corrections: [],
    createdAt: new Date('2024-07-31T20:30:00'),
    updatedAt: new Date('2024-07-31T20:30:00'),
    publishedAt: new Date('2024-07-31T20:30:00'),
    isPublished: true,
    voiceData: {
      id: '2',
      audioUrl: '/audio/sample2.mp3',
      duration: 32,
      transcription: '오늘 자막 없이 한국 드라마를 봤어요',
      accuracyScore: 92,
      waveformData: [],
      language: 'ko',
      isProcessing: false,
      uploadedAt: new Date('2024-07-31T20:30:00')
    }
  }
];

// Utility functions for mock data management
export const getMockUserById = (userId: string): KoreanLearnerProfile | undefined => {
  const users = [mockUser, mockMentor, mockIntermediateUser];
  return users.find(user => user.id === userId);
};

export const getMockPostById = (postId: string): BilingualPost | undefined => {
  return mockPosts.find(post => post.id === postId);
};

export const getMockPostsByCategory = (category: string): BilingualPost[] => {
  return mockPosts.filter(post => post.category === category);
};

export const getMockPostsByDifficulty = (difficulty: string): BilingualPost[] => {
  return mockPosts.filter(post => post.difficulty === difficulty);
};

export const getMockPostsByAuthor = (authorId: string): BilingualPost[] => {
  return mockPosts.filter(post => post.authorId === authorId);
};