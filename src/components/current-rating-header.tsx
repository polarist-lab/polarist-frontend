'use client';

import { useState } from 'react';
import { Locale } from '@/lib/i18n/config';
import { TemporaryRating, TemporaryRatingManager } from '@/lib/temporary-rating-manager';

interface CurrentRatingHeaderProps {
  rating: TemporaryRating;
  locale: Locale;
  onRetakeAssessment: () => void;
}

export function CurrentRatingHeader({ rating, locale, onRetakeAssessment }: CurrentRatingHeaderProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  const { result } = rating;
  const badgeInfo = TemporaryRatingManager.getLevelBadgeInfo(result.overallLevel);
  const progressToNext = TemporaryRatingManager.getProgressToNextLevel(result.overallScore);
  const reassessmentCheck = TemporaryRatingManager.canReassess();
  const shouldSuggest = TemporaryRatingManager.shouldSuggestReassessment();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getSkillName = (skill: string) => {
    const names = {
      hangul: '한글',
      listening: '듣기',
      reading: '읽기', 
      speaking: '말하기',
      vocabulary: '어휘',
      grammar: '문법',
      cultural: '문화'
    };
    return names[skill as keyof typeof names] || skill;
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* 메인 레이팅 표시 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-6">
            {/* 레벨 배지 */}
            <div className="flex items-center gap-4">
              <div className={`${badgeInfo.color} w-16 h-16 rounded-full flex items-center justify-center text-2xl`}>
                {badgeInfo.icon}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {badgeInfo.name} 레벨
                  </h2>
                  <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-medium">
                    임시 레이팅
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{badgeInfo.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>전체 점수: {result.overallScore}/100</span>
                  <span>•</span>
                  <span>측정일: {formatDate(result.completedAt)}</span>
                  <span>•</span>
                  <span>{result.assessmentType === 'quick' ? '빠른 진단' : '정밀 진단'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {showDetails ? '간단히 보기' : '자세히 보기'}
            </button>
            
            <button
              onClick={onRetakeAssessment}
              disabled={!reassessmentCheck.allowed}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              레벨 재측정
            </button>
          </div>
        </div>

        {/* 재평가 제안 알림 */}
        {shouldSuggest.suggest && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">🎯</span>
              <div>
                <h4 className="font-medium text-green-800 mb-1">레벨 재측정을 권장합니다!</h4>
                <p className="text-green-700 text-sm">{shouldSuggest.reason}</p>
                <button
                  onClick={onRetakeAssessment}
                  className="mt-2 text-sm text-green-600 hover:text-green-800 font-medium"
                >
                  지금 재측정하기 →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 재평가 제한 안내 */}
        {!reassessmentCheck.allowed && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <span className="text-amber-600 text-xl">⏰</span>
              <div>
                <h4 className="font-medium text-amber-800 mb-1">재평가 대기 중</h4>
                <p className="text-amber-700 text-sm">
                  {reassessmentCheck.reason} 
                  {reassessmentCheck.nextAllowedTime && (
                    <span className="block mt-1">
                      다음 재평가 가능 시간: {formatDate(reassessmentCheck.nextAllowedTime)}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 다음 레벨까지의 진행률 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              다음 레벨까지의 진행률
            </span>
            <span className="text-sm text-gray-600">
              {progressToNext.pointsNeeded > 0 
                ? `${progressToNext.pointsNeeded}점 더 필요` 
                : '최고 레벨입니다!'
              }
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressToNext.progressPercent}%` }}
            />
          </div>
        </div>

        {/* 상세 정보 (토글) */}
        {showDetails && (
          <div className="border-t border-gray-200 pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* 능력별 점수 */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">능력별 상세 점수</h3>
                <div className="space-y-3">
                  {Object.entries(result.skillScores).map(([skill, score]) => (
                    <div key={skill} className="flex items-center justify-between">
                      <span className="text-gray-700">{getSkillName(skill)}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-600 w-12 text-right">
                          {score}/100
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 강점과 약점 */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">분석 결과</h3>
                
                {result.strengths.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-green-700 mb-2">🎯 강점</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.strengths.map((strength, index) => (
                        <span 
                          key={index}
                          className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full"
                        >
                          {getSkillName(strength)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {result.weaknesses.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-orange-700 mb-2">📈 개선 필요</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.weaknesses.map((weakness, index) => (
                        <span 
                          key={index}
                          className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full"
                        >
                          {getSkillName(weakness)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 추천사항 */}
                {result.recommendations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-blue-700 mb-2">💡 학습 추천</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {result.recommendations.slice(0, 3).map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}