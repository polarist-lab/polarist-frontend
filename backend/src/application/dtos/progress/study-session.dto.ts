import { IsOptional, IsObject, IsNumber, Min } from 'class-validator';

export class StartStudySessionDto {
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class EndStudySessionDto {
  @IsNumber()
  @Min(0)
  duration: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class StudySessionResponseDto {
  id?: number;
  sessionId: string;
  userId: number;
  wordsStudied: number;
  correctAnswers: number;
  totalAttempts: number;
  accuracy: number;
  duration?: number;
  durationInMinutes: number;
  metadata?: Record<string, any>;
  isActive: boolean;
  startTime: string;
  endTime?: string;
  createdAt: string;

  static fromEntity(session: any): StudySessionResponseDto {
    return {
      id: session.id,
      sessionId: session.sessionId,
      userId: session.userId,
      wordsStudied: session.wordsStudied,
      correctAnswers: session.correctAnswers,
      totalAttempts: session.totalAttempts,
      accuracy: session.getAccuracy ? session.getAccuracy() : 0,
      duration: session.duration,
      durationInMinutes: session.getDurationInMinutes ? session.getDurationInMinutes() : 0,
      metadata: session.metadata,
      isActive: session.isActive ? session.isActive() : false,
      startTime: session.startTime.toISOString(),
      endTime: session.endTime?.toISOString(),
      createdAt: session.createdAt.toISOString(),
    };
  }
}