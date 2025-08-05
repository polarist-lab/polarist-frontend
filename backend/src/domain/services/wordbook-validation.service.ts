import { Injectable } from '@nestjs/common';
import { Wordbook } from '../entities/wordbook.entity';
import { InvalidDomainDataException } from '../../shared/exceptions/domain.exception';

@Injectable()
export class WordbookValidationService {
  validateWordbook(wordbook: Wordbook): void {
    this.validateWordIds(wordbook.wordIds);
    this.validateTags(wordbook.tags);
    this.validateCategories(wordbook.categories);
  }

  validateWordbookSize(wordIds: string[]): void {
    const MAX_WORDS = 1000;
    const MIN_WORDS = 1;
    
    if (wordIds.length < MIN_WORDS) {
      throw new InvalidDomainDataException(
        'wordIds',
        wordIds.length,
        `Wordbook must contain at least ${MIN_WORDS} word`
      );
    }
    
    if (wordIds.length > MAX_WORDS) {
      throw new InvalidDomainDataException(
        'wordIds',
        wordIds.length,
        `Wordbook cannot contain more than ${MAX_WORDS} words`
      );
    }
  }

  validateShareCode(shareCode: string): void {
    const SHARE_CODE_PATTERN = /^[a-zA-Z0-9]{10,30}$/;
    
    if (!SHARE_CODE_PATTERN.test(shareCode)) {
      throw new InvalidDomainDataException(
        'shareCode',
        shareCode,
        'Share code must be alphanumeric and 10-30 characters long'
      );
    }
  }

  private validateWordIds(wordIds: string[]): void {
    if (new Set(wordIds).size !== wordIds.length) {
      throw new InvalidDomainDataException(
        'wordIds',
        wordIds,
        'Duplicate word IDs are not allowed'
      );
    }

    wordIds.forEach(wordId => {
      if (!wordId || wordId.trim().length === 0) {
        throw new InvalidDomainDataException(
          'wordId',
          wordId,
          'Word ID cannot be empty'
        );
      }
    });
  }

  private validateTags(tags: string[]): void {
    const MAX_TAGS = 10;
    const MAX_TAG_LENGTH = 20;
    
    if (tags.length > MAX_TAGS) {
      throw new InvalidDomainDataException(
        'tags',
        tags.length,
        `Maximum ${MAX_TAGS} tags allowed`
      );
    }
    
    tags.forEach(tag => {
      if (tag.length > MAX_TAG_LENGTH) {
        throw new InvalidDomainDataException(
          'tag',
          tag,
          `Tag cannot be longer than ${MAX_TAG_LENGTH} characters`
        );
      }
    });
  }

  private validateCategories(categories: string[]): void {
    const ALLOWED_CATEGORIES = [
      'beginner', 'intermediate', 'advanced',
      'daily-life', 'business', 'academic',
      'grammar', 'vocabulary', 'conversation'
    ];
    
    categories.forEach(category => {
      if (!ALLOWED_CATEGORIES.includes(category)) {
        throw new InvalidDomainDataException(
          'category',
          category,
          `Invalid category. Allowed categories: ${ALLOWED_CATEGORIES.join(', ')}`
        );
      }
    });
  }
}