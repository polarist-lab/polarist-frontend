'use client';

import { useState } from 'react';
import { KoreanSNSLayout } from '@/components/korean-sns/layout/KoreanSNSLayout';
import { FeedContainer } from '@/components/korean-sns/layout/FeedContainer';
import { BilingualPost, KoreanLearnerProfile } from '@/lib/korean-sns/types';

// Mock data for testing
const mockUser: KoreanLearnerProfile = {
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

const mockMentor: KoreanLearnerProfile = {
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

const mockPosts: BilingualPost[] = [
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
  }
];

export default function KoreanSNSPage() {
  const [posts, setPosts] = useState<BilingualPost[]>(mockPosts);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likes: post.isLikedByUser ? post.likes - 1 : post.likes + 1,
              isLikedByUser: !post.isLikedByUser 
            }
          : post
      )
    );
  };

  const handleBookmark = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              bookmarks: post.isBookmarkedByUser ? post.bookmarks - 1 : post.bookmarks + 1,
              isBookmarkedByUser: !post.isBookmarkedByUser 
            }
          : post
      )
    );
  };

  const handleShare = (postId: string) => {
    // In a real app, this would open a share dialog or copy link
    navigator.clipboard?.writeText(`${window.location.origin}/korean-sns/post/${postId}`);
    console.log('Shared post:', postId);
  };

  const handleCorrect = (postId: string) => {
    console.log('Opening correction editor for post:', postId);
    // Navigate to correction editor
  };

  const handleComment = (postId: string) => {
    console.log('Opening comment editor for post:', postId);
    // Navigate to post detail with comment focus
  };

  const handleCreatePost = () => {
    console.log('Opening post creation modal/page');
    // Navigate to post creation page
  };

  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate loading more posts
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, you would fetch more posts from API
    }, 1500);
  };

  return (
    <KoreanSNSLayout
      currentUser={mockMentor}
      locale="en"
      onCreatePost={handleCreatePost}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Korean Learning Community
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Share your Korean learning journey and get help from fellow learners
        </p>
      </div>

      <FeedContainer
        posts={posts}
        currentUser={mockMentor}
        locale="en"
        isLoading={isLoading}
        hasMore={true}
        onLoadMore={handleLoadMore}
        onLike={handleLike}
        onBookmark={handleBookmark}
        onShare={handleShare}
        onCorrect={handleCorrect}
        onComment={handleComment}
      />
    </KoreanSNSLayout>
  );
}