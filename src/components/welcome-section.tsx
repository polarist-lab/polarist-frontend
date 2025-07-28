'use client';

import { useState } from 'react';
import { Locale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';
import { UserStateManager } from '@/lib/user-state-manager';

interface WelcomeSectionProps {
  locale: Locale;
  onStartTrial: () => void;
  onStartSignup: () => void;
}

export function WelcomeSection({ locale, onStartTrial, onStartSignup }: WelcomeSectionProps) {
  const { t } = useTranslations(locale);
  const [isAnimated, setIsAnimated] = useState(false);

  // 애니메이션 트리거
  useState(() => {
    setTimeout(() => setIsAnimated(true), 100);
  });

  const benefits = [
    {
      icon: '🎯',
      title: t('welcome.benefit1Title') || '맞춤형 커리큘럼',
      description: t('welcome.benefit1Desc') || '당신의 레벨에 완벽하게 맞는 학습 계획'
    },
    {
      icon: '📊',
      title: t('welcome.benefit2Title') || '진도 관리',
      description: t('welcome.benefit2Desc') || '학습 기록 저장 및 성취도 추적'
    },
    {
      icon: '🏆',
      title: t('welcome.benefit3Title') || '검증된 방법',
      description: t('welcome.benefit3Desc') || '10만+ 학습자가 검증한 효과적인 방법'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className={`max-w-4xl mx-auto text-center transform transition-all duration-1000 ${
        isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        
        {/* 메인 헤딩 */}
        <div className="mb-12">
          <div className="text-6xl mb-6 animate-bounce">🇰🇷</div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              한국어 학습
            </span>
            <br />
            <span className="text-gray-700">
              {t('welcome.mainTitle') || '지금 시작하세요!'}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t('welcome.subtitle') || '3분 가입으로 당신만의 맞춤형 한국어 학습 여정을 시작하세요'}
          </p>
        </div>

        {/* 혜택 카드들 */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* 주 CTA - 가입하기 */}
          <button
            onClick={onStartSignup}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 min-w-[240px] justify-center"
          >
            <span className="text-2xl">🚀</span>
            {t('welcome.signupButton') || '가입하고 시작하기'}
          </button>

          {/* 보조 CTA - 체험하기 */}
          <button
            onClick={onStartTrial}
            className="bg-white text-gray-700 border-2 border-gray-200 px-8 py-4 rounded-2xl font-medium text-lg hover:border-gray-300 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 min-w-[200px] justify-center"
          >
            <span className="text-xl">👀</span>
            {t('welcome.trialButton') || '둘러보기'}
          </button>
        </div>

        {/* 부가 정보 */}
        <div className="mt-8 text-sm text-gray-500">
          <p className="flex items-center justify-center gap-2">
            <span>⏱️</span>
            {t('welcome.timeInfo') || '가입 소요시간: 3분 이내'}
          </p>
          <p className="mt-2 flex items-center justify-center gap-2">
            <span>🔒</span>
            {t('welcome.privacyInfo') || '개인정보 안전 보호 • 언제든 탈퇴 가능'}
          </p>
        </div>

        {/* 소셜 증명 */}
        <div className="mt-12 p-6 bg-white/50 rounded-2xl backdrop-blur-sm">
          <p className="text-gray-600 mb-4">
            {t('welcome.socialProof') || '이미 많은 분들이 함께하고 있어요'}
          </p>
          <div className="flex justify-center items-center gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">10만+</div>
              <div className="text-sm text-gray-500">학습자</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div>
              <div className="text-2xl font-bold text-purple-600">50만+</div>
              <div className="text-sm text-gray-500">학습 완료</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div>
              <div className="text-2xl font-bold text-green-600">95%</div>
              <div className="text-sm text-gray-500">만족도</div>
            </div>
          </div>
        </div>

        {/* 데코레이션 요소들 */}
        <div className="absolute top-10 left-10 text-6xl opacity-10 animate-pulse">💫</div>
        <div className="absolute top-20 right-20 text-4xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute bottom-20 left-20 text-5xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}>🌟</div>
        <div className="absolute bottom-10 right-10 text-3xl opacity-10 animate-pulse" style={{ animationDelay: '3s' }}>💝</div>
      </div>
    </div>
  );
}