'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Locale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';
import { UserStateManager } from '@/lib/user-state-manager';
import { LearningContent } from '@/lib/types';
import { ContentManager } from '@/lib/content-manager';

interface TrialModeProps {
  locale: Locale;
  onSignupPrompt: () => void;
}

type LevelOption = {
  id: 'beginner' | 'intermediate' | 'advanced';
  title: string;
  description: string;
  icon: string;
  color: string;
};

export function TrialMode({ locale, onSignupPrompt }: TrialModeProps) {
  const { t } = useTranslations(locale);
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced' | null>(null);
  const [showContent, setShowContent] = useState(false);
  const [allContent, setAllContent] = useState<LearningContent[]>([]);

  // 레벨 옵션들
  const levelOptions: LevelOption[] = [
    {
      id: 'beginner',
      title: t('trial.levelBeginner') || '초급자',
      description: t('trial.levelBeginnerDesc') || '한국어를 처음 배우거나 기초만 아는 상태',
      icon: '🌱',
      color: 'bg-green-500'
    },
    {
      id: 'intermediate',
      title: t('trial.levelIntermediate') || '중급자',
      description: t('trial.levelIntermediateDesc') || '기본 문법과 단어를 어느 정도 알고 있는 상태',
      icon: '🌿',
      color: 'bg-blue-500'
    },
    {
      id: 'advanced',
      title: t('trial.levelAdvanced') || '고급자',
      description: t('trial.levelAdvancedDesc') || '일상 대화는 가능하지만 더 향상시키고 싶은 상태',
      icon: '🌳',
      color: 'bg-purple-500'
    }
  ];

  // 콘텐츠 로드
  useEffect(() => {
    const loadContent = async () => {
      let content = ContentManager.getAllContent();
      if (content.length === 0) {
        try {
          const { ALL_CONTENT_PRESETS } = await import('@/data/content-presets');
          ALL_CONTENT_PRESETS.forEach(preset => {
            ContentManager.saveContent(preset);
          });
          content = ContentManager.getAllContent();
        } catch (error) {
          console.error('Failed to load content presets:', error);
        }
      }
      setAllContent(content);
    };

    loadContent();
  }, []);

  // 레벨별 추천 콘텐츠 필터링
  const recommendedContent = useMemo(() => {
    if (!selectedLevel || allContent.length === 0) return [];

    const levelMap = {
      beginner: ['absolute-beginner', 'beginner'],
      intermediate: ['beginner', 'intermediate'],
      advanced: ['intermediate', 'upper-intermediate', 'advanced']
    };

    return allContent
      .filter(content => 
        content.isPublished && 
        levelMap[selectedLevel].includes(content.difficulty)
      )
      .sort((a, b) => {
        // 난이도 순으로 정렬
        const difficultyOrder = ['absolute-beginner', 'beginner', 'intermediate', 'upper-intermediate', 'advanced', 'expert'];
        return difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty);
      })
      .slice(0, 6); // 최대 6개만 표시
  }, [selectedLevel, allContent]);

  const handleLevelSelect = (level: 'beginner' | 'intermediate' | 'advanced') => {
    setSelectedLevel(level);
    UserStateManager.startTrialMode(level);
    setShowContent(true);
  };

  const handleContentSelect = (content: LearningContent) => {
    // 체험 모드에서는 일부 콘텐츠만 접근 가능
    switch (content.type) {
      case 'wordbook':
        const wordbookId = content.id.replace('wordbook-', '');
        router.push(`/${locale}/study?wordbook=${wordbookId}&trial=true`);
        break;
      case 'sentence':
        router.push(`/${locale}/sentences/${content.id}?trial=true`);
        break;
      case 'roadmap':
        router.push(`/${locale}/roadmap/${content.id}?trial=true`);
        break;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'absolute-beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'beginner': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'upper-intermediate': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'wordbook': return '📖';
      case 'sentence': return '💬';
      case 'roadmap': return '🗺️';
      default: return '📚';
    }
  };

  if (!showContent) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-12">
            <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-4 mb-8 inline-block">
              <span className="text-yellow-700 font-medium">
                👀 {t('trial.modeIndicator') || '체험 모드로 둘러보는 중입니다'}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t('trial.levelCheckTitle') || '빠른 레벨 체크'}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('trial.levelCheckDesc') || '당신의 한국어 수준을 선택해주세요. 맞춤형 콘텐츠를 추천해드립니다.'}
            </p>
          </div>

          {/* 레벨 선택 카드들 */}
          <div className="grid md:grid-cols-3 gap-6">
            {levelOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleLevelSelect(option.id)}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 text-left border-2 border-transparent hover:border-blue-200"
              >
                <div className={`w-16 h-16 ${option.color} rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto`}>
                  {option.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                  {option.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {option.description}
                </p>
              </button>
            ))}
          </div>

          {/* 가입 유도 */}
          <div className="mt-12 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                💡 {t('trial.signupHint') || '더 정확한 레벨 진단을 원하시나요?'}
              </h3>
              <p className="text-blue-600 mb-4">
                {t('trial.signupBenefit') || '가입하시면 상세한 진단 테스트와 무제한 콘텐츠를 이용하실 수 있습니다'}
              </p>
              <button
                onClick={onSignupPrompt}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {t('trial.signupButton') || '가입하고 정확한 진단받기'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="bg-yellow-100 border border-yellow-200 rounded-lg px-4 py-2 inline-block mb-4">
              <span className="text-yellow-700 font-medium text-sm">
                👀 {t('trial.modeIndicator') || '체험 모드'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {selectedLevel && t(`trial.level${selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)}`)} {t('trial.recommendedContent') || '추천 콘텐츠'}
            </h1>
            <p className="text-gray-600 mt-2">
              {t('trial.contentDesc') || '당신의 레벨에 맞는 학습 콘텐츠를 엄선했습니다'}
            </p>
          </div>

          <button
            onClick={() => setShowContent(false)}
            className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            ← {t('common.back') || '뒤로'}
          </button>
        </div>

        {/* 추천 콘텐츠 그리드 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {recommendedContent.map((content, index) => (
            <div
              key={content.id}
              onClick={() => handleContentSelect(content)}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden"
            >
              {/* 체험 제한 표시 */}
              {index >= 3 && (
                <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                  🔒 제한
                </div>
              )}

              {/* 콘텐츠 정보 */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{content.icon || getContentTypeIcon(content.type)}</span>
                <div>
                  <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {content.title}
                  </h3>
                  <span className="text-xs text-gray-500">
                    ⏱️ {content.estimatedDuration}분
                  </span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {content.description}
              </p>

              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(content.difficulty)}`}>
                  {content.difficulty}
                </span>
                
                {index >= 3 && (
                  <span className="text-xs text-amber-600">
                    가입 후 이용 가능
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 가입 유도 섹션 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">
            🚀 {t('trial.unlockTitle') || '모든 콘텐츠를 해제하세요!'}
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            {t('trial.unlockDesc') || '지금 가입하시면 수백 개의 학습 콘텐츠와 개인 맞춤형 커리큘럼을 무제한으로 이용하실 수 있습니다.'}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onSignupPrompt}
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            >
              ✨ {t('common.signup') || '가입하기'}
            </button>
            <span className="text-blue-200 text-sm">
              {t('trial.signupTime') || '3분이면 완료!'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}