export class StudyStatsResponseDto {
  totalWordsStudied: number;
  totalSessions: number;
  averageAccuracy: number;
  totalStudyTime: number;
  totalStudyTimeInHours: number;
  streak: number;
  learnedWordsCount: number;
  confidenceDistribution: Record<number, number>;
  weeklyProgress: Array<{
    date: string;
    wordsStudied: number;
    accuracy: number;
  }>;

  static fromData(stats: any, progressList?: any[]): StudyStatsResponseDto {
    const confidenceDistribution = progressList 
      ? this.calculateConfidenceDistribution(progressList)
      : { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    return {
      totalWordsStudied: stats.totalWordsStudied || 0,
      totalSessions: stats.totalSessions || 0,
      averageAccuracy: Math.round((stats.averageAccuracy || 0) * 100) / 100,
      totalStudyTime: stats.totalStudyTime || 0,
      totalStudyTimeInHours: Math.round((stats.totalStudyTime || 0) / 3600 * 100) / 100,
      streak: stats.streak || 0,
      learnedWordsCount: progressList ? progressList.filter(p => p.isLearned).length : 0,
      confidenceDistribution,
      weeklyProgress: [], // TODO: Implement weekly progress calculation
    };
  }

  private static calculateConfidenceDistribution(progressList: any[]): Record<number, number> {
    const distribution: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    progressList.forEach(progress => {
      const level = typeof progress.confidence === 'number' 
        ? progress.confidence 
        : progress.confidence.value;
      distribution[level]++;
    });
    
    return distribution;
  }
}