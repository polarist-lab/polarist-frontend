'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Locale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';
import { LevelAssessmentResult, LearningContent } from '@/lib/types';
import { ContentManager } from '@/lib/content-manager';

interface RecommendationsProps {
  locale: Locale;
  result: LevelAssessmentResult;
  onComplete: () => void;
  onBack: () => void;
}

interface RecommendedContent {
  roadmaps: LearningContent[];
  immediateContent: LearningContent[];
  suggestedContent: LearningContent[];
}

export function Recommendations({ locale, result, onComplete, onBack }: RecommendationsProps) {
  const { t } = useTranslations(locale);
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<RecommendedContent | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    // 추천 콘텐츠 로드
    const loadRecommendations = () => {
      const allContent = ContentManager.getAllContent();
      
      const roadmaps = result.recommendedPath
        .map(id => allContent.find(c => c.id === id))
        .filter(Boolean) as LearningContent[];
      
      const immediateContent = result.recommendedContent
        .slice(0, 4) // 처음 4개는 즉시 시작 추천
        .map(id => allContent.find(c => c.id === id))
        .filter(Boolean) as LearningContent[];
      
      const suggestedContent = result.recommendedContent
        .slice(4) // 나머지는 추가 제안
        .map(id => allContent.find(c => c.id === id))
        .filter(Boolean) as LearningContent[];

      setRecommendations({
        roadmaps,
        immediateContent,
        suggestedContent
      });

      // 기본으로 추천 로드맵과 즉시 시작 콘텐츠 선택
      const defaultSelected = new Set([
        ...roadmaps.map(r => r.id),
        ...immediateContent.slice(0, 2).map(c => c.id) // 처음 2개만 기본 선택
      ]);
      setSelectedItems(defaultSelected);
    };

    loadRecommendations();
  }, [result]);

  const handleItemToggle = (contentId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(contentId)) {
      newSelected.delete(contentId);
    } else {
      newSelected.add(contentId);
    }
    setSelectedItems(newSelected);
  };

  const handleStartLearning = () => {
    // 선택된 콘텐츠를 "관심있음" 또는 "즐겨찾기"로 표시할 수 있음
    // 여기서는 단순히 온보딩 완료 처리
    onComplete();
  };

  const handleContentClick = (content: LearningContent) => {
    // 콘텐츠로 바로 이동
    switch (content.type) {
      case 'wordbook':
        const wordbookId = content.id.replace('wordbook-', '');
        router.push(`/${locale}/study?wordbook=${wordbookId}`);
        break;
      case 'sentence':
        router.push(`/${locale}/sentences/${content.id}`);
        break;
      case 'roadmap':
        router.push(`/${locale}/roadmap/${content.id}`);
        break;
      case 'character':
        router.push(`/${locale}/characters/${content.id}`);
        break;
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'wordbook': return '📖';
      case 'sentence': return '💬';
      case 'roadmap': return '🗺️';
      case 'character': return '🔤';
      default: return '📚';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'absolute-beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'beginner': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'upper-intermediate': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-200';
      case 'expert': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (!recommendations) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Creating your learning plan...
          </h3>
          <p className="text-gray-600">
            Preparing personalized recommendations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="text-sm opacity-90">Step 4 of 4</div>
          </div>

          <div className="text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="text-3xl font-bold mb-2">Your Learning Plan</h1>
            <p className="text-lg opacity-90">
              Customized recommendations for your {result.finalLevel} level
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Recommended Roadmaps */}
          {recommendations.roadmaps.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <span>🗺️</span> Recommended Learning Path
              </h2>
              <p className="text-gray-600 mb-6">
                These structured roadmaps will guide you through a complete learning journey
              </p>
              
              <div className="grid gap-4">
                {recommendations.roadmaps.map((roadmap) => (
                  <div
                    key={roadmap.id}
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedItems.has(roadmap.id)
                        ? 'border-purple-500 bg-purple-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50'
                    }`}
                    onClick={() => handleItemToggle(roadmap.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <span className="text-3xl">{roadmap.icon || getContentTypeIcon(roadmap.type)}</span>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {roadmap.title}
                          </h3>
                          <p className="text-gray-600 mb-3">{roadmap.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>⏱️ {roadmap.estimatedDuration} min</span>
                            <span className={`px-2 py-1 rounded-full text-xs border ${getDifficultyColor(roadmap.difficulty)}`}>
                              {roadmap.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedItems.has(roadmap.id)
                          ? 'bg-purple-500 border-purple-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedItems.has(roadmap.id) && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Immediate Start Content */}
          {recommendations.immediateContent.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <span>🚀</span> Start Learning Immediately
              </h2>
              <p className="text-gray-600 mb-6">
                Perfect for your current level - you can begin with these right away
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {recommendations.immediateContent.map((content) => (
                  <div
                    key={content.id}
                    className={`p-4 border-2 rounded-xl transition-all duration-200 group ${
                      selectedItems.has(content.id)
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{content.icon || getContentTypeIcon(content.type)}</span>
                        <div>
                          <h3 className="font-semibold text-gray-800">{content.title}</h3>
                          <p className="text-sm text-gray-600">{content.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleItemToggle(content.id);
                        }}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          selectedItems.has(content.id)
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300 group-hover:border-blue-400'
                        }`}
                      >
                        {selectedItems.has(content.id) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>⏱️ {content.estimatedDuration}min</span>
                        <span className={`px-2 py-1 rounded-full border ${getDifficultyColor(content.difficulty)}`}>
                          {content.difficulty}
                        </span>
                      </div>
                      <button
                        onClick={() => handleContentClick(content)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Start →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Suggestions */}
          {recommendations.suggestedContent.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <span>💡</span> Additional Suggestions
              </h2>
              <p className="text-gray-600 mb-6">
                These will be great for expanding your skills as you progress
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                {recommendations.suggestedContent.map((content) => (
                  <div
                    key={content.id}
                    className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedItems.has(content.id)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-green-300'
                    }`}
                    onClick={() => handleItemToggle(content.id)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl">{content.icon || getContentTypeIcon(content.type)}</span>
                      <h3 className="font-semibold text-gray-800 text-sm">{content.title}</h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(content.difficulty)}`}>
                        {content.difficulty}
                      </span>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        selectedItems.has(content.id)
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedItems.has(content.id) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="border-t pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleStartLearning}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                🎓 Start My Learning Journey
              </button>
              
              <button
                onClick={onBack}
                className="sm:w-auto bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
              >
                ← Back to Results
              </button>
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              Selected {selectedItems.size} items • You can always change these later in your profile
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}