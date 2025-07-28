'use client';

import { useState } from 'react';
import { Locale } from '@/lib/i18n/config';
import { QUICK_ASSESSMENT_QUESTIONS } from '@/lib/enhanced-level-assessment';

interface QuickAssessmentFormProps {
  locale: Locale;
  onComplete: (answers: Record<string, any>) => void;
  onBack: () => void;
}

export function QuickAssessmentForm({ locale, onComplete, onBack }: QuickAssessmentFormProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = QUICK_ASSESSMENT_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === QUICK_ASSESSMENT_QUESTIONS.length - 1;
  const progress = ((currentQuestionIndex + 1) / QUICK_ASSESSMENT_QUESTIONS.length) * 100;

  const handleAnswer = (value: any) => {
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: value
    };
    setAnswers(newAnswers);

    // 자동으로 다음 질문으로 이동 (잠시 대기 후)
    setTimeout(() => {
      if (isLastQuestion) {
        handleSubmit(newAnswers);
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 500);
  };

  const handleSubmit = async (finalAnswers: Record<string, any>) => {
    setIsSubmitting(true);
    
    // 잠시 대기 (진단 중 효과)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onComplete(finalAnswers);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  if (isSubmitting) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">진단 결과를 분석 중입니다</h3>
          <p className="text-gray-600">잠시만 기다려주세요...</p>
        </div>
        
        <div className="space-y-2 text-sm text-gray-500">
          <p>✓ 한글 능력 분석 완료</p>
          <p>✓ 어휘 수준 평가 완료</p>
          <p>✓ 듣기 능력 측정 완료</p>
          <p>⏳ 말하기 능력 평가 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* 진행률 바 */}
      <div className="bg-gray-200 h-2">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              ← 뒤로
            </button>
            <div className="text-sm text-gray-500">
              질문 {currentQuestionIndex + 1} / {QUICK_ASSESSMENT_QUESTIONS.length}
            </div>
          </div>
          
          <div className="text-sm font-medium text-blue-600">
            {Math.round(progress)}% 완료
          </div>
        </div>

        {/* 질문 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{
              currentQuestion.category === 'hangul' ? '📝' :
              currentQuestion.category === 'vocabulary' ? '📚' :
              currentQuestion.category === 'listening' ? '🎧' :
              currentQuestion.category === 'speaking' ? '🗣️' :
              currentQuestion.category === 'cultural' ? '🌏' : '❓'
            }</span>
            <span className="text-sm font-medium text-gray-500 capitalize">
              {currentQuestion.category}
            </span>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2 leading-relaxed">
            {currentQuestion.questionKo || currentQuestion.question}
          </h2>
          
          {currentQuestion.question !== currentQuestion.questionKo && (
            <p className="text-gray-600 text-lg">
              {currentQuestion.question}
            </p>
          )}
        </div>

        {/* 선택지 */}
        <div className="space-y-3">
          {currentQuestion.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option.value)}
              className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-blue-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-blue-500"></div>
                </div>
                <div>
                  <div className="font-medium text-gray-800 group-hover:text-blue-800">
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
          ))}
        </div>

        {/* 네비게이션 */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            이전 질문
          </button>
          
          <div className="text-sm text-gray-500">
            선택하면 자동으로 다음 질문으로 넘어갑니다
          </div>
        </div>
      </div>
    </div>
  );
}