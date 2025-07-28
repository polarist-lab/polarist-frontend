'use client';

import { StudySession } from '@/lib/community/types';
import { Locale } from '@/lib/i18n/config';

interface StudySessionCardProps {
  session: StudySession;
  locale: Locale;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function StudySessionCard({
  session,
  locale,
  onEdit,
  onDelete
}: StudySessionCardProps) {
  const sessionTypeLabels = {
    vocabulary: { ko: '어휘', en: 'Vocabulary', icon: '📝', color: 'bg-green-100 text-green-800' },
    grammar: { ko: '문법', en: 'Grammar', icon: '📚', color: 'bg-blue-100 text-blue-800' },
    listening: { ko: '듣기', en: 'Listening', icon: '👂', color: 'bg-purple-100 text-purple-800' },
    speaking: { ko: '말하기', en: 'Speaking', icon: '🗣️', color: 'bg-orange-100 text-orange-800' },
    reading: { ko: '읽기', en: 'Reading', icon: '📖', color: 'bg-indigo-100 text-indigo-800' },
    writing: { ko: '쓰기', en: 'Writing', icon: '✍️', color: 'bg-yellow-100 text-yellow-800' },
    review: { ko: '복습', en: 'Review', icon: '🔄', color: 'bg-cyan-100 text-cyan-800' },
    'exam-prep': { ko: '시험준비', en: 'Exam Prep', icon: '📋', color: 'bg-red-100 text-red-800' }
  };

  const typeInfo = sessionTypeLabels[session.type];

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getMoodIcon = (mood: number) => {
    switch (mood) {
      case 1: return '😞';
      case 2: return '😕';
      case 3: return '😐';
      case 4: return '😊';
      case 5: return '😄';
      default: return '😐';
    }
  };

  const getSatisfactionColor = (satisfaction: number) => {
    if (satisfaction >= 4) return 'text-green-600';
    if (satisfaction >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${typeInfo.color}`}>
            {typeInfo.icon} {typeInfo[locale]}
          </span>
          <span className="text-sm text-gray-500">{formatDate(session.createdAt)}</span>
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
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{session.title}</h3>
      
      {/* Description */}
      {session.description && (
        <p className="text-gray-600 mb-4 line-clamp-2">{session.description}</p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-900">{formatDuration(session.duration)}</div>
          <div className="text-xs text-gray-500">Duration</div>
        </div>
        <div className="text-center">
          <div className="text-lg">{getMoodIcon(session.mood)}</div>
          <div className="text-xs text-gray-500">Mood</div>
        </div>
        <div className="text-center">
          <div className={`text-sm font-medium ${getSatisfactionColor(session.satisfaction)}`}>
            {session.satisfaction}/5
          </div>
          <div className="text-xs text-gray-500">Satisfaction</div>
        </div>
      </div>

      {/* Goals & Achievements */}
      {(session.goals.length > 0 || session.achievements.length > 0) && (
        <div className="space-y-3 mb-4">
          {session.goals.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Goals:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {session.goals.slice(0, 2).map((goal, index) => (
                  <li key={index} className="line-clamp-1">{goal}</li>
                ))}
                {session.goals.length > 2 && (
                  <li className="text-gray-500">+{session.goals.length - 2} more...</li>
                )}
              </ul>
            </div>
          )}
          
          {session.achievements.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Achievements:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {session.achievements.slice(0, 2).map((achievement, index) => (
                  <li key={index} className="line-clamp-1">{achievement}</li>
                ))}
                {session.achievements.length > 2 && (
                  <li className="text-gray-500">+{session.achievements.length - 2} more...</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Vocabulary & Materials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {session.newVocabulary.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">New Vocabulary ({session.newVocabulary.length}):</h4>
            <div className="flex flex-wrap gap-1">
              {session.newVocabulary.slice(0, 3).map((word, index) => (
                <span key={index} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {word}
                </span>
              ))}
              {session.newVocabulary.length > 3 && (
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  +{session.newVocabulary.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {session.materials.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Materials ({session.materials.length}):</h4>
            <div className="space-y-1">
              {session.materials.slice(0, 2).map((material, index) => (
                <div key={index} className="text-sm text-gray-600 truncate">{material}</div>
              ))}
              {session.materials.length > 2 && (
                <div className="text-xs text-gray-500">+{session.materials.length - 2} more...</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Challenges */}
      {session.challenges.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Challenges:</h4>
          <div className="text-sm text-gray-600">
            {session.challenges[0]}
            {session.challenges.length > 1 && (
              <span className="text-gray-500"> (+{session.challenges.length - 1} more)</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}