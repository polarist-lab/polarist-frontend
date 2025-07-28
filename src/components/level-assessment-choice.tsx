'use client';

import { useState } from 'react';
import { Locale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';

interface LevelAssessmentChoiceProps {
  locale: Locale;
  onChooseQuick: () => void;
  onChooseDetailed: () => void;
}

interface AssessmentOption {
  id: 'quick' | 'detailed';
  title: string;
  subtitle: string;
  duration: string;
  description: string;
  features: string[];
  icon: string;
  color: string;
  buttonColor: string;
}

export function LevelAssessmentChoice({ locale, onChooseQuick, onChooseDetailed }: LevelAssessmentChoiceProps) {
  const { t } = useTranslations(locale);
  const [hoveredOption, setHoveredOption] = useState<'quick' | 'detailed' | null>(null);

  const assessmentOptions: AssessmentOption[] = [
    {
      id: 'quick',
      title: '빠른 진단',
      subtitle: 'Quick Assessment',
      duration: '2-3분',
      description: '자가 평가 기반으로 빠르게 레벨을 측정합니다',
      features: [
        '6개 핵심 질문',
        '자가 평가 중심',
        '즉시 결과 확인',
        '기본적인 능력 측정',
        '바로 학습 시작 가능'
      ],
      icon: '⚡',
      color: 'bg-gradient-to-br from-green-50 to-emerald-50',
      buttonColor: 'bg-green-600 hover:bg-green-700'
    },
    {
      id: 'detailed',
      title: '정밀 진단',
      subtitle: 'Detailed Assessment',
      duration: '10-15분',
      description: '체계적인 테스트로 정확한 레벨을 측정합니다',
      features: [
        '15+ 전문 테스트 문항',
        '한국어 4대기능 측정',
        '문자체계(한글) 세부 평가',
        '강점/약점 상세 분석',
        '맞춤형 학습 경로 제공'
      ],
      icon: '🎯',
      color: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      buttonColor: 'bg-blue-600 hover:bg-blue-700'
    }
  ];

  const handleOptionSelect = (optionId: 'quick' | 'detailed') => {
    if (optionId === 'quick') {
      onChooseQuick();
    } else {
      onChooseDetailed();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* 헤더 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-md mb-6">
            <span className="text-2xl">📊</span>
            <span className="font-semibold text-gray-700">한국어 레벨 진단</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            당신의 한국어 실력을
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              정확히 측정해보세요
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            두 가지 진단 방식 중 선택하여 당신의 한국어 수준을 파악하고,
            <br />맞춤형 학습 계획을 받아보세요.
          </p>
        </div>

        {/* 진단 옵션 카드들 */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {assessmentOptions.map((option) => (
            <div
              key={option.id}
              className={`${option.color} rounded-3xl p-8 shadow-lg hover:shadow-xl transform transition-all duration-300 cursor-pointer border-2 ${
                hoveredOption === option.id 
                  ? 'border-blue-200 scale-105' 
                  : 'border-transparent hover:scale-102'
              }`}
              onMouseEnter={() => setHoveredOption(option.id)}
              onMouseLeave={() => setHoveredOption(null)}
              onClick={() => handleOptionSelect(option.id)}
            >
              {/* 카드 헤더 */}
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">{option.icon}</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  {option.title}
                </h2>
                <p className="text-gray-600 text-sm mb-2">{option.subtitle}</p>
                <div className="inline-flex items-center gap-2 bg-white bg-opacity-70 rounded-full px-4 py-2">
                  <span className="text-lg">⏱️</span>
                  <span className="font-semibold text-gray-700">{option.duration}</span>
                </div>
              </div>

              {/* 설명 */}
              <p className="text-gray-700 text-center mb-6 leading-relaxed">
                {option.description}
              </p>

              {/* 특징 목록 */}
              <div className="space-y-3 mb-8">
                {option.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-white bg-opacity-50 rounded-lg p-3"
                  >
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA 버튼 */}
              <button
                onClick={() => handleOptionSelect(option.id)}
                className={`w-full ${option.buttonColor} text-white py-4 rounded-2xl font-bold text-lg shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3`}
              >
                <span className="text-xl">🚀</span>
                {option.title} 시작하기
              </button>
            </div>
          ))}
        </div>

        {/* 추가 안내 */}
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <div className="flex items-start gap-4">
            <span className="text-3xl">💡</span>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                어떤 진단을 선택해야 할까요?
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">빠른 진단이 좋은 경우:</h4>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>시간이 부족한 경우</li>
                    <li>대략적인 수준만 알고 싶은 경우</li>
                    <li>바로 학습을 시작하고 싶은 경우</li>
                    <li>한국어가 처음인 경우</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">정밀 진단이 좋은 경우:</h4>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>정확한 실력을 파악하고 싶은 경우</li>
                    <li>체계적인 학습 계획이 필요한 경우</li>
                    <li>강점과 약점을 분석하고 싶은 경우</li>
                    <li>어느 정도 한국어 경험이 있는 경우</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 안내 */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span>🔄</span>
            <span>진단 결과는 임시 레이팅이며, 언제든 다시 측정할 수 있습니다</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span>📚</span>
            <span>진단 후 바로 학습을 시작할 수 있으며, 회원가입은 선택사항입니다</span>
          </div>
        </div>
      </div>
    </div>
  );
}