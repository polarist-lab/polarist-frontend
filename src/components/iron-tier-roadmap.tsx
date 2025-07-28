'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Locale } from '@/lib/i18n/config';

interface IronTierRoadmapProps {
  locale: Locale;
  currentTier?: string;
  completedTiers?: string[];
}

interface TierInfo {
  id: string;
  name: string;
  displayName: string;
  color: string;
  bgColor: string;
  description: string;
  requirements: string[];
  unlocked: boolean;
  completed: boolean;
  currentlyLearning: boolean;
  estimatedTime: string;
  badge: string;
}

export function IronTierRoadmap({ 
  locale, 
  currentTier = 'Iron5',
  completedTiers = []
}: IronTierRoadmapProps) {
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const tiers: TierInfo[] = [
    {
      id: 'Iron5',
      name: 'Iron 5',
      displayName: '입문자',
      color: 'text-gray-700',
      bgColor: 'bg-gray-100',
      description: '한글의 역사와 철학을 이해하고 기본 문자를 마스터합니다',
      requirements: [
        '한글 스토리 완주',
        '기본 모음 6개 학습',
        '기본 자음 9개 학습',
        '기본 음절 조합 연습'
      ],
      unlocked: true,
      completed: completedTiers.includes('Iron5'),
      currentlyLearning: currentTier === 'Iron5',
      estimatedTime: '5-7일',
      badge: '🔤'
    },
    {
      id: 'Iron4',
      name: 'Iron 4', 
      displayName: '초급자',
      color: 'text-orange-700',
      bgColor: 'bg-orange-100',
      description: '확장된 문자체계와 첫 단어들을 배웁니다',
      requirements: [
        '복합 모음 학습',
        '쌍자음 마스터',
        '절대초급 단어 50개',
        '기본 인사말 문장'
      ],
      unlocked: completedTiers.includes('Iron5') || currentTier === 'Iron4',
      completed: completedTiers.includes('Iron4'),
      currentlyLearning: currentTier === 'Iron4',
      estimatedTime: '1-2주',
      badge: '📚'
    },
    {
      id: 'Iron3',
      name: 'Iron 3',
      displayName: '기초자',
      color: 'text-amber-700',
      bgColor: 'bg-amber-100', 
      description: '기본 문법과 일상 어휘를 익힙니다',
      requirements: [
        '기본 조사 학습',
        '현재시제 동사활용',
        '초급 단어 100개',
        '일상대화 기초'
      ],
      unlocked: completedTiers.includes('Iron4') || currentTier === 'Iron3',
      completed: completedTiers.includes('Iron3'),
      currentlyLearning: currentTier === 'Iron3',
      estimatedTime: '2-3주',
      badge: '💬'
    },
    {
      id: 'Iron2',
      name: 'Iron 2',
      displayName: '발전자',
      color: 'text-green-700',
      bgColor: 'bg-green-100',
      description: '복잡한 문법과 실용적인 표현을 학습합니다',
      requirements: [
        '과거/미래 시제',
        '높임법 기초',
        '중급 단어 200개',
        '실용 회화 표현'
      ],
      unlocked: completedTiers.includes('Iron3') || currentTier === 'Iron2',
      completed: completedTiers.includes('Iron2'), 
      currentlyLearning: currentTier === 'Iron2',
      estimatedTime: '3-4주',
      badge: '🗣️'
    },
    {
      id: 'Iron1',
      name: 'Iron 1',
      displayName: '완성자',
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      description: '유창한 의사소통과 문화적 이해를 완성합니다',
      requirements: [
        '고급 문법 구조',
        '문화적 표현',
        '고급 단어 300개',
        'TOPIK 1급 준비'
      ],
      unlocked: completedTiers.includes('Iron2') || currentTier === 'Iron1',
      completed: completedTiers.includes('Iron1'),
      currentlyLearning: currentTier === 'Iron1',
      estimatedTime: '4-6주',
      badge: '🏆'
    }
  ];

  const handleTierClick = (tier: TierInfo) => {
    if (!tier.unlocked) return;
    
    if (tier.id === 'Iron5') {
      router.push(`/${locale}/characters/hangul-story-introduction`);
    } else {
      // 다른 티어들은 아직 구현 예정
      setSelectedTier(tier.id);
    }
  };

  const getConnectionLineClass = (index: number) => {
    const tier = tiers[index];
    const nextTier = tiers[index + 1];
    
    if (tier.completed && nextTier?.unlocked) {
      return 'bg-green-400';
    } else if (tier.currentlyLearning && nextTier?.unlocked) {
      return 'bg-yellow-400';
    } else {
      return 'bg-gray-300';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Iron 티어 로드맵
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          게임처럼 단계별로 학습하며 Iron 5에서 Iron 1까지 승급하세요. 
          각 티어를 완주하면 다음 단계가 해금됩니다.
        </p>
      </div>

      {/* Current Progress */}
      <div className="bg-white rounded-xl p-6 mb-8 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">현재 진행 상황</h2>
          <span className="text-sm text-gray-500">
            {completedTiers.length}/5 티어 완료
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
          <div 
            className="bg-gradient-to-r from-gray-600 to-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(completedTiers.length / 5) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-600">
          현재 티어: <span className="font-semibold">{currentTier}</span>
        </p>
      </div>

      {/* Tier Roadmap */}
      <div className="relative">
        {tiers.map((tier, index) => (
          <div key={tier.id} className="relative">
            {/* Tier Card */}
            <div 
              className={`relative ${tier.unlocked ? 'cursor-pointer' : 'cursor-not-allowed'} 
                transform transition-all duration-300 hover:scale-105`}
              onClick={() => handleTierClick(tier)}
            >
              <div className={`
                rounded-xl p-6 border-2 transition-all duration-300
                ${tier.currentlyLearning 
                  ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200' 
                  : tier.completed 
                    ? 'border-green-500 bg-green-50' 
                    : tier.unlocked 
                      ? `border-gray-300 ${tier.bgColor}` 
                      : 'border-gray-200 bg-gray-50 opacity-60'
                }
              `}>
                {/* Tier Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`text-3xl ${tier.unlocked ? '' : 'grayscale'}`}>
                      {tier.badge}
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${tier.color}`}>
                        {tier.name}
                      </h3>
                      <p className="text-sm text-gray-600">{tier.displayName}</p>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    {tier.completed && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        완료
                      </span>
                    )}
                    {tier.currentlyLearning && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        학습중
                      </span>
                    )}
                    {!tier.unlocked && (
                      <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs font-medium">
                        잠금
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {tier.description}
                </p>

                {/* Requirements */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">학습 내용:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {tier.requirements.map((req, reqIndex) => (
                      <div key={reqIndex} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        {req}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time Estimate */}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    예상 소요: {tier.estimatedTime}
                  </span>
                  {tier.unlocked && (
                    <button 
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        tier.currentlyLearning 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : tier.completed
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-600 text-white hover:bg-gray-700'
                      }`}
                    >
                      {tier.completed ? '복습하기' : tier.currentlyLearning ? '계속하기' : '시작하기'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Connection Line */}
            {index < tiers.length - 1 && (
              <div className="flex justify-center my-6">
                <div className={`w-1 h-8 rounded-full ${getConnectionLineClass(index)}`}></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tier Detail Modal */}
      {selectedTier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {selectedTier} - 준비 중
              </h3>
              <p className="text-gray-600 mb-6">
                이 티어는 현재 개발 중입니다. Iron5를 먼저 완료해주세요!
              </p>
              <button
                onClick={() => setSelectedTier(null)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}