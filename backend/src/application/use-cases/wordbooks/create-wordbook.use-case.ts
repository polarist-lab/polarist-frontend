import { Injectable, Inject } from '@nestjs/common';
import { Wordbook } from '../../../domain/entities/wordbook.entity';
import { WordbookRepository, WORDBOOK_REPOSITORY } from '../../../domain/repositories/wordbook.repository.interface';
import { WordbookValidationService } from '../../../domain/services/wordbook-validation.service';
import { CreateWordbookDto } from '../../dtos/wordbooks/create-wordbook.dto';
import { WordbookResponseDto } from '../../dtos/wordbooks/wordbook-response.dto';

@Injectable()
export class CreateWordbookUseCase {
  constructor(
    @Inject(WORDBOOK_REPOSITORY)
    private readonly wordbookRepository: WordbookRepository,
    private readonly wordbookValidationService: WordbookValidationService,
  ) {}

  async execute(userId: number, dto: CreateWordbookDto): Promise<WordbookResponseDto> {
    // Validate wordbook data
    this.wordbookValidationService.validateWordbookSize(dto.wordIds);

    // Create wordbook entity
    const wordbook = Wordbook.create({
      userId,
      name: dto.name,
      description: dto.description,
      wordIds: dto.wordIds,
      categories: dto.categories,
      difficulties: dto.difficulties,
      tags: dto.tags,
      isPublic: dto.isPublic,
    });

    // Validate the created wordbook
    this.wordbookValidationService.validateWordbook(wordbook);

    // Save wordbook
    const savedWordbook = await this.wordbookRepository.save(wordbook);
    return WordbookResponseDto.fromEntity(savedWordbook, userId);
  }
}