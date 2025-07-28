'use client';

import { useState } from 'react';
import { Locale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';
import { useRouter } from 'next/navigation';

interface LearningRoadmapSelectorProps {
  locale: Locale;
  onRoadmapSelect: (roadmapId: string) => void;
}

interface LearningRoadmap {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  buttonColor: string;
  estimatedTime: string;
  features: string[];
  difficulty: 'absolute-beginner' | 'beginner' | 'intermediate';
  targetUsers: string[];
  firstSteps: string[];
}

export function LearningRoadmapSelector({ locale, onRoadmapSelect }: LearningRoadmapSelectorProps) {
  const { t } = useTranslations(locale);
  const router = useRouter();
  const [hoveredRoadmap, setHoveredRoadmap] = useState<string | null>(null);

  const roadmaps: LearningRoadmap[] = [
    {
      id: 'complete-beginner',
      title: t('roadmap.completeBeginner'),
      subtitle: 'Complete Beginner',
      description: t('roadmap.completeBeginnerDesc'),
      icon: '🌱',
      color: 'bg-gradient-to-br from-green-50 to-emerald-50',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      estimatedTime: '2-3개월',
      difficulty: 'absolute-beginner',
      features: [
        '한글 자모 완전 정복',
        '기본 발음 규칙 학습',
        '필수 어휘 500개',
        '간단한 문장 만들기',
        '기초 문법 이해'
      ],
      targetUsers: [
        '한국어를 처음 배우는 분',
        '한글을 못 읽는 분',
        '체계적으로 배우고 싶은 분'
      ],
      firstSteps: [
        '한글 자음 학습 (ㄱ, ㄴ, ㄷ...)',
        '한글 모음 학습 (ㅏ, ㅓ, ㅗ...)',
        '첫 한국어 단어 읽기'
      ]
    },
    {
      id: 'k-content-fan',
      title: t('roadmap.kContentFan'),
      subtitle: 'K-Content Fan',
      description: t('roadmap.kContentFanDesc'),
      icon: '🎬',
      color: 'bg-gradient-to-br from-pink-50 to-rose-50',
      buttonColor: 'bg-pink-600 hover:bg-pink-700',
      estimatedTime: '1-2개월',
      difficulty: 'beginner',
      features: [
        '드라마 자주 나오는 표현',
        'K-pop 가사 이해하기',
        '일상 대화 표현',
        '감정 표현 어휘',
        '젊은 세대 슬랭'
      ],
      targetUsers: [
        'K-drama 팬',
        'K-pop 좋아하는 분',
        '한국 문화에 관심 있는 분'
      ],
      firstSteps: [
        '드라마에서 자주 들리는 인사말',
        'K-pop에서 자주 나오는 단어',
        '감정 표현 배우기'
      ]
    },
    {
      id: 'travel-prep',
      title: t('roadmap.travelPrep'),
      subtitle: 'Travel Preparation',
      description: t('roadmap.travelPrepDesc'),
      icon: '✈️',
      color: 'bg-gradient-to-br from-blue-50 to-sky-50',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      estimatedTime: '3-4주',
      difficulty: 'beginner',
      features: [
        '공항, 호텔에서 쓰는 표현',
        '음식 주문하는 법',
        '길 묻고 대답하기',
        '쇼핑할 때 필요한 말',
        '응급상황 대처법'
      ],
      targetUsers: [
        '한국 여행 계획이 있는 분',
        '실용적인 표현만 배우고 싶은 분',
        '빠르게 필요한 것만 익히고 싶은 분'
      ],
      firstSteps: [
        '공항에서 쓰는 기본 표현',
        '호텔 체크인 할 때 말',
        '음식점에서 주문하기'
      ]
    },
    {
      id: 'business-korean',
      title: t('roadmap.businessKorean'),
      subtitle: 'Business Korean',
      description: t('roadmap.businessKoreanDesc'),
      icon: '💼',
      color: 'bg-gradient-to-br from-indigo-50 to-blue-50',
      buttonColor: 'bg-indigo-600 hover:bg-indigo-700',
      estimatedTime: '4-6개월',
      difficulty: 'intermediate',
      features: [
        '회사에서 쓰는 존댓말',
        '이메일 작성법',
        '회의에서 쓰는 표현',
        '프레젠테이션 한국어',
        '업무 관련 전문 용어'
      ],
      targetUsers: [
        '한국 회사에서 일하는 분',
        '한국 기업과 업무하는 분',
        '전문적인 한국어가 필요한 분'
      ],
      firstSteps: [
        '직장에서 쓰는 기본 인사',
        '동료와 대화하는 법',
        '간단한 업무 표현'
      ]
    }
  ];

  const handleRoadmapSelect = (roadmap: LearningRoadmap) => {
    // 로드맵 선택 정보 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('selected_roadmap', JSON.stringify({
        id: roadmap.id,
        title: roadmap.title,
        selectedAt: new Date().toISOString()
      }));
    }
    
    onRoadmapSelect(roadmap.id);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'absolute-beginner': return 'bg-green-100 text-green-700';
      case 'beginner': return 'bg-blue-100 text-blue-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'absolute-beginner': return '입문';
      case 'beginner': return '초급';
      case 'intermediate': return '중급';
      default: return difficulty;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* 헤더 */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          {t('roadmap.title')}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {t('roadmap.subtitle')}
        </p>
      </div>

      {/* 로드맵 카드들 */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {roadmaps.map((roadmap) => (
          <div
            key={roadmap.id}
            className={`${roadmap.color} rounded-3xl p-8 shadow-lg hover:shadow-xl transform transition-all duration-300 cursor-pointer border-2 ${
              hoveredRoadmap === roadmap.id 
                ? 'border-blue-300 scale-105' 
                : 'border-transparent hover:scale-102'
            }`}
            onMouseEnter={() => setHoveredRoadmap(roadmap.id)}
            onMouseLeave={() => setHoveredRoadmap(null)}
            onClick={() => handleRoadmapSelect(roadmap)}
          >
            {/* 카드 헤더 */}
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">{roadmap.icon}</div>
              <div className="flex items-center justify-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-800">
                  {roadmap.title}
                </h2>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(roadmap.difficulty)}`}>
                  {getDifficultyText(roadmap.difficulty)}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{roadmap.subtitle}</p>
              <div className="inline-flex items-center gap-2 bg-white bg-opacity-70 rounded-full px-4 py-2">
                <span className="text-lg">⏱️</span>
                <span className="font-semibold text-gray-700">{roadmap.estimatedTime}</span>
              </div>
            </div>

            {/* 설명 */}
            <p className="text-gray-700 text-center mb-6 leading-relaxed font-medium">
              {roadmap.description}
            </p>

            {/* 특징 */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3 text-center">{t('roadmap.whatYouWillLearn')}</h4>
              <div className="space-y-2">
                {roadmap.features.slice(0, 3).map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-white bg-opacity-50 rounded-lg p-3"
                  >
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
                {roadmap.features.length > 3 && (
                  <div className="text-center text-sm text-gray-600 mt-2">
                    +{roadmap.features.length - 3}개 더
                  </div>
                )}
              </div>
            </div>

            {/* 대상 */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3 text-center">{t('roadmap.recommendedFor')}</h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {roadmap.targetUsers.map((user, index) => (
                  <span
                    key={index}
                    className="bg-white bg-opacity-70 text-gray-700 text-xs px-3 py-1 rounded-full"
                  >
                    {user}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA 버튼 */}
            <button
              onClick={() => handleRoadmapSelect(roadmap)}
              className={`w-full ${roadmap.buttonColor} text-white py-4 rounded-2xl font-bold text-lg shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3`}
            >
              <span className="text-xl">🚀</span>
              {t('roadmap.startRoadmap', { title: roadmap.title })}
            </button>
          </div>
        ))}
      </div>

      {/* 추가 옵션 */}
      <div className="bg-white rounded-2xl p-8 shadow-md text-center">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            {t('roadmap.notSureYet')}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('roadmap.notSureDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push(`/${locale}/assessment`)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              {t('roadmap.takeLevelTest')}
            </button>
            <button
              onClick={() => handleRoadmapSelect(roadmaps[0])} // 완전 초보로 기본 설정
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              {t('roadmap.startAsCompleteBeginner')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}