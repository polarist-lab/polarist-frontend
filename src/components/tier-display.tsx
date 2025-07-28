'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { TierSystemManager, UserTier, TIER_CONFIG, TierName } from '@/lib/tier-system';
import { useTranslations } from '@/lib/i18n';
import { Locale, isValidLocale } from '@/lib/i18n/config';

interface TierDisplayProps {
  showDetails?: boolean;
  compact?: boolean;
}

export function TierDisplay({ showDetails = false, compact = false }: TierDisplayProps) {
  const params = useParams();
  const locale = params?.locale as string;
  const validLocale: Locale = isValidLocale(locale) ? locale : 'en';
  const { t } = useTranslations(validLocale);
  
  const [userTier, setUserTier] = useState<UserTier>(TierSystemManager.getCurrentTier());
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // 실시간 티어 업데이트를 위한 interval
    const interval = setInterval(() => {
      const newTier = TierSystemManager.getCurrentTier();
      if (newTier.totalPoints !== userTier.totalPoints) {
        setUserTier(newTier);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [userTier.totalPoints]);

  const tierInfo = TIER_CONFIG[userTier.tier];
  const nextLevelInfo = TierSystemManager.getNextLevelInfo(userTier);

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${tierInfo.bgColor} ${tierInfo.borderColor} border ${isAnimating ? 'animate-pulse' : ''}`}>
        <span className="text-lg">{tierInfo.icon}</span>
        <span className={`font-semibold text-sm ${tierInfo.color}`}>
          {tierInfo.displayName} {userTier.subLevel}
        </span>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg border-2 ${tierInfo.borderColor} p-6 ${isAnimating ? 'animate-pulse' : ''}`}>
      {/* 티어 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`text-4xl ${isAnimating ? 'animate-bounce' : ''}`}>
            {tierInfo.icon}
          </div>
          <div>
            <h3 className={`text-2xl font-bold ${tierInfo.color}`}>
              {tierInfo.displayName} {userTier.subLevel}
            </h3>
            {tierInfo.topikLevel && (
              <p className="text-sm text-gray-600">{tierInfo.topikLevel}</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">{t('tier.totalPoints')}</div>
          <div className="text-xl font-bold text-blue-600">
            {userTier.totalPoints.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 진행률 바 */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{t('tier.nextLevel')}</span>
          <span>{t('tier.pointsRemaining', { points: userTier.pointsToNext })}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              tierInfo.name === 'iron' ? 'bg-gray-500' :
              tierInfo.name === 'bronze' ? 'bg-amber-500' :
              tierInfo.name === 'silver' ? 'bg-gray-400' :
              tierInfo.name === 'gold' ? 'bg-yellow-500' :
              tierInfo.name === 'platinum' ? 'bg-cyan-500' :
              'bg-blue-500'
            }`}
            style={{ 
              width: `${Math.max(10, 100 - (userTier.pointsToNext / (userTier.pointsToNext + userTier.currentPoints)) * 100)}%` 
            }}
          />
        </div>
      </div>

      {/* 다음 레벨 정보 */}
      {nextLevelInfo.nextTier && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{t('tier.nextLevelLabel')}</span>
            {nextLevelInfo.nextTier && (
              <>
                <span className="text-lg">{TIER_CONFIG[nextLevelInfo.nextTier].icon}</span>
                <span className="font-semibold">{nextLevelInfo.description}</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* 상세 정보 */}
      {showDetails && (
        <div className="space-y-3">
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-800 mb-2">{t('tier.tierDescription')}</h4>
            <p className="text-sm text-gray-600">{tierInfo.description}</p>
          </div>

          {/* 승급 요구사항 */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">{t('tier.promotionRequirements')}</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div>• {t('tier.minLessons', { count: tierInfo.promotionRequirements.minLessons })}</div>
              <div>• {t('tier.minTestScore', { score: tierInfo.promotionRequirements.minTestScore })}</div>
              <div>• {t('tier.requiredSkills', { skills: tierInfo.promotionRequirements.requiredSkills.join(', ') })}</div>
            </div>
          </div>

          {/* 승급 진행률 */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">{t('tier.promotionReadiness')}</h4>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${userTier.promotionProgress}%` }}
              />
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {t('tier.percentComplete', { percent: userTier.promotionProgress.toFixed(1) })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 티어 순위표 컴포넌트
export function TierRankingChart() {
  const params = useParams();
  const locale = params?.locale as string;
  const validLocale: Locale = isValidLocale(locale) ? locale : 'en';
  const { t } = useTranslations(validLocale);
  
  const tiers: TierName[] = ['diamond', 'platinum', 'gold', 'silver', 'bronze', 'iron'];
  const currentTier = TierSystemManager.getCurrentTier();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
        {t('tier.koreanRanking')}
      </h3>
      
      <div className="space-y-2">
        {tiers.map((tierName) => {
          const tierInfo = TIER_CONFIG[tierName];
          const isCurrentTier = currentTier.tier === tierName;
          
          return (
            <div 
              key={tierName}
              className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                isCurrentTier 
                  ? `${tierInfo.bgColor} ${tierInfo.borderColor} border-2 shadow-md` 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{tierInfo.icon}</span>
                <div>
                  <div className={`font-semibold ${isCurrentTier ? tierInfo.color : 'text-gray-700'}`}>
                    {tierInfo.displayName}
                    {isCurrentTier && ` ${currentTier.subLevel}`}
                  </div>
                  <div className="text-xs text-gray-600">
                    {tierInfo.topikLevel || tierInfo.description}
                  </div>
                </div>
              </div>
              
              {isCurrentTier && (
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-600">{t('tier.currentPosition')}</div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 포인트 증가 애니메이션 컴포넌트
export function PointsAnimation({ 
  points, 
  onComplete 
}: { 
  points: number; 
  onComplete: () => void 
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg animate-bounce">
        <div className="flex items-center gap-2">
          <span className="text-xl">✨</span>
          <span className="font-bold">+{points} 포인트!</span>
        </div>
      </div>
    </div>
  );
}