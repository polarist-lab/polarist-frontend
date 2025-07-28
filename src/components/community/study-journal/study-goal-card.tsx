'use client';

import { StudyGoal } from '@/lib/community/types';
import { Locale } from '@/lib/i18n/config';

interface StudyGoalCardProps {
  goal: StudyGoal;
  locale: Locale;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleComplete?: () => void;
}

export function StudyGoalCard({
  goal,
  locale,
  onEdit,
  onDelete,
  onToggleComplete
}: StudyGoalCardProps) {
  const categoryLabels = {
    grammar: { ko: '문법', en: 'Grammar', icon: '📚', color: 'bg-blue-100 text-blue-800' },
    vocabulary: { ko: '어휘', en: 'Vocabulary', icon: '📝', color: 'bg-green-100 text-green-800' },
    pronunciation: { ko: '발음', en: 'Pronunciation', icon: '🗣️', color: 'bg-purple-100 text-purple-800' },
    culture: { ko: '문화', en: 'Culture', icon: '🎭', color: 'bg-pink-100 text-pink-800' },
    exam: { ko: '시험', en: 'Exam Prep', icon: '📋', color: 'bg-orange-100 text-orange-800' },
    conversation: { ko: '회화', en: 'Conversation', icon: '💬', color: 'bg-indigo-100 text-indigo-800' },
    writing: { ko: '쓰기', en: 'Writing', icon: '✍️', color: 'bg-yellow-100 text-yellow-800' },
    listening: { ko: '듣기', en: 'Listening', icon: '👂', color: 'bg-teal-100 text-teal-800' },
    reading: { ko: '읽기', en: 'Reading', icon: '📖', color: 'bg-cyan-100 text-cyan-800' },
    general: { ko: '일반', en: 'General', icon: '🌟', color: 'bg-gray-100 text-gray-800' }
  };

  const difficultyLabels = {
    beginner: { ko: '초급', en: 'Beginner', color: 'bg-green-50 text-green-700' },
    intermediate: { ko: '중급', en: 'Intermediate', color: 'bg-yellow-50 text-yellow-700' },
    advanced: { ko: '고급', en: 'Advanced', color: 'bg-red-50 text-red-700' }
  };

  const categoryInfo = categoryLabels[goal.category];
  const difficultyInfo = difficultyLabels[goal.difficulty];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getDaysUntilTarget = () => {
    const now = new Date();
    const target = new Date(goal.targetDate);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days`;
  };

  const getProgressColor = () => {
    if (goal.isCompleted) return 'bg-green-500';
    if (goal.progress >= 75) return 'bg-blue-500';
    if (goal.progress >= 50) return 'bg-yellow-500';
    if (goal.progress >= 25) return 'bg-orange-500';
    return 'bg-gray-300';
  };

  const getStatusColor = () => {
    if (goal.isCompleted) return 'text-green-600';
    const daysUntil = getDaysUntilTarget();
    if (daysUntil === 'Overdue') return 'text-red-600';
    if (daysUntil === 'Today' || daysUntil === 'Tomorrow') return 'text-orange-600';
    return 'text-gray-600';
  };

  return (
    <div className={`bg-white rounded-xl border-2 p-6 transition-all hover:shadow-md ${
      goal.isCompleted 
        ? 'border-green-200 bg-green-50/30' 
        : 'border-gray-200 hover:border-blue-200'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
            {categoryInfo.icon} {categoryInfo[locale]}
          </span>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${difficultyInfo.color}`}>
            {difficultyInfo[locale]}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className={`text-lg font-semibold mb-2 ${goal.isCompleted ? 'text-green-800 line-through' : 'text-gray-900'}`}>
        {goal.title}
      </h3>

      {/* Description */}
      {goal.description && (
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {goal.description}
        </p>
      )}

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-700">{goal.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>

      {/* Target Date */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-600">Target Date:</span>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">{formatDate(goal.targetDate)}</div>
          <div className={`text-xs ${getStatusColor()}`}>{getDaysUntilTarget()}</div>
        </div>
      </div>

      {/* Milestones */}
      {goal.milestones.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Milestones ({goal.completedMilestones.length}/{goal.milestones.length})
          </h4>
          <div className="space-y-1">
            {goal.milestones.slice(0, 3).map((milestone, index) => {
              const isCompleted = goal.completedMilestones.includes(milestone);
              return (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : 'border-2 border-gray-300'
                  }`}>
                    {isCompleted && (
                      <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm ${isCompleted ? 'text-green-700 line-through' : 'text-gray-600'}`}>
                    {milestone}
                  </span>
                </div>
              );
            })}
            {goal.milestones.length > 3 && (
              <div className="text-xs text-gray-500 ml-6">
                +{goal.milestones.length - 3} more milestones...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={onToggleComplete}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            goal.isCompleted
              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {goal.isCompleted ? 'Reopen' : 'Mark Complete'}
        </button>
        
        {!goal.isCompleted && goal.progress < 100 && (
          <button
            onClick={() => {
              // TODO: Open progress update modal
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Update Progress
          </button>
        )}
      </div>

      {/* Completion Badge */}
      {goal.isCompleted && (
        <div className="absolute top-2 right-2">
          <div className="bg-green-500 text-white rounded-full p-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}