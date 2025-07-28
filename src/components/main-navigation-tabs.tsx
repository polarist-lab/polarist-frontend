'use client';

import { useState, useEffect } from 'react';
import { Locale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';
import { NaturalSignupManager } from '@/lib/natural-signup-manager';

interface MainNavigationTabsProps {
  locale: Locale;
  activeTab: 'learning' | 'community';
  onTabChange: (tab: 'learning' | 'community') => void;
  showNotifications?: boolean;
}

interface TabInfo {
  id: 'learning' | 'community';
  title: string;
  subtitle: string;
  icon: string;
  activeIcon: string;
  color: string;
  activeColor: string;
  description: string;
  features: string[];
}

export function MainNavigationTabs({ 
  locale, 
  activeTab, 
  onTabChange, 
  showNotifications = true 
}: MainNavigationTabsProps) {
  const { t } = useTranslations(locale);
  const [progress, setProgress] = useState(NaturalSignupManager.getProgressSummary());
  const [hasNewCommunityContent, setHasNewCommunityContent] = useState(false);

  // 진행 상황 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(NaturalSignupManager.getProgressSummary());
    }, 30000); // 30초마다 업데이트

    return () => clearInterval(interval);
  }, []);

  // 커뮤니티 알림 시뮬레이션 (실제로는 API에서 가져올 것)
  useEffect(() => {
    // 사용자가 일정 수준 이상 학습했을 때 커뮤니티 알림 표시
    if (progress.totalLessons >= 5 && !NaturalSignupManager.isSignedUp()) {
      setHasNewCommunityContent(true);
    }
  }, [progress]);

  const tabs: TabInfo[] = [
    {
      id: 'learning',
      title: 'Study',
      subtitle: '학습',
      icon: '📚',
      activeIcon: '📖',
      color: 'text-blue-600',
      activeColor: 'bg-blue-50 border-blue-200 text-blue-700',
      description: '한국어 콘텐츠로 체계적으로 학습하세요',
      features: [
        '맞춤형 학습 로드맵',
        '다양한 학습 콘텐츠',
        '진도 추적 및 관리',
        '성취도 분석'
      ]
    },
    {
      id: 'community',
      title: 'Community',
      subtitle: '커뮤니티',
      icon: '👥',
      activeIcon: '💬',
      color: 'text-purple-600',
      activeColor: 'bg-purple-50 border-purple-200 text-purple-700',
      description: '다른 학습자들과 소통하고 도움을 받으세요',
      features: [
        '질문하기 & 답변받기',
        '학습 후기 공유',
        '스터디 그룹 참여',
        '한국어 실력 자랑'
      ]
    }
  ];

  const getTabContent = (tab: TabInfo) => {
    if (tab.id === 'learning') {
      return (
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>완료한 레슨</span>
            <span className="font-medium">{progress.totalLessons}개</span>
          </div>
          <div className="flex justify-between">
            <span>학습 시간</span>
            <span className="font-medium">{progress.totalHours}시간</span>
          </div>
          {progress.streakDays > 0 && (
            <div className="flex justify-between">
              <span>연속 학습</span>
              <span className="font-medium text-orange-600">{progress.streakDays}일</span>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span>새로운 질문 답변하기</span>
          </div>
          <div className="flex items-center gap-2">
            <span>학습 팁 공유하기</span>
          </div>
          <div className="flex items-center gap-2">
            <span>스터디 메이트 찾기</span>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* 헤더 네비게이션 */}
        <div className="flex items-center justify-between py-3">
          
          {/* 로고/브랜드 */}
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-blue-600">
              Polarist
            </div>
          </div>

          {/* 중앙 탭 네비게이션 */}
          <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? `${tab.activeColor} shadow-sm`
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {/* 텍스트 */}
                <div className="text-left">
                  <div className="font-semibold text-sm">
                    {tab.title}
                  </div>
                  <div className="text-xs opacity-75">
                    {tab.subtitle}
                  </div>
                </div>

                {/* 알림 배지 */}
                {showNotifications && tab.id === 'community' && hasNewCommunityContent && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>

          {/* 우측 정보 */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* 진행 상황 요약 */}
            <div className="text-right">
              <div className="text-xs text-gray-500">
                {progress.totalLessons}개 완료
              </div>
            </div>

            {/* 구분선 */}
            <div className="w-px h-8 bg-gray-300"></div>

            {/* 빠른 액션 */}
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium">
                Search
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium">
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}