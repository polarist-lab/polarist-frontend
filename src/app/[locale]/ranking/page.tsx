'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Locale, isValidLocale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';
import { useAuth } from '@/components/auth/auth-provider';
import { RankingSystemManager, UserRankingData, TierStatistics, GlobalRankingStats } from '@/lib/ranking-system';
import { TIER_CONFIG, TierName } from '@/lib/tier-system';
import { TierDisplay } from '@/components/tier-display';

type TabType = 'leaderboard' | 'tier-stats' | 'my-rank';

export default function RankingPage() {
  const params = useParams();
  const locale = params?.locale as string;
  const validLocale: Locale = isValidLocale(locale) ? locale : 'en';
  const { t } = useTranslations(validLocale);
  const { user, loading } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>('leaderboard');
  const [leaderboard, setLeaderboard] = useState<UserRankingData[]>([]);
  const [tierStats, setTierStats] = useState<TierStatistics[]>([]);
  const [globalStats, setGlobalStats] = useState<GlobalRankingStats | null>(null);
  const [currentUserRank, setCurrentUserRank] = useState<{
    rank: number;
    percentile: number;
    usersAbove: number;
    usersBelow: number;
  } | null>(null);
  const [selectedTier, setSelectedTier] = useState<TierName | null>(null);

  useEffect(() => {
    // 데이터 로드
    const isAuthenticated = !!user;
    setLeaderboard(RankingSystemManager.getLeaderboard(isAuthenticated ? 50 : 20, isAuthenticated));
    setTierStats(RankingSystemManager.getTierStatistics(isAuthenticated));
    setGlobalStats(RankingSystemManager.getGlobalStats(isAuthenticated));
    setCurrentUserRank(isAuthenticated ? RankingSystemManager.getCurrentUserRank() : null);
  }, [user]);

  const tabs = [
    { id: 'leaderboard' as TabType, name: t('ranking.leaderboard') },
    { id: 'tier-stats' as TabType, name: t('ranking.tierStats') },
    ...(user ? [{ id: 'my-rank' as TabType, name: t('ranking.myRank') }] : [])
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-8 text-center shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
          {t('ranking.title')}
        </h1>
        <p className="text-xl text-white/90 font-light">
          {t('ranking.subtitle')}
        </p>
      </header>

      {/* Sign-up encouragement banner for non-authenticated users */}
      {!user && (
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white text-center shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-2xl">🚀</span>
              <h3 className="text-xl font-bold">{t('ranking.joinCommunity')}</h3>
            </div>
            <p className="text-blue-100 mb-4 max-w-2xl mx-auto">
              {t('ranking.joinDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.href = `/${validLocale}/signup`}
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                {t('common.signUp')}
              </button>
              <button
                onClick={() => window.location.href = `/${validLocale}/signin`}
                className="border border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                {t('common.signIn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 글로벌 통계 요약 */}
      {globalStats && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {globalStats.totalUsers.toLocaleString()}
              </div>
              <div className="text-gray-600">{t('ranking.totalLearners')}</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {globalStats.activeUsers.toLocaleString()}
              </div>
              <div className="text-gray-600">{t('ranking.activeUsers')}</div>
              <div className="text-xs text-gray-500 mt-1">{t('ranking.last30days')}</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {globalStats.averageTier}
              </div>
              <div className="text-gray-600">{t('ranking.averageTier')}</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {Math.round((globalStats.activeUsers / globalStats.totalUsers) * 100)}%
              </div>
              <div className="text-gray-600">{t('ranking.activityRate')}</div>
            </div>
          </div>
        </div>
      )}

      {/* 탭 네비게이션 */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex space-x-1 bg-white rounded-xl p-1 shadow-lg mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {t('ranking.leaderboard')}
            </h2>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">{t('ranking.rank')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">{t('ranking.user')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">{t('ranking.tier')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">{t('ranking.points')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">{t('ranking.badges')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">{t('ranking.lastActive')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {leaderboard.map((user) => {
                      const tierInfo = TIER_CONFIG[user.tier];
                      const isCurrentUser = user.userId === 'current-user';
                      
                      return (
                        <tr 
                          key={user.userId}
                          className={`hover:bg-gray-50 transition-colors ${
                            isCurrentUser ? 'bg-blue-50 ring-2 ring-blue-200' : ''
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {user.rank <= 3 && (
                                <span className="text-xl">
                                  {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}
                                </span>
                              )}
                              <span className={`font-bold ${
                                user.rank <= 10 ? 'text-lg' : 'text-base'
                              }`}>
                                #{user.rank}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                {user.username[0].toUpperCase()}
                              </div>
                              <div>
                                <div className={`font-semibold ${isCurrentUser ? 'text-blue-600' : 'text-gray-800'}`}>
                                  {user.username} {isCurrentUser && t('ranking.me')}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                  {user.country && <span>{user.country}</span>}
                                  <span>{t('ranking.joinDate')}: {user.joinDate.toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${tierInfo.bgColor} ${tierInfo.borderColor} border`}>
                              <span className="text-lg">{tierInfo.icon}</span>
                              <span className={`font-semibold text-sm ${tierInfo.color}`}>
                                {tierInfo.displayName} {user.subLevel}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-gray-800">
                              {user.totalPoints.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-1">
                              {user.badges.map((badge, i) => (
                                <span key={i} className="text-lg">{badge}</span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">
                              {Math.floor((Date.now() - user.lastActive.getTime()) / (1000 * 60 * 60 * 24))} {t('ranking.daysAgo')}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tier-stats' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {t('ranking.tierStats')}
            </h2>

            {/* 티어 분포 차트 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('ranking.tierDistribution')}</h3>
              <div className="space-y-4">
                {tierStats.map((stat) => {
                  const tierInfo = TIER_CONFIG[stat.tier];
                  
                  return (
                    <div key={stat.tier} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{tierInfo.icon}</span>
                          <span className={`font-semibold ${tierInfo.color}`}>
                            {tierInfo.displayName}
                          </span>
                          <span className="text-sm text-gray-500">
                            {t('statistics.userCount', { count: stat.userCount, percentage: stat.percentage })}
                          </span>
                        </div>
                        {stat.topUser && (
                          <div className="text-sm text-gray-600">
                            {t('ranking.topUser')}: {stat.topUser.username} ({stat.topUser.points.toLocaleString()} {t('ranking.points')})
                          </div>
                        )}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            stat.tier === 'iron' ? 'bg-gray-500' :
                            stat.tier === 'bronze' ? 'bg-amber-500' :
                            stat.tier === 'silver' ? 'bg-gray-400' :
                            stat.tier === 'gold' ? 'bg-yellow-500' :
                            stat.tier === 'platinum' ? 'bg-cyan-500' :
                            'bg-blue-500'
                          }`}
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500">
                        {t('ranking.averagePoints')}: {stat.averagePoints.toLocaleString()} {t('ranking.points')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 최근 승급 */}
            {globalStats && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('ranking.recentPromotions')}</h3>
                <div className="space-y-3">
                  {globalStats.recentPromotions.map((promotion, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🎊</span>
                        <div>
                          <div className="font-semibold text-gray-800">
                            {promotion.username}
                          </div>
                          <div className="text-sm text-gray-600">
                            {promotion.fromTier} → {promotion.toTier}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {Math.floor((Date.now() - promotion.date.getTime()) / (1000 * 60 * 60 * 24))} {t('ranking.daysAgo')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'my-rank' && currentUserRank && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {t('ranking.myRankInfo')}
            </h2>

            {/* 현재 티어 표시 */}
            <div className="mb-6">
              <TierDisplay showDetails={true} />
            </div>

            {/* 순위 통계 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  #{currentUserRank.rank}
                </div>
                <div className="text-gray-600">{t('ranking.overallRank')}</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {currentUserRank.percentile}%
                </div>
                <div className="text-gray-600">{t('ranking.topPercentile')}</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {currentUserRank.usersAbove}
                </div>
                <div className="text-gray-600">{t('ranking.usersAhead')}</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {currentUserRank.usersBelow}
                </div>
                <div className="text-gray-600">{t('ranking.usersBehind')}</div>
              </div>
            </div>

            {/* 나와 비슷한 레벨의 사용자들 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {t('ranking.similarLevel')}
              </h3>
              <div className="space-y-2">
                {leaderboard
                  .slice(Math.max(0, currentUserRank?.rank ? currentUserRank.rank - 3 : 0), (currentUserRank?.rank ? currentUserRank.rank + 2 : 5))
                  .map((user) => {
                    const tierInfo = TIER_CONFIG[user.tier];
                    const isCurrentUser = user.userId === 'current-user';
                    
                    return (
                      <div 
                        key={user.userId}
                        className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                          isCurrentUser ? 'bg-blue-50 ring-2 ring-blue-200' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-600">#{user.rank}</span>
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {user.username[0].toUpperCase()}
                          </div>
                          <span className={`font-semibold ${isCurrentUser ? 'text-blue-600' : 'text-gray-800'}`}>
                            {user.username} {isCurrentUser && t('ranking.me')}
                          </span>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${tierInfo.bgColor} ${tierInfo.borderColor} border`}>
                            <span>{tierInfo.icon}</span>
                            <span className={tierInfo.color}>
                              {tierInfo.displayName} {user.subLevel}
                            </span>
                          </div>
                        </div>
                        <span className="font-bold text-gray-800">
                          {user.totalPoints.toLocaleString()} {t('ranking.points')}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}