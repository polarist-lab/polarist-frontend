'use client';

import { useState } from 'react';
import { Locale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';
import { SelfAssessmentResult } from '@/lib/types';
import { SELF_ASSESSMENT_QUESTIONS } from '@/lib/level-assessment';

interface SelfAssessmentProps {
  locale: Locale;
  onComplete: (result: SelfAssessmentResult) => void;
  onBack: () => void;
}

export function SelfAssessment({ locale, onComplete, onBack }: SelfAssessmentProps) {
  const { t } = useTranslations(locale);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = SELF_ASSESSMENT_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === SELF_ASSESSMENT_QUESTIONS.length - 1;
  const progress = ((currentQuestionIndex + 1) / SELF_ASSESSMENT_QUESTIONS.length) * 100;

  const handleAnswer = (value: any) => {
    const newAnswers = {
      ...answers,
      [currentQuestion.key]: value
    };
    setAnswers(newAnswers);

    // 마지막 질문이면 결과 제출
    if (isLastQuestion) {
      setTimeout(() => {
        setIsSubmitting(true);
        const result: SelfAssessmentResult = {
          canReadHangul: newAnswers.canReadHangul || false,
          koreanExperience: newAnswers.koreanExperience || 'none',
          learningGoals: newAnswers.learningGoals || [],
          studyTimePerWeek: newAnswers.studyTimePerWeek || 1,
          preferredLearningStyle: newAnswers.preferredLearningStyle || 'mixed'
        };
        onComplete(result);
      }, 500);
    } else {
      // 다음 질문으로
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 300);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const renderQuestionContent = () => {
    switch (currentQuestion.type) {
      case 'boolean':
        return (
          <div className="space-y-4">
            <button
              onClick={() => handleAnswer(true)}
              className={`w-full p-6 text-left rounded-xl border-2 transition-all duration-200 hover:border-green-400 hover:bg-green-50 ${
                answers[currentQuestion.key] === true 
                  ? 'border-green-500 bg-green-50 shadow-lg' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl">✅</div>
                <div>
                  <div className="font-semibold text-gray-800">Yes</div>
                  <div className="text-sm text-gray-600">I can read Korean letters</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleAnswer(false)}
              className={`w-full p-6 text-left rounded-xl border-2 transition-all duration-200 hover:border-red-400 hover:bg-red-50 ${
                answers[currentQuestion.key] === false 
                  ? 'border-red-500 bg-red-50 shadow-lg' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl">❌</div>
                <div>
                  <div className="font-semibold text-gray-800">No</div>
                  <div className="text-sm text-gray-600">I&apos;m still learning the Korean alphabet</div>
                </div>
              </div>
            </button>
          </div>
        );

      case 'choice':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.value)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 ${
                  answers[currentQuestion.key] === option.value 
                    ? 'border-blue-500 bg-blue-50 shadow-lg' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="font-medium text-gray-800">{option.label}</div>
              </button>
            ))}
          </div>
        );

      case 'multiple':
        const selectedGoals = answers[currentQuestion.key] || [];
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => {
              const isSelected = selectedGoals.includes(option.value);
              return (
                <button
                  key={index}
                  onClick={() => {
                    const newGoals = isSelected
                      ? selectedGoals.filter((g: string) => g !== option.value)
                      : [...selectedGoals, option.value];
                    setAnswers(prev => ({ ...prev, [currentQuestion.key]: newGoals }));
                  }}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 hover:border-purple-400 hover:bg-purple-50 ${
                    isSelected 
                      ? 'border-purple-500 bg-purple-50 shadow-lg' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      isSelected ? 'bg-purple-500 border-purple-500' : 'border-gray-300'
                    }`}>
                      {isSelected && <div className="text-white text-xs">✓</div>}
                    </div>
                    <div className="font-medium text-gray-800">{option.label}</div>
                  </div>
                </button>
              );
            })}
            
            {/* Continue button for multiple choice */}
            {selectedGoals.length > 0 && (
              <div className="pt-4">
                <button
                  onClick={() => handleAnswer(selectedGoals)}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (isSubmitting) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Processing your responses...
          </h3>
          <p className="text-gray-600">
            Preparing your personalized mini-test
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBack}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="text-sm opacity-90">
              {currentQuestionIndex + 1} of {SELF_ASSESSMENT_QUESTIONS.length}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2 mb-4">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <h2 className="text-xl font-semibold">Self-Assessment</h2>
          <p className="opacity-90">Tell us about your Korean learning journey</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              {currentQuestion.question}
            </h3>
            
            {renderQuestionContent()}
          </div>
        </div>
      </div>
    </div>
  );
}