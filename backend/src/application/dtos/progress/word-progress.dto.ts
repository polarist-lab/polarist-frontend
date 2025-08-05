import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class UpdateWordProgressDto {
  @IsString()
  @IsNotEmpty()
  wordId: string;

  @IsBoolean()
  isCorrect: boolean;
}

export class WordProgressResponseDto {
  wordId: string;
  isLearned: boolean;
  attempts: number;
  correctAnswers: number;
  confidence: number;
  accuracy: number;
  lastStudied?: string;
  isReadyForReview: boolean;

  static fromEntity(progress: any): WordProgressResponseDto {
    const accuracy = progress.attempts > 0 ? progress.correctAnswers / progress.attempts : 0;
    
    return {
      wordId: typeof progress.wordId === 'string' ? progress.wordId : progress.wordId.value,
      isLearned: progress.isLearned,
      attempts: progress.attempts,
      correctAnswers: progress.correctAnswers,
      confidence: typeof progress.confidence === 'number' ? progress.confidence : progress.confidence.value,
      accuracy: Math.round(accuracy * 100) / 100,
      lastStudied: progress.lastStudied?.toISOString(),
      isReadyForReview: progress.isReadyForReview ? progress.isReadyForReview() : false,
    };
  }
}

export class ResetWordProgressDto {
  @IsString()
  @IsNotEmpty()
  wordId: string;
}