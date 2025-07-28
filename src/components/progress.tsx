'use client'

import { useMemo } from 'react';
import { KoreanWord, LearningProgress } from '@/lib/types';

interface ProgressProps {
  words: KoreanWord[];
  learningProgress: LearningProgress[];
}

export function Progress({ words, learningProgress }: ProgressProps) {
  const stats = useMemo(() => {
    const totalWords = words.length;
    const learnedWords = learningProgress.filter(p => p.isLearned).length;
    const progressPercentage = totalWords > 0 ? Math.round((learnedWords / totalWords) * 100) : 0;

    return {
      totalWords,
      learnedWords,
      remainingWords: totalWords - learnedWords,
      progressPercentage
    };
  }, [words, learningProgress]);

  const circumference = 2 * Math.PI * 50;
  const strokeDashoffset = circumference - (stats.progressPercentage / 100) * circumference;

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-8">Your Progress</h2>
        
        {/* Progress Summary */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8 mb-6">
          <div className="flex items-center justify-center gap-8 flex-col md:flex-row">
            {/* Progress Circle */}
            <div className="relative flex-shrink-0">
              <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="rgb(226, 232, 240)"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500 ease-out"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgb(102, 126, 234)" />
                    <stop offset="100%" stopColor="rgb(118, 75, 162)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {stats.progressPercentage}%
                </span>
              </div>
            </div>
            
            {/* Progress Description */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {stats.learnedWords} out of {stats.totalWords} words learned
              </h3>
              <p className="text-foreground/70">
                {stats.remainingWords > 0 
                  ? `${stats.remainingWords} more words to go!` 
                  : 'Congratulations! You\'ve learned all words! 🎉'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Stats */}
      <div className="flex gap-4 justify-center mb-6">
        <div className="bg-card rounded-xl shadow-md border border-border p-6 text-center flex-1 max-w-32 hover:shadow-lg transition-shadow">
          <div className="text-2xl font-bold text-primary mb-1">
            {stats.learnedWords}
          </div>
          <div className="text-sm text-foreground/70 font-medium">
            Learned
          </div>
        </div>
        <div className="bg-card rounded-xl shadow-md border border-border p-6 text-center flex-1 max-w-32 hover:shadow-lg transition-shadow">
          <div className="text-2xl font-bold text-primary mb-1">
            {stats.remainingWords}
          </div>
          <div className="text-sm text-foreground/70 font-medium">
            Remaining
          </div>
        </div>
        <div className="bg-card rounded-xl shadow-md border border-border p-6 text-center flex-1 max-w-32 hover:shadow-lg transition-shadow">
          <div className="text-2xl font-bold text-primary mb-1">
            {stats.totalWords}
          </div>
          <div className="text-sm text-foreground/70 font-medium">
            Total
          </div>
        </div>
      </div>

      {/* Empty State */}
      {learningProgress.length === 0 && (
        <div className="text-center p-12 bg-card rounded-2xl shadow-lg border border-border">
          <div className="text-6xl mb-4 opacity-50">📚</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Ready to start learning?</h3>
          <p className="text-foreground/60">Begin studying to track your progress here!</p>
        </div>
      )}
    </div>
  );
}