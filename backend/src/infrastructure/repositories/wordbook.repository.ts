import { Injectable } from '@nestjs/common';
import { eq, like, and } from 'drizzle-orm';
import { Wordbook } from '../../domain/entities/wordbook.entity';
import { WordbookRepository } from '../../domain/repositories/wordbook.repository.interface';
import { DatabaseService } from '../database/database.service';
import { customWordbooks } from '../database/drizzle/schema';
import { DatabaseException } from '../../shared/exceptions/infrastructure.exception';
import { EntityNotFoundDomainException } from '../../shared/exceptions/domain.exception';

@Injectable()
export class DrizzleWordbookRepository implements WordbookRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findById(id: number): Promise<Wordbook | null> {
    try {
      const result = await this.databaseService.db
        .select()
        .from(customWordbooks)
        .where(eq(customWordbooks.id, id))
        .limit(1);

      return result[0] ? this.toDomainEntity(result[0]) : null;
    } catch (error) {
      throw new DatabaseException('findById', error as Error);
    }
  }

  async findByUserId(userId: number): Promise<Wordbook[]> {
    try {
      const results = await this.databaseService.db
        .select()
        .from(customWordbooks)
        .where(eq(customWordbooks.userId, userId));

      return results.map(record => this.toDomainEntity(record));
    } catch (error) {
      throw new DatabaseException('findByUserId', error as Error);
    }
  }

  async findByShareCode(shareCode: string): Promise<Wordbook | null> {
    try {
      const result = await this.databaseService.db
        .select()
        .from(customWordbooks)
        .where(eq(customWordbooks.shareCode, shareCode))
        .limit(1);

      return result[0] ? this.toDomainEntity(result[0]) : null;
    } catch (error) {
      throw new DatabaseException('findByShareCode', error as Error);
    }
  }

  async findPublicWordbooks(limit = 20, offset = 0): Promise<Wordbook[]> {
    try {
      const results = await this.databaseService.db
        .select()
        .from(customWordbooks)
        .where(eq(customWordbooks.isPublic, true))
        .limit(limit)
        .offset(offset);

      return results.map(record => this.toDomainEntity(record));
    } catch (error) {
      throw new DatabaseException('findPublicWordbooks', error as Error);
    }
  }

  async save(wordbook: Wordbook): Promise<Wordbook> {
    try {
      const wordbookData = this.toDbRecord(wordbook);
      const result = await this.databaseService.db
        .insert(customWordbooks)
        .values(wordbookData)
        .returning();

      return this.toDomainEntity(result[0]);
    } catch (error) {
      throw new DatabaseException('save', error as Error);
    }
  }

  async update(wordbook: Wordbook): Promise<Wordbook> {
    if (!wordbook.id) {
      throw new EntityNotFoundDomainException('Wordbook', 'undefined');
    }

    try {
      const wordbookData = this.toDbRecord(wordbook);
      const result = await this.databaseService.db
        .update(customWordbooks)
        .set({ ...wordbookData, updatedAt: new Date() })
        .where(eq(customWordbooks.id, wordbook.id))
        .returning();

      if (result.length === 0) {
        throw new EntityNotFoundDomainException('Wordbook', wordbook.id);
      }

      return this.toDomainEntity(result[0]);
    } catch (error) {
      if (error instanceof EntityNotFoundDomainException) {
        throw error;
      }
      throw new DatabaseException('update', error as Error);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const result = await this.databaseService.db
        .delete(customWordbooks)
        .where(eq(customWordbooks.id, id))
        .returning({ id: customWordbooks.id });

      if (result.length === 0) {
        throw new EntityNotFoundDomainException('Wordbook', id);
      }
    } catch (error) {
      if (error instanceof EntityNotFoundDomainException) {
        throw error;
      }
      throw new DatabaseException('delete', error as Error);
    }
  }

  async exists(id: number): Promise<boolean> {
    try {
      const result = await this.databaseService.db
        .select({ id: customWordbooks.id })
        .from(customWordbooks)
        .where(eq(customWordbooks.id, id))
        .limit(1);

      return result.length > 0;
    } catch (error) {
      throw new DatabaseException('exists', error as Error);
    }
  }

  async findByTags(tags: string[], limit = 20): Promise<Wordbook[]> {
    try {
      // Note: This is a simplified implementation
      // In a real scenario, you'd want to implement proper JSON querying
      const results = await this.databaseService.db
        .select()
        .from(customWordbooks)
        .where(eq(customWordbooks.isPublic, true))
        .limit(limit);

      return results
        .map(record => this.toDomainEntity(record))
        .filter(wordbook => {
          return tags.some(tag => wordbook.tags.includes(tag.toLowerCase()));
        });
    } catch (error) {
      throw new DatabaseException('findByTags', error as Error);
    }
  }

  async findByCategory(category: string, limit = 20): Promise<Wordbook[]> {
    try {
      const results = await this.databaseService.db
        .select()
        .from(customWordbooks)
        .where(eq(customWordbooks.isPublic, true))
        .limit(limit);

      return results
        .map(record => this.toDomainEntity(record))
        .filter(wordbook => wordbook.categories.includes(category));
    } catch (error) {
      throw new DatabaseException('findByCategory', error as Error);
    }
  }

  async search(query: string, limit = 20): Promise<Wordbook[]> {
    try {
      const results = await this.databaseService.db
        .select()
        .from(customWordbooks)
        .where(
          and(
            eq(customWordbooks.isPublic, true),
            like(customWordbooks.name, `%${query}%`)
          )
        )
        .limit(limit);

      return results.map(record => this.toDomainEntity(record));
    } catch (error) {
      throw new DatabaseException('search', error as Error);
    }
  }

  private toDomainEntity(dbRecord: any): Wordbook {
    return new Wordbook({
      id: dbRecord.id,
      userId: dbRecord.userId,
      name: dbRecord.name,
      description: dbRecord.description,
      wordIds: JSON.parse(dbRecord.wordIds || '[]'),
      categories: JSON.parse(dbRecord.categories || '[]'),
      difficulties: JSON.parse(dbRecord.difficulties || '[]'),
      tags: JSON.parse(dbRecord.tags || '[]'),
      isPublic: dbRecord.isPublic,
      isShared: dbRecord.isShared,
      shareCode: dbRecord.shareCode,
      totalWords: dbRecord.totalWords,
      studyCount: dbRecord.studyCount,
      createdAt: dbRecord.createdAt,
      updatedAt: dbRecord.updatedAt,
    });
  }

  private toDbRecord(wordbook: Wordbook): any {
    return {
      id: wordbook.id,
      userId: wordbook.userId,
      name: wordbook.name,
      description: wordbook.description,
      wordIds: JSON.stringify(wordbook.wordIds),
      categories: JSON.stringify(wordbook.categories),
      difficulties: JSON.stringify(wordbook.difficulties),
      tags: JSON.stringify(wordbook.tags),
      isPublic: wordbook.isPublic,
      isShared: wordbook.isShared,
      shareCode: wordbook.shareCode,
      totalWords: wordbook.totalWords,
      studyCount: wordbook.studyCount,
      createdAt: wordbook.createdAt,
      updatedAt: wordbook.updatedAt,
    };
  }
}