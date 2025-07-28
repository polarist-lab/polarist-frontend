'use client';

import { useState } from 'react';
import { Locale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';

interface MembershipBenefitsBannerProps {
  locale: Locale;
  onSignup: () => void;
  onLater: () => void;
}

interface Benefit {
  icon: string;
  title: string;
  description: string;
  color: string;
}

export function MembershipBenefitsBanner({ locale, onSignup, onLater }: MembershipBenefitsBannerProps) {
  const { t } = useTranslations(locale);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const benefits: Benefit[] = [
    {
      icon: '📊',
      title: t('membership.progressSaving'),
      description: t('membership.progressSavingDesc'),
      color: 'text-blue-600'
    },
    {
      icon: '🎯',
      title: t('membership.personalizedRecommendations'),
      description: t('membership.personalizedRecommendationsDesc'),
      color: 'text-green-600'
    },
    {
      icon: '🏆',
      title: t('membership.achievementBadges'),
      description: t('membership.achievementBadgesDesc'),
      color: 'text-yellow-600'
    },
    {
      icon: '👥',
      title: t('membership.communityParticipation'),
      description: t('membership.communityParticipationDesc'),
      color: 'text-purple-600'
    }
  ];

  if (isDismissed) {
    return null;
  }

  if (isMinimized) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">💡</span>
            <span className="text-sm font-medium text-gray-700">
              {t('membership.signUpBenefits')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(false)}
              className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded"
            >
              {t('membership.seeDetails')}
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 via-white to-purple-50 border border-blue-200 rounded-2xl p-6 mb-8 shadow-sm">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-10 h-10 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">✨</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {t('membership.title')}
            </h3>
            <p className="text-gray-600 text-sm">
              {t('membership.subtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="text-gray-400 hover:text-gray-600 text-sm px-2 py-1 rounded"
          >
            {t('membership.minimize')}
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none px-2"
          >
            ×
          </button>
        </div>
      </div>

      {/* 혜택 목록 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="text-center">
              <div className={`text-2xl mb-2 ${benefit.color}`}>
                {benefit.icon}
              </div>
              <h4 className="font-semibold text-gray-800 mb-1 text-sm">
                {benefit.title}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 액션 버튼들 */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onLater}
          className="px-6 py-3 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          {t('membership.signUpLater')}
        </button>
        
        <button
          onClick={onSignup}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg"
        >
          {t('membership.signUpNow')}
        </button>
      </div>

      {/* 추가 안내 */}
      <div className="text-center mt-4">
        <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
          <span>🔒</span>
          <span>{t('membership.freeSignup')}</span>
        </p>
      </div>
    </div>
  );
}