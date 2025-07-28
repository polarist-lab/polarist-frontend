'use client';

import { useState } from 'react';
import { Locale } from '@/lib/i18n/config';
import { DETAILED_ASSESSMENT_QUESTIONS, AssessmentQuestion } from '@/lib/enhanced-level-assessment';

interface DetailedAssessmentFormProps {
  locale: Locale;
  onComplete: (answers: Record<string, any>) => void;
  onBack: () => void;
}

export function DetailedAssessmentForm({ locale, onComplete, onBack }: DetailedAssessmentFormProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = DETAILED_ASSESSMENT_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === DETAILED_ASSESSMENT_QUESTIONS.length - 1;
  const progress = ((currentQuestionIndex + 1) / DETAILED_ASSESSMENT_QUESTIONS.length) * 100;

  // 카테고리별 진행률 계산
  const getCategoryProgress = () => {
    const categories = ['hangul', 'vocabulary', 'grammar', 'listening', 'reading', 'speaking', 'cultural'];
    const categoryProgress: Record<string, { completed: number; total: number }> = {};

    categories.forEach(category => {
      const questionsInCategory = DETAILED_ASSESSMENT_QUESTIONS.filter(q => q.category === category);
      const answeredInCategory = questionsInCategory.filter(q => answers[q.id] !== undefined);
      
      categoryProgress[category] = {
        completed: answeredInCategory.length,
        total: questionsInCategory.length
      };
    });

    return categoryProgress;
  };

  const handleAnswer = (value: any) => {
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: value
    };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // 진단 분석 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onComplete(answers);
  };

  const getQuestionIcon = (question: AssessmentQuestion) => {
    const icons = {
      hangul: '📝',
      vocabulary: '📚',
      grammar: '📖',
      listening: '🎧',
      reading: '👁️',
      speaking: '🗣️',
      cultural: '🌏'
    };
    return icons[question.category] || '❓';
  };

  const getCategoryName = (category: string) => {
    const names = {
      hangul: '한글',
      vocabulary: '어휘',
      grammar: '문법',
      listening: '듣기',
      reading: '읽기',
      speaking: '말하기',
      cultural: '문화'
    };
    return names[category as keyof typeof names] || category;
  };

  if (isSubmitting) {
    const categoryProgress = getCategoryProgress();
    
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">정밀 진단 결과를 분석 중입니다</h3>
          <p className="text-gray-600">한국어 4대 기능을 종합적으로 평가하고 있습니다...</p>
        </div>

        {/* 분석 진행 상황 */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {Object.entries(categoryProgress).map(([category, progress]) => (
            <div key={category} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{getQuestionIcon({ category } as AssessmentQuestion)}</span>
                <span className="font-medium text-gray-800">{getCategoryName(category)}</span>
              </div>
              <div className="text-sm text-gray-600">
                {progress.completed}/{progress.total} 문항 완료
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center space-y-2 text-sm text-gray-500">
          <p>✓ 한글 문자 체계 분석 완료</p>
          <p>✓ 어휘 수준 측정 완료</p>
          <p>✓ 문법 이해도 평가 완료</p>
          <p>⏳ 종합 레벨 계산 중...</p>
        </div>
      </div>
    );
  }

  const isAnswered = answers[currentQuestion.id] !== undefined;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* 전체 진행률 바 */}
      <div className="bg-gray-200 h-3">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              ← 처음으로
            </button>
            <div className="text-sm text-gray-500">
              문항 {currentQuestionIndex + 1} / {DETAILED_ASSESSMENT_QUESTIONS.length}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm font-medium text-blue-600">
              {Math.round(progress)}% 완료
            </div>
            <div className="text-xs text-gray-500 mt-1">
              정밀 진단
            </div>
          </div>
        </div>

        {/* 카테고리 및 난이도 표시 */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
            <span className="text-lg">{getQuestionIcon(currentQuestion)}</span>
            <span className="text-sm font-medium text-blue-700">
              {getCategoryName(currentQuestion.category)}
            </span>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            currentQuestion.difficulty === 'absolute-beginner' ? 'bg-green-100 text-green-700' :
            currentQuestion.difficulty === 'beginner' ? 'bg-blue-100 text-blue-700' :
            currentQuestion.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
            currentQuestion.difficulty === 'upper-intermediate' ? 'bg-orange-100 text-orange-700' :
            currentQuestion.difficulty === 'advanced' ? 'bg-red-100 text-red-700' :
            'bg-purple-100 text-purple-700'
          }`}>
            {currentQuestion.difficulty}
          </div>
        </div>

        {/* 질문 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 leading-relaxed">
            {currentQuestion.questionKo || currentQuestion.question}
          </h2>
          
          {currentQuestion.question !== currentQuestion.questionKo && (
            <p className="text-gray-600 text-lg mb-4">
              {currentQuestion.question}
            </p>
          )}

          {currentQuestion.subcategory && (
            <p className="text-sm text-gray-500 mb-6">
              세부 영역: {currentQuestion.subcategory}
            </p>
          )}
        </div>

        {/* 선택지 */}
        <div className="space-y-3 mb-8">
          {currentQuestion.options?.map((option, index) => {
            const isSelected = answers[currentQuestion.id] === option.value;
            
            return (
              <button
                key={index}
                onClick={() => handleAnswer(option.value)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium ${isSelected ? 'text-blue-800' : 'text-gray-800'}`}>
                      {option.labelKo || option.label}
                    </div>
                    {option.label !== option.labelKo && (
                      <div className="text-sm text-gray-500 mt-1">
                        {option.label}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* 네비게이션 */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-colors"
          >
            이전
          </button>
          
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">
              {isAnswered ? '답변 완료' : '답변을 선택해주세요'}
            </div>
            {isAnswered && (
              <div className="text-xs text-green-600">✓</div>
            )}
          </div>

          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLastQuestion ? '진단 완료' : '다음'}
          </button>
        </div>
      </div>
    </div>
  );
}