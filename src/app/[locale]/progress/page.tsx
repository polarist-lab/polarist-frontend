'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getKoreanWordsForLocale } from '@/data/words/index';
import { LearningTracker } from '@/lib/learning-tracker';
import { NaturalSignupManager } from '@/lib/natural-signup-manager';
import { TierSystemManager, TIER_CONFIG } from '@/lib/tier-system';
import { TierDisplay, TierRankingChart, PointsAnimation } from '@/components/tier-display';
import { Locale, isValidLocale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';
import { useParams } from 'next/navigation';

export default function ProgressPage() {
  const params = useParams();
  const locale = params?.locale as string;
  
  // 유효하지 않은 로케일인 경우 기본값 사용
  const validLocale: Locale = isValidLocale(locale) ? locale : 'en';
  const { t } = useTranslations(validLocale);
  const words = getKoreanWordsForLocale(validLocale);

  const [stats, setStats] = useState({
    totalWords: 0,
    studiedWords: 0,
    learnedWords: 0,
    progressPercentage: 0,
    averageConfidence: 0,
    recentActivityCount: 0,
    lastStudied: null as Date | null
  });
  const [categoryProgress, setCategoryProgress] = useState<Record<string, { total: number; learned: number; studied: number }>>({});
  const [difficultyProgress, setDifficultyProgress] = useState<Record<string, { total: number; learned: number; studied: number }>>({});
  const [learningProgress, setLearningProgress] = useState(NaturalSignupManager.getProgressSummary());
  const [currentTier, setCurrentTier] = useState(TierSystemManager.getCurrentTier());
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [animationPoints, setAnimationPoints] = useState(0);

  // Load learning statistics
  useEffect(() => {
    const studyStats = LearningTracker.getStudyStats();
    const categoryStats = LearningTracker.getCategoryProgress(words);
    const difficultyStats = LearningTracker.getDifficultyProgress(words);
    const progress = NaturalSignupManager.getProgressSummary();
    
    setStats({
      ...studyStats,
      totalWords: words.length, // 언어별 어휘 수로 업데이트
    });
    setCategoryProgress(categoryStats);
    setDifficultyProgress(difficultyStats);
    setLearningProgress(progress);
    setCurrentTier(TierSystemManager.getCurrentTier());
  }, [words]);

  // 테스트용 포인트 추가 함수
  const addTestPoints = (points: number) => {
    const result = TierSystemManager.addPoints(points);
    setAnimationPoints(points);
    setShowPointsAnimation(true);
    
    if (result.leveledUp) {
      setTimeout(() => {
        alert(t('testing.levelUp', { tier: result.newTier.tier, subLevel: result.newTier.subLevel }));
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary to-primary-dark text-white p-8 text-center shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">{t('progress.title')}</h1>
        <p className="text-xl text-white/90 font-light">{t('progress.subtitle')}</p>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-8">

        {/* Tier System Display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <TierDisplay showDetails={true} />
          </div>
          <div>
            <TierRankingChart />
          </div>
        </div>

        {/* Learning Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center hover:shadow-xl transition-shadow">
            <h3 className="text-4xl font-bold text-blue-600 mb-2">{learningProgress.totalLessons}</h3>
            <p className="text-gray-600 font-medium">{t('progress.completedLessons')}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center hover:shadow-xl transition-shadow">
            <h3 className="text-4xl font-bold text-green-600 mb-2">{learningProgress.totalHours}</h3>
            <p className="text-gray-600 font-medium">{t('progress.totalStudyTime')}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center hover:shadow-xl transition-shadow">
            <h3 className="text-4xl font-bold text-orange-600 mb-2">{learningProgress.streakDays}</h3>
            <p className="text-gray-600 font-medium">{t('progress.streakDays')} 🔥</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">{TIER_CONFIG[currentTier.tier].icon}</span>
              <h3 className="text-2xl font-bold text-purple-600">
                {TIER_CONFIG[currentTier.tier].displayName} {currentTier.subLevel}
              </h3>
            </div>
            <p className="text-gray-600 font-medium">{t('progress.currentTier')}</p>
          </div>
        </div>

        {/* Learning Journey */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span>🗺️</span>
            {t('progress.learningJourney')}
          </h3>
          
          <div className="space-y-6">
            {/* Roadmap Info */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h4 className="font-semibold text-blue-800 mb-2">{t('progress.selectedRoadmap')}</h4>
              <p className="text-blue-700">
                {(() => {
                  const savedRoadmap = typeof window !== 'undefined' ? localStorage.getItem('selected_roadmap') : null;
                  if (savedRoadmap) {
                    const parsed = JSON.parse(savedRoadmap);
                    return parsed.title || t('progress.selectRoadmapPlease');
                  }
                  return t('progress.selectRoadmapPlease');
                })()}
              </p>
            </div>

            {/* Progress Timeline */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">{t('progress.learningStats')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-700 mb-1">{learningProgress.contentTypes}</div>
                  <div className="text-sm text-gray-600">{t('progress.exploredContentTypes')}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-700 mb-1">
                    {(() => {
                      const progress = NaturalSignupManager.getProgress();
                      return progress.daysActive;
                    })()}
                  </div>
                  <div className="text-sm text-gray-600">{t('progress.totalActiveDays')}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-700 mb-1">
                    {(() => {
                      const progress = NaturalSignupManager.getProgress();
                      return progress.achievementsUnlocked;
                    })()}
                  </div>
                  <div className="text-sm text-gray-600">{t('progress.achievementsUnlocked')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Category Progress */}
          <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">📚 {t('home.progressByCategory')}</h3>
            <div className="space-y-3">
              {Object.entries(categoryProgress).map(([category, data]) => (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize">{category}</span>
                    <span className="text-xs text-foreground/60">{data.learned}/{data.total}</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-300"
                      style={{ width: `${data.total > 0 ? (data.learned / data.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty Progress */}
          <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">🎯 {t('home.progressByDifficulty')}</h3>
            <div className="space-y-3">
              {Object.entries(difficultyProgress).map(([difficulty, data]) => (
                <div key={difficulty} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize">{difficulty}</span>
                    <span className="text-xs text-foreground/60">{data.learned}/{data.total}</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        difficulty === 'beginner' 
                          ? 'bg-gradient-to-r from-green-400 to-green-600'
                          : difficulty === 'intermediate'
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                          : 'bg-gradient-to-r from-red-400 to-red-600'
                      }`}
                      style={{ width: `${data.total > 0 ? (data.learned / data.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        {(stats.recentActivityCount > 0 || stats.lastStudied) && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-12 border border-blue-200">
            <h3 className="text-lg font-bold text-blue-900 mb-3">📈 {t('statistics.recentActivity')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.recentActivityCount}</div>
                <div className="text-sm text-blue-700">{t('statistics.actionsThisWeek')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.averageConfidence.toFixed(1)}/5</div>
                <div className="text-sm text-blue-700">{t('statistics.averageConfidence')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.lastStudied ? new Date(stats.lastStudied).toLocaleDateString() : t('statistics.never')}
                </div>
                <div className="text-sm text-blue-700">{t('statistics.lastStudySession')}</div>
              </div>
            </div>
          </div>
        )}

        {/* 테스트용 포인트 추가 버튼들 */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{t('testing.tierSystemTest')}</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => addTestPoints(50)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {t('testing.addPointsLesson')}
            </button>
            <button
              onClick={() => addTestPoints(200)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              {t('testing.addPointsQuiz')}
            </button>
            <button
              onClick={() => addTestPoints(500)}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              {t('testing.addPointsExam')}
            </button>
            <button
              onClick={() => TierSystemManager.resetTier()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              {t('testing.resetTier')}
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            {t('testing.autoPointsNote')}
          </p>
        </div>

        {/* 포인트 애니메이션 */}
        {showPointsAnimation && (
          <PointsAnimation 
            points={animationPoints}
            onComplete={() => setShowPointsAnimation(false)}
          />
        )}
      </main>
    </div>
  );
}