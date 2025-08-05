import { Injectable, Inject } from '@nestjs/common';
import { ProgressRepository, PROGRESS_REPOSITORY } from '../../../domain/repositories/progress.repository.interface';
import { WordProgressResponseDto } from '../../dtos/progress/word-progress.dto';

@Injectable()
export class GetUserProgressUseCase {
  constructor(
    @Inject(PROGRESS_REPOSITORY)
    private readonly progressRepository: ProgressRepository,
  ) {}

  async execute(userId: number): Promise<WordProgressResponseDto[]> {
    const progressList = await this.progressRepository.findUserProgress(userId);
    return progressList.map(progress => WordProgressResponseDto.fromEntity(progress));
  }
}