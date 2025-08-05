import { Injectable } from '@nestjs/common';
import { WordProgress } from '../entities/word-progress.entity';
import { ConfidenceLevel } from '../value-objects/confidence-level.vo';

@Injectable()
export class ProgressCalculationService {
  calculateNextReviewDate(progress: WordProgress): Date {
    const confidenceLevel = progress.confidence.value;
    const reviewIntervals = [1, 2, 4, 7, 14, 30]; // days
    
    const intervalDays = reviewIntervals[confidenceLevel] || 1;
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + intervalDays);
    
    return nextReview;
  }

  calculateLearningVelocity(progressList: WordProgress[]): number {
    if (progressList.length === 0) return 0;
    
    const learnedWords = progressList.filter(p => p.isLearned).length;
    const totalWords = progressList.length;
    
    return learnedWords / totalWords;
  }

  calculateOptimalBatchSize(userAccuracy: number): number {
    // Adaptive batch size based on user performance
    if (userAccuracy >= 0.9) return 25;
    if (userAccuracy >= 0.8) return 20;
    if (userAccuracy >= 0.7) return 15;
    if (userAccuracy >= 0.6) return 12;
    return 10;
  }

  identifyWeakWords(progressList: WordProgress[]): WordProgress[] {
    return progressList.filter(progress => {
      const accuracy = progress.getAccuracy();
      return accuracy < 0.6 && progress.attempts >= 3;
    });
  }

  calculateConfidenceDistribution(progressList: WordProgress[]): Record<number, number> {
    const distribution: Record<number, number> = {
      0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };
    
    progressList.forEach(progress => {
      const level = progress.confidence.value;
      distribution[level]++;
    });
    
    return distribution;
  }

  predictCompletionTime(progressList: WordProgress[], studyHoursPerDay: number): number {
    const unlearned = progressList.filter(p => !p.isLearned);
    const averageReviewsNeeded = 5; // empirical average
    const wordsPerHour = 30; // empirical average
    
    const totalReviewsNeeded = unlearned.length * averageReviewsNeeded;
    const hoursNeeded = totalReviewsNeeded / wordsPerHour;
    
    return Math.ceil(hoursNeeded / studyHoursPerDay);
  }
}