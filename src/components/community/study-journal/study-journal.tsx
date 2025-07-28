'use client';

import { useState, useEffect } from 'react';
import { StudySession, StudyGoal, StudySessionType, Difficulty } from '@/lib/community/types';
import { Locale } from '@/lib/i18n/config';
import { StudySessionCard } from './study-session-card';
import { StudyGoalCard } from './study-goal-card';
import { StudySessionEditor } from './study-session-editor';
import { StudyJournalDataManager } from '@/lib/community/study-journal-manager';

interface StudyJournalProps {
  locale: Locale;
}

type ViewMode = 'timeline' | 'goals' | 'stats';
type TimeFilter = 'today' | 'week' | 'month' | 'all';

export function StudyJournal({ locale }: StudyJournalProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [studyGoals, setStudyGoals] = useState<StudyGoal[]>([]);
  const [showSessionEditor, setShowSessionEditor] = useState(false);
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const sessions = StudyJournalDataManager.getStudySessions(timeFilter);
        const goals = StudyJournalDataManager.getStudyGoals();
        setStudySessions(sessions);
        setStudyGoals(goals);
      } catch (error) {
        console.error('Failed to load study data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [timeFilter]);

  const handleCreateSession = () => {
    setEditingSession(null);
    setShowSessionEditor(true);
  };

  const handleEditSession = (session: StudySession) => {
    setEditingSession(session);
    setShowSessionEditor(true);
  };

  const handleSaveSession = (sessionData: Omit<StudySession, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (editingSession) {
      // Update existing session
      const updatedSession = {
        ...editingSession,
        ...sessionData,
        updatedAt: new Date()
      };
      StudyJournalDataManager.updateStudySession(updatedSession.id, updatedSession);
      setStudySessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));
    } else {
      // Create new session
      const newSession: StudySession = {
        ...sessionData,
        id: `session_${Date.now()}`,
        userId: 'current_user',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      StudyJournalDataManager.addStudySession(newSession);
      setStudySessions(prev => [newSession, ...prev]);
    }
    setShowSessionEditor(false);
    setEditingSession(null);
  };

  const handleDeleteSession = (sessionId: string) => {
    StudyJournalDataManager.deleteStudySession(sessionId);
    setStudySessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const getFilteredSessions = () => {
    const now = new Date();
    let startDate: Date;

    switch (timeFilter) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        return studySessions;
    }

    return studySessions.filter(session => session.createdAt >= startDate);
  };

  const getStudyStats = () => {
    const sessions = getFilteredSessions();
    const totalSessions = sessions.length;
    const totalTime = sessions.reduce((acc, session) => acc + (session.duration || 0), 0);
    const avgMood = sessions.length > 0 ? sessions.reduce((acc, session) => acc + session.mood, 0) / sessions.length : 0;
    const avgSatisfaction = sessions.length > 0 ? sessions.reduce((acc, session) => acc + session.satisfaction, 0) / sessions.length : 0;

    const typeDistribution = sessions.reduce((acc, session) => {
      acc[session.type] = (acc[session.type] || 0) + 1;
      return acc;
    }, {} as Record<StudySessionType, number>);

    return {
      totalSessions,
      totalTime,
      avgMood,
      avgSatisfaction,
      typeDistribution
    };
  };

  const stats = getStudyStats();
  const filteredSessions = getFilteredSessions();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your study journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Study Journal</h1>
              <p className="text-gray-600">Track your Korean learning journey</p>
            </div>
            
            <button
              onClick={handleCreateSession}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Entry
            </button>
          </div>

          {/* View Mode Tabs */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg w-fit">
            {[
              { id: 'timeline', label: 'Timeline', icon: '📅' },
              { id: 'goals', label: 'Goals', icon: '🎯' },
              { id: 'stats', label: 'Stats', icon: '📊' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as ViewMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === mode.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{mode.icon}</span>
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {viewMode === 'timeline' && (
          <div>
            {/* Time Filter */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm font-medium text-gray-700">Show:</span>
              {[
                { id: 'today', label: 'Today' },
                { id: 'week', label: 'This Week' },
                { id: 'month', label: 'This Month' },
                { id: 'all', label: 'All Time' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setTimeFilter(filter.id as TimeFilter)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    timeFilter === filter.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Study Sessions Timeline */}
            <div className="space-y-4">
              {filteredSessions.length > 0 ? (
                filteredSessions.map((session) => (
                  <StudySessionCard
                    key={session.id}
                    session={session}
                    locale={locale}
                    onEdit={() => handleEditSession(session)}
                    onDelete={() => handleDeleteSession(session.id)}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 opacity-50">📝</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No study sessions yet</h3>
                  <p className="text-gray-600 mb-4">Start tracking your Korean learning progress!</p>
                  <button
                    onClick={handleCreateSession}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Your First Entry
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {viewMode === 'goals' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studyGoals.map((goal) => (
                <StudyGoalCard
                  key={goal.id}
                  goal={goal}
                  locale={locale}
                />
              ))}
              
              {studyGoals.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4 opacity-50">🎯</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No goals set yet</h3>
                  <p className="text-gray-600 mb-4">Set learning goals to stay motivated!</p>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Create Your First Goal
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {viewMode === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Summary Cards */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalSessions}</div>
              <div className="text-sm text-gray-600">Study Sessions</div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {Math.floor(stats.totalTime / 60)}h {stats.totalTime % 60}m
              </div>
              <div className="text-sm text-gray-600">Total Study Time</div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {stats.avgMood.toFixed(1)}/5
              </div>
              <div className="text-sm text-gray-600">Average Mood</div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {stats.avgSatisfaction.toFixed(1)}/5
              </div>
              <div className="text-sm text-gray-600">Average Satisfaction</div>
            </div>

            {/* Study Type Distribution */}
            <div className="md:col-span-2 lg:col-span-4 bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Type Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(stats.typeDistribution).map(([type, count]) => (
                  <div key={type} className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">{count}</div>
                    <div className="text-sm text-gray-600 capitalize">{type}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Study Session Editor Modal */}
      {showSessionEditor && (
        <StudySessionEditor
          locale={locale}
          initialSession={editingSession}
          onSave={handleSaveSession}
          onCancel={() => {
            setShowSessionEditor(false);
            setEditingSession(null);
          }}
        />
      )}
    </div>
  );
}