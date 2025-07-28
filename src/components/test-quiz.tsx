'use client'

import { useState, useEffect } from 'react';
import { KoreanWord } from '@/lib/types';
import { LearningTracker } from '@/lib/learning-tracker';

interface TestQuizProps {
  words: KoreanWord[];
  onComplete?: (results: TestResults) => void;
}

interface TestResults {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  score: number; // percentage
  completedAt: Date;
  timeSpent: number; // seconds
}

interface QuizQuestion {
  word: KoreanWord;
  userAnswer: string;
  isCorrect?: boolean;
  isAnswered: boolean;
}

export function TestQuiz({ words, onComplete }: TestQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Initialize quiz questions
  useEffect(() => {
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    const initialQuestions: QuizQuestion[] = shuffledWords.slice(0, 20).map(word => ({
      word,
      userAnswer: '',
      isAnswered: false
    }));
    setQuestions(initialQuestions);
    setStartTime(new Date());
  }, [words]);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) return;

    const startTime = Date.now();
    const normalizedAnswer = userAnswer.trim().toLowerCase();
    const correctAnswer = currentQuestion.word.english.toLowerCase();
    const isCorrect = normalizedAnswer === correctAnswer;
    const timeSpent = Date.now() - startTime;

    // Record test result in learning tracker
    LearningTracker.recordTestResult({
      wordId: currentQuestion.word.id,
      isCorrect,
      userAnswer,
      correctAnswer: currentQuestion.word.english,
      timestamp: new Date(),
      timeSpent
    });

    // Update current question
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      userAnswer,
      isCorrect,
      isAnswered: true
    };
    setQuestions(updatedQuestions);
    setShowResult(true);

    // Auto-advance after showing result
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setUserAnswer('');
        setShowResult(false);
      } else {
        // Quiz complete
        completeQuiz(updatedQuestions);
      }
    }, 2000);
  };

  const completeQuiz = (finalQuestions: QuizQuestion[]) => {
    setIsQuizComplete(true);
    
    const correctAnswers = finalQuestions.filter(q => q.isCorrect).length;
    const wrongAnswers = finalQuestions.length - correctAnswers;
    const score = Math.round((correctAnswers / finalQuestions.length) * 100);
    const timeSpent = startTime ? Math.round((new Date().getTime() - startTime.getTime()) / 1000) : 0;

    const results: TestResults = {
      totalQuestions: finalQuestions.length,
      correctAnswers,
      wrongAnswers,
      score,
      completedAt: new Date(),
      timeSpent
    };

    onComplete?.(results);
  };

  const restartQuiz = () => {
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    const newQuestions: QuizQuestion[] = shuffledWords.slice(0, 20).map(word => ({
      word,
      userAnswer: '',
      isAnswered: false
    }));
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setShowResult(false);
    setIsQuizComplete(false);
    setStartTime(new Date());
  };

  if (!currentQuestion) {
    return (
      <div className="text-center p-12 bg-card rounded-2xl shadow-lg border border-border">
        <div className="text-6xl mb-4 opacity-50">📝</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Loading Test...</h3>
        <p className="text-foreground/60">Preparing your quiz questions</p>
      </div>
    );
  }

  if (isQuizComplete) {
    const correctCount = questions.filter(q => q.isCorrect).length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    
    return (
      <div className="max-w-2xl mx-auto">
        {/* Results Card */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-8 rounded-2xl text-center shadow-xl mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold">{correctCount}</div>
              <div className="text-sm opacity-90">Correct</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold">{totalQuestions - correctCount}</div>
              <div className="text-sm opacity-90">Wrong</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold">{score}%</div>
              <div className="text-sm opacity-90">Score</div>
            </div>
          </div>
          <button 
            className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 hover:opacity-80 cursor-pointer transition-all duration-200"
            onClick={restartQuiz}
          >
            Take Another Test
          </button>
        </div>

        {/* Review Incorrect Answers */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
          <h3 className="text-xl font-bold text-foreground mb-4">Review</h3>
          <div className="space-y-3">
            {questions.filter(q => !q.isCorrect).map((question, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <div className="korean-text text-lg font-semibold">{question.word.korean}</div>
                  <div className="text-sm text-foreground/70">/{question.word.pronunciation}/</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-red-600 line-through">{question.userAnswer}</div>
                  <div className="font-semibold text-green-600">{question.word.english}</div>
                </div>
              </div>
            ))}
            {questions.filter(q => !q.isCorrect).length === 0 && (
              <div className="text-center text-foreground/60 py-4">
                Perfect! No mistakes to review. 🎯
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-foreground/80">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-sm font-bold text-primary">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-border rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary-dark transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-card rounded-2xl shadow-lg border border-border p-8 mb-8">
        <div className="text-center mb-8">
          <div className="korean-text text-5xl font-bold mb-4 text-primary">
            {currentQuestion.word.korean}
          </div>
          <div className="text-lg text-foreground/70 italic font-mono mb-2">
            /{currentQuestion.word.pronunciation}/
          </div>
          <div className="text-sm text-foreground/50 capitalize">
            {currentQuestion.word.category} • {currentQuestion.word.difficulty}
          </div>
        </div>

        {!showResult ? (
          <div className="space-y-6">
            <div>
              <label htmlFor="answer" className="block text-sm font-medium text-foreground mb-2">
                What does this mean in English?
              </label>
              <input
                id="answer"
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                placeholder="Type your answer..."
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-lg"
                autoFocus
              />
            </div>
            <button
              onClick={handleSubmitAnswer}
              disabled={!userAnswer.trim()}
              className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:opacity-90 cursor-pointer transition-all duration-200"
            >
              Submit Answer
            </button>
          </div>
        ) : (
          <div className={`text-center p-6 rounded-lg ${
            currentQuestion.isCorrect 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className={`text-4xl mb-2 ${
              currentQuestion.isCorrect ? 'text-green-600' : 'text-red-600'
            }`}>
              {currentQuestion.isCorrect ? '✅' : '❌'}
            </div>
            <div className={`text-xl font-semibold mb-2 ${
              currentQuestion.isCorrect ? 'text-green-800' : 'text-red-800'
            }`}>
              {currentQuestion.isCorrect ? 'Correct!' : 'Incorrect'}
            </div>
            {!currentQuestion.isCorrect && (
              <div className="space-y-1">
                <div className="text-red-600">Your answer: <span className="line-through">{currentQuestion.userAnswer}</span></div>
                <div className="text-green-600 font-semibold">Correct answer: {currentQuestion.word.english}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}