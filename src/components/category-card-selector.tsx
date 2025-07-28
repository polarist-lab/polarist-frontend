'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Locale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';
import { getCharacterPresets, getWordbookPresets, getSentencePresets, getGrammarPresets } from '@/data/content-presets';
import { LearningTracker } from '@/lib/learning-tracker';

interface CategoryCardSelectorProps {
  locale: Locale;
  onCategorySelect?: (categoryType: CategoryType, contentId?: string) => void;
}

type CategoryType = 'character' | 'wordbook' | 'sentence' | 'grammar';

interface CategoryInfo {
  type: CategoryType;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  iconBg: string;
  progressColor: string;
  contentCount: number;
  difficulty: string;
  features: string[];
}

export function CategoryCardSelector({ locale, onCategorySelect }: CategoryCardSelectorProps) {
  const { t } = useTranslations(locale);
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<CategoryType | null>(null);

  // 각 카테고리별 데이터 가져오기
  const characterPresets = getCharacterPresets();
  const wordbookPresets = getWordbookPresets();
  const sentencePresets = getSentencePresets();
  const grammarPresets = getGrammarPresets();

  // 진행도 계산 (향후 실제 진행도로 대체)
  const getProgress = (categoryType: CategoryType): number => {
    // 현재는 랜덤값, 향후 실제 진행도 데이터 연동
    const mockProgress = {
      character: 25,
      wordbook: 45,
      sentence: 15,
      grammar: 10
    };
    return mockProgress[categoryType] || 0;
  };

  const categories: CategoryInfo[] = [
    {
      type: 'character',
      title: '한글 (Hangul)',
      description: 'Master the Korean writing system fundamentals',
      icon: 'ㄱ',
      color: 'text-red-600',
      bgGradient: 'bg-white',
      borderColor: 'border-gray-200 hover:border-gray-300',
      iconBg: 'bg-red-50',
      progressColor: 'bg-red-500',
      contentCount: characterPresets.length,
      difficulty: 'Absolute Beginner',
      features: [
        'Basic vowels and consonants',
        'Complex vowel combinations',
        'Double consonant sounds',
        'Character recognition practice'
      ]
    },
    {
      type: 'wordbook',
      title: '단어 (Vocabulary)',
      description: 'Build your Korean vocabulary with essential words',
      icon: '말',
      color: 'text-blue-600',
      bgGradient: 'bg-white',
      borderColor: 'border-gray-200 hover:border-gray-300',
      iconBg: 'bg-blue-50',
      progressColor: 'bg-blue-500',
      contentCount: wordbookPresets.length,
      difficulty: 'Beginner to Advanced',
      features: [
        'Essential everyday vocabulary',
        'Themed word collections',
        'Progressive difficulty levels',
        'Audio pronunciation guides'
      ]
    },
    {
      type: 'sentence',
      title: '문장 (Sentences)',
      description: 'Learn practical Korean conversation patterns',
      icon: '말',
      color: 'text-green-600',
      bgGradient: 'bg-white',
      borderColor: 'border-gray-200 hover:border-gray-300',
      iconBg: 'bg-green-50',
      progressColor: 'bg-green-500',
      contentCount: sentencePresets.length,
      difficulty: 'Beginner to Intermediate',
      features: [
        'Common greetings and expressions',
        'Daily conversation patterns',
        'Restaurant and shopping phrases',
        'Polite and casual speech'
      ]
    },
    {
      type: 'grammar',
      title: '문법 (Grammar)',
      description: 'Understand Korean grammar rules and structures',
      icon: '법',
      color: 'text-purple-600',
      bgGradient: 'bg-white',
      borderColor: 'border-gray-200 hover:border-gray-300',
      iconBg: 'bg-purple-50',
      progressColor: 'bg-purple-500',
      contentCount: grammarPresets.length,
      difficulty: 'Beginner to Intermediate',
      features: [
        'Essential particles and markers',
        'Verb conjugation patterns',
        'Sentence structure basics',
        'Honorific speech levels'
      ]
    }
  ];

  const handleCategoryClick = (category: CategoryInfo) => {
    if (onCategorySelect) {
      // 부모 컴포넌트에서 제공한 콜백 사용 (홈페이지의 경우)
      onCategorySelect(category.type);
    } else {
      // 기본 네비게이션: 해당 카테고리의 첫 번째 콘텐츠로 이동
      // 특별 처리: character 타입은 overview 페이지로 이동
      if (category.type === 'character') {
        const targetUrl = `/${locale}/characters`;
        router.push(targetUrl);
        return;
      }

      // 다른 카테고리들 처리
      const getTargetUrl = (type: CategoryType): string => {
        switch (type) {
          case 'wordbook':
            const wordbookId = wordbookPresets[0]?.id || 'wordbook-absolute-beginner';
            return `/${locale}/wordbooks/${wordbookId}`;
          case 'sentence':
            const sentenceId = sentencePresets[0]?.id || 'sentences-greetings-basic';
            return `/${locale}/sentences/${sentenceId}`;
          case 'grammar':
            const grammarId = grammarPresets[0]?.id || 'grammar-basic-particles';
            return `/${locale}/grammars/${grammarId}`;
          default:
            return '';
        }
      };

      const targetUrl = getTargetUrl(category.type);
      if (targetUrl) {
        router.push(targetUrl);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* 헤더 */}
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
          {t('home.welcome')}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose your learning path and start mastering Korean step by step.
        </p>
      </div>

      {/* 카테고리 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => {
          const progress = getProgress(category.type);
          const isHovered = hoveredCard === category.type;

          return (
            <div
              key={category.type}
              className={`bg-white rounded-2xl border border-gray-200 p-8 cursor-pointer transition-all duration-200 ${
                isHovered ? 'scale-[1.02] shadow-lg border-gray-300' : 'hover:border-gray-300 hover:shadow-sm'
              }`}
              onMouseEnter={() => setHoveredCard(category.type)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleCategoryClick(category)}
            >
              {/* 카드 헤더 */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {category.title}
                  </h3>
                  <span className="text-sm font-medium text-gray-500">
                    {category.contentCount} lessons
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {category.description}
                </p>
              </div>

              {/* 진행도 바 */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-gray-500">Progress</span>
                  <span className="text-xs font-medium text-gray-700">{progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-gray-900 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* 특징들 */}
              <div className="space-y-2 mb-6">
                {category.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="text-xs text-gray-600">
                    • {feature}
                  </div>
                ))}
              </div>

              {/* 시작 버튼 */}
              <button 
                className="w-full py-3 px-4 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCategoryClick(category);
                }}
              >
                Start Learning
              </button>
            </div>
          );
        })}
      </div>

      {/* 하단 도움말 */}
      <div className="mt-16 text-center">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 max-w-2xl mx-auto">
          <h4 className="text-lg font-medium text-gray-900 mb-3">
            Not sure where to start?
          </h4>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We recommend starting with <strong>Hangul</strong> if you're completely new to Korean, or jump to <strong>Vocabulary</strong> if you can already read Korean characters.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => handleCategoryClick(categories[0])}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Start with Hangul
            </button>
            <button 
              onClick={() => handleCategoryClick(categories[1])}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Jump to Vocabulary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}