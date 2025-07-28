'use client';

import { useState, useEffect } from 'react';
import { Locale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';
import { MiniTestQuestion, MiniTestResult, SelfAssessmentResult } from '@/lib/types';
import { LevelAssessment } from '@/lib/level-assessment';

interface MiniTestProps {
  locale: Locale;
  selfAssessment: SelfAssessmentResult;
  onComplete: (result: MiniTestResult) => void;
  onBack: () => void;
}

export function MiniTest({ locale, selfAssessment, onComplete, onBack }: MiniTestProps) {
  const { t } = useTranslations(locale);
  const [questions, setQuestions] = useState<MiniTestQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<Date>(new Date());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // 초기 질문 로드
  useEffect(() => {
    setStartTime(new Date());
    
    // 자가진단 결과에 따라 초기 질문 난이도 조정
    let initialQuestions: MiniTestQuestion[];
    
    if (selfAssessment.canReadHangul && selfAssessment.koreanExperience !== 'none') {
      // 한글을 읽을 수 있고 경험이 있으면 중간 난이도부터
      initialQuestions = LevelAssessment.getNextQuestions('beginner', 0, 0, 8);
    } else {
      // 초보자는 기초부터
      initialQuestions = LevelAssessment.getInitialQuestions();
    }
    
    setQuestions(initialQuestions);
    setQuestionStartTime(new Date());
  }, [selfAssessment]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setShowFeedback(true);

    // 잠시 피드백 보여주기
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);

      if (isLastQuestion) {
        // 테스트 완료
        completeTest(newAnswers);
      } else {
        // 다음 질문으로
        setCurrentQuestionIndex(prev => prev + 1);
        setQuestionStartTime(new Date());
        
        // 적응형 테스트: 답변에 따라 다음 질문 난이도 조정
        if (currentQuestionIndex >= 2) { // 최소 3문제 후부터 적응
          const correctAnswers = newAnswers.reduce((count, answer, index) => {
            return count + (answer === questions[index].correctAnswer ? 1 : 0);
          }, 0);
          
          const nextQuestions = LevelAssessment.getNextQuestions(
            currentQuestion.difficulty,
            correctAnswers,
            newAnswers.length,
            8
          );
          
          if (nextQuestions.length > 0) {
            setQuestions(prev => [...prev.slice(0, currentQuestionIndex + 1), ...nextQuestions]);
          }
        }
      }
    }, 1500);
  };

  const completeTest = (finalAnswers: number[]) => {
    setIsCompleting(true);
    
    const endTime = new Date();
    const timeSpent = Math.floor((endTime.getTime() - (startTime?.getTime() || 0)) / 1000);
    
    const result = LevelAssessment.analyzeResults(questions, finalAnswers, timeSpent);
    
    setTimeout(() => {
      onComplete(result);
    }, 2000);
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'character-recognition': return '🔤';
      case 'word-recognition': return '📝';
      case 'sentence-comprehension': return '💬';
      default: return '❓';
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'character-recognition': return 'Character Recognition';
      case 'word-recognition': return 'Vocabulary';
      case 'sentence-comprehension': return 'Comprehension';
      default: return 'Question';
    }
  };

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Preparing your test...
          </h3>
          <p className="text-gray-600">
            Creating questions based on your assessment
          </p>
        </div>
      </div>
    );
  }

  if (isCompleting) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Test completed!
          </h3>
          <p className="text-gray-600 mb-4">
            Analyzing your results and creating personalized recommendations...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="text-sm opacity-90">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2 mb-4">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl">{getQuestionTypeIcon(currentQuestion.type)}</span>
            <div>
              <h2 className="text-xl font-semibold">Mini Assessment</h2>
              <p className="opacity-90">{getQuestionTypeLabel(currentQuestion.type)}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-8 leading-relaxed">
              {currentQuestion.question}
            </h3>
            
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === currentQuestion.correctAnswer;
                const isWrong = showFeedback && isSelected && !isCorrect;
                const showCorrect = showFeedback && isCorrect;
                
                return (
                  <button
                    key={index}
                    onClick={() => !showFeedback && handleAnswerSelect(index)}
                    disabled={showFeedback}
                    className={`w-full p-6 text-left rounded-xl border-2 transition-all duration-200 text-lg ${
                      showFeedback 
                        ? showCorrect 
                          ? 'border-green-500 bg-green-50 shadow-lg'
                          : isWrong
                            ? 'border-red-500 bg-red-50 shadow-lg'
                            : 'border-gray-200 bg-gray-50 opacity-50'
                        : isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {showFeedback && showCorrect && (
                        <span className="text-green-600 text-xl">✓</span>
                      )}
                      {isWrong && (
                        <span className="text-red-600 text-xl">✗</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Submit Button */}
            {selectedAnswer !== null && !showFeedback && (
              <div className="mt-8">
                <button
                  onClick={handleSubmitAnswer}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg"
                >
                  {isLastQuestion ? '🏁 Finish Test' : '➡️ Next Question'}
                </button>
              </div>
            )}

            {/* Feedback */}
            {showFeedback && (
              <div className="mt-6 p-4 rounded-xl bg-gray-50 border-l-4 border-blue-500">
                <div className="text-sm text-gray-600">
                  {selectedAnswer === currentQuestion.correctAnswer 
                    ? '🎉 Correct! Well done!'
                    : '💡 The correct answer has been highlighted above.'
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}