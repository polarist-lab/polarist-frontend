// Study Journal Data Manager - Local Storage Based
import { StudySession, StudyGoal, StudySessionType, StudyStreak } from './types';

const STORAGE_KEYS = {
  STUDY_SESSIONS: 'study_sessions',
  STUDY_GOALS: 'study_goals',
  STUDY_STREAK: 'study_streak',
} as const;

export class StudyJournalDataManager {
  // Study Sessions Management
  static getAllStudySessions(): StudySession[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(STORAGE_KEYS.STUDY_SESSIONS);
    if (stored) {
      const sessions = JSON.parse(stored);
      return sessions.map((session: any) => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: session.endTime ? new Date(session.endTime) : undefined,
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt),
      }));
    }
    
    return [];
  }

  static getStudySessions(timeFilter: 'today' | 'week' | 'month' | 'all' = 'all'): StudySession[] {
    const sessions = this.getAllStudySessions();
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
        return sessions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return sessions
      .filter(session => session.createdAt >= startDate)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  static getStudySession(id: string): StudySession | null {
    const sessions = this.getAllStudySessions();
    return sessions.find(session => session.id === id) || null;
  }

  static saveStudySessions(sessions: StudySession[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.STUDY_SESSIONS, JSON.stringify(sessions));
  }

  static addStudySession(session: StudySession): void {
    const sessions = this.getAllStudySessions();
    sessions.unshift(session); // Add to beginning
    this.saveStudySessions(sessions);
    this.updateStreak(session.startTime);
  }

  static updateStudySession(id: string, updates: Partial<StudySession>): boolean {
    const sessions = this.getAllStudySessions();
    const index = sessions.findIndex(session => session.id === id);
    if (index === -1) return false;
    
    sessions[index] = { ...sessions[index], ...updates, updatedAt: new Date() };
    this.saveStudySessions(sessions);
    return true;
  }

  static deleteStudySession(id: string): boolean {
    const sessions = this.getAllStudySessions();
    const filtered = sessions.filter(session => session.id !== id);
    if (filtered.length === sessions.length) return false;
    
    this.saveStudySessions(filtered);
    return true;
  }

  // Study Goals Management
  static getAllStudyGoals(): StudyGoal[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(STORAGE_KEYS.STUDY_GOALS);
    if (stored) {
      const goals = JSON.parse(stored);
      return goals.map((goal: any) => ({
        ...goal,
        targetDate: new Date(goal.targetDate),
        createdAt: new Date(goal.createdAt),
        updatedAt: new Date(goal.updatedAt),
      }));
    }
    
    return [];
  }

  static getStudyGoals(): StudyGoal[] {
    return this.getAllStudyGoals().sort((a, b) => {
      // Sort by completion status, then by target date
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }
      return a.targetDate.getTime() - b.targetDate.getTime();
    });
  }

  static saveStudyGoals(goals: StudyGoal[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.STUDY_GOALS, JSON.stringify(goals));
  }

  static addStudyGoal(goal: StudyGoal): void {
    const goals = this.getAllStudyGoals();
    goals.push(goal);
    this.saveStudyGoals(goals);
  }

  static updateStudyGoal(id: string, updates: Partial<StudyGoal>): boolean {
    const goals = this.getAllStudyGoals();
    const index = goals.findIndex(goal => goal.id === id);
    if (index === -1) return false;
    
    goals[index] = { ...goals[index], ...updates, updatedAt: new Date() };
    this.saveStudyGoals(goals);
    return true;
  }

  static deleteStudyGoal(id: string): boolean {
    const goals = this.getAllStudyGoals();
    const filtered = goals.filter(goal => goal.id !== id);
    if (filtered.length === goals.length) return false;
    
    this.saveStudyGoals(filtered);
    return true;
  }

  // Study Streak Management
  static getStudyStreak(): StudyStreak {
    if (typeof window === 'undefined') {
      return {
        userId: 'current_user',
        currentStreak: 0,
        longestStreak: 0,
        lastStudyDate: new Date(),
        streakHistory: []
      };
    }
    
    const stored = localStorage.getItem(STORAGE_KEYS.STUDY_STREAK);
    if (stored) {
      const streak = JSON.parse(stored);
      return {
        ...streak,
        lastStudyDate: new Date(streak.lastStudyDate),
        streakHistory: streak.streakHistory.map((date: string) => new Date(date))
      };
    }
    
    return {
      userId: 'current_user',
      currentStreak: 0,
      longestStreak: 0,
      lastStudyDate: new Date(),
      streakHistory: []
    };
  }

  static saveStudyStreak(streak: StudyStreak): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.STUDY_STREAK, JSON.stringify(streak));
  }

  static updateStreak(studyDate: Date): void {
    const streak = this.getStudyStreak();
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    
    // Normalize dates to compare only year/month/day
    const normalizeDate = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const normalizedStudyDate = normalizeDate(studyDate);
    const normalizedToday = normalizeDate(today);
    const normalizedYesterday = normalizeDate(yesterday);
    const normalizedLastStudy = normalizeDate(streak.lastStudyDate);

    // Check if this is a new study day
    const studyDateStr = normalizedStudyDate.toISOString();
    if (!streak.streakHistory.some(date => normalizeDate(date).toISOString() === studyDateStr)) {
      streak.streakHistory.push(normalizedStudyDate);
    }

    // Update streak logic
    if (normalizedStudyDate.getTime() === normalizedToday.getTime()) {
      // Studying today
      if (normalizedLastStudy.getTime() === normalizedYesterday.getTime()) {
        // Consecutive day
        streak.currentStreak += 1;
      } else if (normalizedLastStudy.getTime() < normalizedYesterday.getTime()) {
        // Streak broken, start new
        streak.currentStreak = 1;
      }
      // If already studied today, don't change streak
    } else if (normalizedStudyDate.getTime() === normalizedYesterday.getTime()) {
      // Studying yesterday (for backdated entries)
      if (normalizedLastStudy.getTime() < normalizedYesterday.getTime()) {
        streak.currentStreak = 1;
      }
    }

    // Update longest streak
    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }

    streak.lastStudyDate = studyDate;
    this.saveStudyStreak(streak);
  }

  // Analytics and Statistics
  static getStudyStats(timeFilter: 'today' | 'week' | 'month' | 'all' = 'all') {
    const sessions = this.getStudySessions(timeFilter);
    
    const totalSessions = sessions.length;
    const totalTime = sessions.reduce((acc, session) => acc + (session.duration || 0), 0);
    const avgMood = sessions.length > 0 ? sessions.reduce((acc, session) => acc + session.mood, 0) / sessions.length : 0;
    const avgSatisfaction = sessions.length > 0 ? sessions.reduce((acc, session) => acc + session.satisfaction, 0) / sessions.length : 0;

    const typeDistribution = sessions.reduce((acc, session) => {
      acc[session.type] = (acc[session.type] || 0) + 1;
      return acc;
    }, {} as Record<StudySessionType, number>);

    const totalVocabulary = sessions.reduce((acc, session) => acc + session.newVocabulary.length, 0);
    const totalMaterials = sessions.reduce((acc, session) => acc + session.materials.length, 0);

    return {
      totalSessions,
      totalTime,
      avgMood,
      avgSatisfaction,
      typeDistribution,
      totalVocabulary,
      totalMaterials
    };
  }

  static getProgressOverTime(days: number = 30) {
    const sessions = this.getAllStudySessions();
    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    const dailyProgress: Record<string, { sessions: number; time: number; mood: number }> = {};
    
    // Initialize all days
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      dailyProgress[dateStr] = { sessions: 0, time: 0, mood: 0 };
    }

    // Fill with actual data
    sessions
      .filter(session => session.createdAt >= startDate)
      .forEach(session => {
        const dateStr = session.createdAt.toISOString().split('T')[0];
        if (dailyProgress[dateStr]) {
          dailyProgress[dateStr].sessions += 1;
          dailyProgress[dateStr].time += session.duration || 0;
          dailyProgress[dateStr].mood = (dailyProgress[dateStr].mood + session.mood) / 2;
        }
      });

    return Object.entries(dailyProgress).map(([date, data]) => ({
      date,
      ...data
    }));
  }

  // Achievements and Milestones
  static checkAchievements(): string[] {
    const sessions = this.getAllStudySessions();
    const goals = this.getAllStudyGoals();
    const streak = this.getStudyStreak();
    const achievements: string[] = [];

    // Study streak achievements
    if (streak.currentStreak >= 7) achievements.push('Week Warrior');
    if (streak.currentStreak >= 30) achievements.push('Month Master');
    if (streak.currentStreak >= 100) achievements.push('Dedication Champion');

    // Session count achievements
    const totalSessions = sessions.length;
    if (totalSessions >= 10) achievements.push('Getting Started');
    if (totalSessions >= 50) achievements.push('Committed Learner');
    if (totalSessions >= 100) achievements.push('Study Machine');

    // Time-based achievements
    const totalTime = sessions.reduce((acc, session) => acc + (session.duration || 0), 0);
    if (totalTime >= 1000) achievements.push('Time Investor'); // ~16+ hours
    if (totalTime >= 5000) achievements.push('Serious Student'); // ~83+ hours
    if (totalTime >= 10000) achievements.push('Korean Scholar'); // ~166+ hours

    // Goal completion achievements
    const completedGoals = goals.filter(goal => goal.isCompleted).length;
    if (completedGoals >= 1) achievements.push('Goal Getter');
    if (completedGoals >= 5) achievements.push('Achievement Unlocked');
    if (completedGoals >= 10) achievements.push('Goal Master');

    return achievements;
  }
}