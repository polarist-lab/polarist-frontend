import { Injectable, Inject } from '@nestjs/common';
import { StudySession } from '../../../domain/entities/study-session.entity';
import { ProgressRepository, PROGRESS_REPOSITORY } from '../../../domain/repositories/progress.repository.interface';
import { StartStudySessionDto } from '../../dtos/progress/study-session.dto';
import { StudySessionResponseDto } from '../../dtos/progress/study-session.dto';
import { ApplicationException } from '../../../shared/exceptions/application.exception';

@Injectable()
export class StartStudySessionUseCase {
  constructor(
    @Inject(PROGRESS_REPOSITORY)
    private readonly progressRepository: ProgressRepository,
  ) {}

  async execute(userId: number, dto: StartStudySessionDto): Promise<StudySessionResponseDto> {
    // Check if there's already an active session
    const activeSession = await this.progressRepository.findActiveSession(userId);
    if (activeSession) {
      throw new ApplicationException('Active study session already exists');
    }

    // Create new session
    const sessionId = StudySession.generateSessionId(userId);
    const session = StudySession.create({
      userId,
      sessionId,
      metadata: dto.metadata,
    });

    const savedSession = await this.progressRepository.saveStudySession(session);
    return StudySessionResponseDto.fromEntity(savedSession);
  }
}