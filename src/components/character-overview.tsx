'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Locale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';
import { getCharacterPresets } from '@/data/content-presets';
import { LearningContent, CharacterMetadata } from '@/lib/types';
import { 
  BASIC_VOWELS, 
  COMPLEX_VOWELS, 
  BASIC_CONSONANTS, 
  BASIC_COMBINATIONS,
  DOUBLE_CONSONANTS,
  VOWEL_REVIEW,
  HANGUL_STATS 
} from '@/lib/hangul-characters';

interface CharacterOverviewProps {
  locale: Locale;
  onLessonSelect?: (lessonId: string) => void;
}

interface CharacterTypeInfo {
  id: string;
  title: string;
  description: string;
  icon: string;
  count: number;
  difficulty: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  examples: string[];
  content?: LearningContent;
}

export function CharacterOverview({ locale, onLessonSelect }: CharacterOverviewProps) {
  const { t } = useTranslations(locale);
  const router = useRouter();
  const [hoveredType, setHoveredType] = useState<string | null>(null);

  // 한글 프리셋 가져오기
  const characterPresets = getCharacterPresets();

  const characterTypes: CharacterTypeInfo[] = [
    {
      id: 'characters-basic-vowels',
      title: 'Basic Vowels',
      description: 'Learn all 10 basic Korean vowels and their sounds',
      icon: '',
      count: HANGUL_STATS.basicVowels,
      difficulty: 'Absolute Beginner',
      color: 'text-red-600',
      bgGradient: 'bg-white',
      borderColor: 'border-gray-200 hover:border-gray-300',
      examples: ['ㅏ', 'ㅑ', 'ㅓ', 'ㅕ'],
      content: characterPresets.find(p => p.id === 'characters-basic-vowels')
    },
    {
      id: 'characters-basic-consonants',
      title: 'Basic Consonants',
      description: 'Core consonant sounds',
      icon: 'ㄱ',
      count: HANGUL_STATS.basicConsonants,
      difficulty: 'Absolute Beginner',
      color: 'text-blue-600',
      bgGradient: 'bg-white',
      borderColor: 'border-gray-200 hover:border-gray-300',
      examples: ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'],
      content: characterPresets.find(p => p.id === 'characters-basic-consonants')
    },
    {
      id: 'characters-basic-combinations',
      title: 'Basic Syllables',
      description: 'Consonant + vowel combinations',
      icon: '가',
      count: HANGUL_STATS.basicCombinations,
      difficulty: 'Beginner',
      color: 'text-green-600',
      bgGradient: 'bg-white',
      borderColor: 'border-gray-200 hover:border-gray-300',
      examples: ['가', '갸', '거', '겨'],
      content: characterPresets.find(p => p.id === 'characters-basic-combinations')
    },
    {
      id: 'characters-double-consonants',
      title: 'Double Consonants',
      description: 'Tensed consonant sounds',
      icon: 'ㄲ',
      count: HANGUL_STATS.doubleConsonants,
      difficulty: 'Intermediate',
      color: 'text-purple-600',
      bgGradient: 'bg-white',
      borderColor: 'border-gray-200 hover:border-gray-300',
      examples: ['ㄲ', 'ㄸ', 'ㅃ', 'ㅆ'],
      content: characterPresets.find(p => p.id === 'characters-double-consonants')
    }
  ];

  const handleTypeClick = (typeInfo: CharacterTypeInfo) => {
    if (onLessonSelect && typeInfo.content) {
      onLessonSelect(typeInfo.content.id);
    } else if (typeInfo.content) {
      router.push(`/${locale}/characters/${typeInfo.content.id}`);
    }
  };

  // 진행도 계산 (현재는 모크 데이터)
  const getProgress = (typeId: string): number => {
    const mockProgress: Record<string, number> = {
      'characters-basic-vowels': 35,
      'characters-basic-consonants': 15,
      'characters-basic-combinations': 0,
      'characters-complex-vowels': 0,
      'characters-double-consonants': 0
    };
    return mockProgress[typeId] || 0;
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* 헤더 */}
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
          한글 (Hangul)
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Master the Korean writing system step by step. Start with the basics and progress through all character types.
        </p>
        
        {/* 전체 통계 */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 max-w-xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-semibold text-gray-900">{HANGUL_STATS.totalCharacters}</div>
              <div className="text-xs text-gray-600">Total Characters</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-gray-900">{HANGUL_STATS.basicVowels}</div>
              <div className="text-xs text-gray-600">Vowels</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-gray-900">{HANGUL_STATS.basicConsonants + HANGUL_STATS.doubleConsonants}</div>
              <div className="text-xs text-gray-600">Consonants</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-gray-900">4</div>
              <div className="text-xs text-gray-600">Learning Sets</div>
            </div>
          </div>
        </div>
      </div>

      {/* 문자 타입 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {characterTypes.map((type) => {
          const progress = getProgress(type.id);
          const isHovered = hoveredType === type.id;
          const isCompleted = progress === 100;
          const isInProgress = progress > 0 && progress < 100;

          return (
            <div
              key={type.id}
              className={`bg-white rounded-2xl border border-gray-200 p-8 cursor-pointer transition-all duration-200 h-[400px] flex flex-col ${
                isHovered ? 'scale-[1.02] shadow-lg border-gray-300' : 'hover:border-gray-300 hover:shadow-sm'
              }`}
              onMouseEnter={() => setHoveredType(type.id)}
              onMouseLeave={() => setHoveredType(null)}
              onClick={() => handleTypeClick(type)}
            >
              {/* 상태 뱃지 */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {type.title}
                  </h3>
                  <span className="text-sm font-medium text-gray-500">
                    {type.count} characters
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {type.description}
                </p>
                <div className="flex gap-2 h-6">
                  {isCompleted && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      Complete
                    </span>
                  )}
                  {isInProgress && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      In Progress
                    </span>
                  )}
                </div>
              </div>

              {/* 문자 예시 */}
              <div className="mb-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                  {type.examples.map((char, index) => (
                    <div key={index} className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-lg font-medium text-gray-700">
                      {char}
                    </div>
                  ))}
                  <div className="text-gray-400 text-sm">...</div>
                </div>
              </div>

              {/* 하단 영역 - 진행도와 버튼 */}
              <div className="mt-auto">
                <div className="mb-4">
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
                
                {/* 시작 버튼 */}
                <button className="w-full py-3 px-4 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors duration-200">
                  {progress === 0 ? 'Start Learning' : 
                   progress === 100 ? 'Review' : 
                   'Continue Learning'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 학습 가이드 */}
      <div className="mt-16 text-center">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 max-w-2xl mx-auto">
          <h4 className="text-lg font-medium text-gray-900 mb-3">
            Recommended Learning Path
          </h4>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Start with <strong>Basic Vowels</strong> (including Y-series), then learn <strong>Basic Consonants</strong>. 
            Practice <strong>Basic Syllables</strong>, and finish with <strong>Double Consonants</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => handleTypeClick(characterTypes[0])}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Start with Basic Vowels
            </button>
            <button 
              onClick={() => router.push(`/${locale}`)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}