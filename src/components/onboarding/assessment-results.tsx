'use client';

import { useState } from 'react';
import { Locale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';
import { LevelAssessmentResult } from '@/lib/types';
import { LEVEL_DESCRIPTIONS } from '@/lib/level-assessment';

interface AssessmentResultsProps {
  locale: Locale;
  result: LevelAssessmentResult;
  onViewRecommendations: () => void;
  onRetakeTest: () => void;
}

export function AssessmentResults({ 
  locale, 
  result, 
  onViewRecommendations, 
  onRetakeTest 
}: AssessmentResultsProps) {
  const { t } = useTranslations(locale);
  const [showDetails, setShowDetails] = useState(false);

  const levelInfo = LEVEL_DESCRIPTIONS[result.finalLevel];
  const accuracy = (result.miniTest.correctAnswers / result.miniTest.totalQuestions) * 100;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'absolute-beginner': return 'from-green-400 to-green-600';
      case 'beginner': return 'from-blue-400 to-blue-600';
      case 'intermediate': return 'from-yellow-400 to-orange-500';
      case 'upper-intermediate': return 'from-orange-400 to-red-500';
      case 'advanced': return 'from-red-400 to-pink-600';
      case 'expert': return 'from-purple-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return { text: 'Very High', color: 'text-green-600' };
    if (confidence >= 0.6) return { text: 'High', color: 'text-blue-600' };
    if (confidence >= 0.4) return { text: 'Moderate', color: 'text-yellow-600' };
    return { text: 'Low', color: 'text-red-600' };
  };

  const confidenceInfo = getConfidenceText(result.confidence);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`bg-gradient-to-r ${getLevelColor(result.finalLevel)} text-white p-8 rounded-t-2xl`}>
          <div className="text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="text-3xl font-bold mb-2">Assessment Complete!</h1>
            <p className="text-lg opacity-90">Here are your personalized results</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Level Result */}
          <div className="text-center mb-8">
            <div className={`inline-block bg-gradient-to-r ${getLevelColor(result.finalLevel)} text-white px-8 py-4 rounded-2xl shadow-lg mb-4`}>
              <h2 className="text-2xl font-bold">{levelInfo.title}</h2>
            </div>
            <p className="text-xl text-gray-700 mb-4">{levelInfo.description}</p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <span>Confidence: <span className={confidenceInfo.color}>{confidenceInfo.text}</span></span>
              <span>•</span>
              <span>Test Accuracy: {Math.round(accuracy)}%</span>
              <span>•</span>
              <span>Time: {Math.floor(result.miniTest.timeSpent / 60)}:{String(result.miniTest.timeSpent % 60).padStart(2, '0')}</span>
            </div>
          </div>

          {/* What This Means */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>📋</span> What this level includes:
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {levelInfo.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Results */}
          <div className="mb-8">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center justify-between w-full p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                📊 View Detailed Results
              </h3>
              <span className={`transform transition-transform ${showDetails ? 'rotate-180' : ''}`}>
                ⬇️
              </span>
            </button>

            {showDetails && (
              <div className="mt-4 space-y-6 p-6 bg-gray-50 rounded-xl">
                {/* Test Performance */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Test Performance</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {result.miniTest.correctAnswers}/{result.miniTest.totalQuestions}
                      </div>
                      <div className="text-sm text-gray-600">Correct Answers</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(accuracy)}%
                      </div>
                      <div className="text-sm text-gray-600">Accuracy</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.floor(result.miniTest.timeSpent / 60)}:{String(result.miniTest.timeSpent % 60).padStart(2, '0')}
                      </div>
                      <div className="text-sm text-gray-600">Time Taken</div>
                    </div>
                  </div>
                </div>

                {/* Category Breakdown */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Performance by Category</h4>
                  <div className="space-y-3">
                    {Object.entries(result.miniTest.categoryScores).map(([category, score]) => {
                      const percentage = (score.correct / score.total) * 100;
                      return (
                        <div key={category} className="bg-white p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium capitalize">{category.replace('-', ' ')}</span>
                            <span className="text-sm text-gray-600">
                              {score.correct}/{score.total} ({Math.round(percentage)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid md:grid-cols-2 gap-6">
                  {result.miniTest.strengths.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                        <span>💪</span> Strengths
                      </h4>
                      <div className="space-y-2">
                        {result.miniTest.strengths.map((strength, index) => (
                          <div key={index} className="bg-green-50 text-green-800 px-3 py-2 rounded-lg text-sm">
                            {strength.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.miniTest.weaknesses.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                        <span>🎯</span> Areas to Focus
                      </h4>
                      <div className="space-y-2">
                        {result.miniTest.weaknesses.map((weakness, index) => (
                          <div key={index} className="bg-orange-50 text-orange-800 px-3 py-2 rounded-lg text-sm">
                            {weakness.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onViewRecommendations}
              className={`flex-1 bg-gradient-to-r ${getLevelColor(result.finalLevel)} text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5`}
            >
              🚀 View My Learning Plan
            </button>

            <button
              onClick={onRetakeTest}
              className="sm:w-auto bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
            >
              🔄 Retake Assessment
            </button>
          </div>

          {/* Encouragement */}
          <div className="mt-6 text-center text-gray-600">
            <p>
              {result.finalLevel === 'absolute-beginner' 
                ? "Everyone starts somewhere! You're about to begin an amazing journey learning Korean. 화이팅! (Fighting!)"
                : result.finalLevel === 'expert'
                  ? "Impressive! You have excellent Korean skills. Let's help you achieve true mastery!"
                  : "Great job! You have a solid foundation. Let's build on your strengths and improve your areas of focus."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}