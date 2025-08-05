import { Injectable, Inject } from '@nestjs/common';
import { WordProgress } from '../../../domain/entities/word-progress.entity';
import { ProgressRepository, PROGRESS_REPOSITORY } from '../../../domain/repositories/progress.repository.interface';
import { UpdateWordProgressDto } from '../../dtos/progress/word-progress.dto';
import { WordProgressResponseDto } from '../../dtos/progress/word-progress.dto';
import { WordId } from '../../../domain/value-objects/word-id.vo';

@Injectable()
export class UpdateWordProgressUseCase {
  constructor(
    @Inject(PROGRESS_REPOSITORY)
    private readonly progressRepository: ProgressRepository,
  ) {}

  async execute(userId: number, dto: UpdateWordProgressDto): Promise<WordProgressResponseDto> {
    const wordId = WordId.from(dto.wordId);
    
    let progress = await this.progressRepository.findWordProgress(userId, wordId);
    
    if (!progress) {
      // Create new progress entry
      progress = WordProgress.create({
        userId,
        wordId: dto.wordId,
      });
    }

    // Record the attempt
    progress.recordAttempt(dto.isCorrect);

    // Save the updated progress
    const savedProgress = progress.id 
      ? await this.progressRepository.updateWordProgress(progress)
      : await this.progressRepository.saveWordProgress(progress);

    return WordProgressResponseDto.fromEntity(savedProgress);
  }
}