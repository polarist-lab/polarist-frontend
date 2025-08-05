import { Injectable, Inject } from '@nestjs/common';
import { ProgressRepository, PROGRESS_REPOSITORY } from '../../../domain/repositories/progress.repository.interface';
import { StudyStatsResponseDto } from '../../dtos/progress/study-stats.dto';

@Injectable()
export class GetStudyStatsUseCase {
  constructor(
    @Inject(PROGRESS_REPOSITORY)
    private readonly progressRepository: ProgressRepository,
  ) {}

  async execute(userId: number): Promise<StudyStatsResponseDto> {
    const [stats, progressList] = await Promise.all([
      this.progressRepository.getUserStats(userId),
      this.progressRepository.findUserProgress(userId),
    ]);

    return StudyStatsResponseDto.fromData(stats, progressList);
  }
}