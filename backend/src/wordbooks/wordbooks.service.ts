import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { customWordbooks } from '../database/schema';

export interface CreateWordbookDto {
  name: string;
  description?: string;
  wordIds: number[];
  categories?: string[];
  difficulties?: string[];
  tags?: string[];
  isPublic?: boolean;
}

export interface UpdateWordbookDto {
  name?: string;
  description?: string;
  wordIds?: number[];
  categories?: string[];
  difficulties?: string[];
  tags?: string[];
  isPublic?: boolean;
}

@Injectable()
export class WordbooksService {
  constructor(private databaseService: DatabaseService) {}

  async createWordbook(userId: number, createDto: CreateWordbookDto) {
    const shareCode = this.generateShareCode();
    
    const wordbook = await this.databaseService.db.insert(customWordbooks).values({
      userId,
      name: createDto.name,
      description: createDto.description || '',
      wordIds: JSON.stringify(createDto.wordIds),
      categories: JSON.stringify(createDto.categories || []),
      difficulties: JSON.stringify(createDto.difficulties || []),
      tags: JSON.stringify(createDto.tags || []),
      isPublic: createDto.isPublic || false,
      shareCode,
      totalWords: createDto.wordIds.length,
    }).returning();

    return wordbook[0];
  }

  async getUserWordbooks(userId: number) {
    const wordbooks = await this.databaseService.db
      .select()
      .from(customWordbooks)
      .where(eq(customWordbooks.userId, userId));

    return wordbooks.map(wb => ({
      ...wb,
      wordIds: JSON.parse(wb.wordIds),
      categories: JSON.parse(wb.categories || '[]'),
      difficulties: JSON.parse(wb.difficulties || '[]'),
      tags: JSON.parse(wb.tags || '[]'),
    }));
  }

  async getWordbookById(id: number, userId?: number) {
    const wordbook = await this.databaseService.db
      .select()
      .from(customWordbooks)
      .where(eq(customWordbooks.id, id))
      .limit(1);

    if (!wordbook[0]) {
      throw new Error('Wordbook not found');
    }

    // Check if user can access this wordbook
    if (!wordbook[0].isPublic && userId && wordbook[0].userId !== userId) {
      throw new Error('Access denied');
    }

    return {
      ...wordbook[0],
      wordIds: JSON.parse(wordbook[0].wordIds),
      categories: JSON.parse(wordbook[0].categories || '[]'),
      difficulties: JSON.parse(wordbook[0].difficulties || '[]'),
      tags: JSON.parse(wordbook[0].tags || '[]'),
    };
  }

  async getWordbookByShareCode(shareCode: string) {
    const wordbook = await this.databaseService.db
      .select()
      .from(customWordbooks)
      .where(eq(customWordbooks.shareCode, shareCode))
      .limit(1);

    if (!wordbook[0]) {
      throw new Error('Shared wordbook not found');
    }

    return {
      ...wordbook[0],
      wordIds: JSON.parse(wordbook[0].wordIds),
      categories: JSON.parse(wordbook[0].categories || '[]'),
      difficulties: JSON.parse(wordbook[0].difficulties || '[]'),
      tags: JSON.parse(wordbook[0].tags || '[]'),
    };
  }

  async updateWordbook(id: number, userId: number, updateDto: UpdateWordbookDto) {
    // Check ownership
    const existing = await this.getWordbookById(id, userId);
    if (existing.userId !== userId) {
      throw new Error('Not authorized to update this wordbook');
    }

    const updateData: any = {};
    
    if (updateDto.name) updateData.name = updateDto.name;
    if (updateDto.description !== undefined) updateData.description = updateDto.description;
    if (updateDto.wordIds) {
      updateData.wordIds = JSON.stringify(updateDto.wordIds);
      updateData.totalWords = updateDto.wordIds.length;
    }
    if (updateDto.categories) updateData.categories = JSON.stringify(updateDto.categories);
    if (updateDto.difficulties) updateData.difficulties = JSON.stringify(updateDto.difficulties);
    if (updateDto.tags) updateData.tags = JSON.stringify(updateDto.tags);
    if (updateDto.isPublic !== undefined) updateData.isPublic = updateDto.isPublic;
    
    updateData.updatedAt = new Date();

    const result = await this.databaseService.db
      .update(customWordbooks)
      .set(updateData)
      .where(eq(customWordbooks.id, id))
      .returning();

    return result[0];
  }

  async deleteWordbook(id: number, userId: number) {
    // Check ownership
    const existing = await this.getWordbookById(id, userId);
    if (existing.userId !== userId) {
      throw new Error('Not authorized to delete this wordbook');
    }

    await this.databaseService.db
      .delete(customWordbooks)
      .where(eq(customWordbooks.id, id));

    return { success: true };
  }

  async incrementStudyCount(id: number) {
    // First get current count
    const current = await this.databaseService.db
      .select({ studyCount: customWordbooks.studyCount })
      .from(customWordbooks)
      .where(eq(customWordbooks.id, id))
      .limit(1);
    
    if (current[0]) {
      await this.databaseService.db
        .update(customWordbooks)
        .set({ 
          studyCount: (current[0].studyCount || 0) + 1,
          updatedAt: new Date()
        })
        .where(eq(customWordbooks.id, id));
    }
  }

  async getPublicWordbooks(limit = 20) {
    const wordbooks = await this.databaseService.db
      .select()
      .from(customWordbooks)
      .where(eq(customWordbooks.isPublic, true))
      .limit(limit);

    return wordbooks.map(wb => ({
      ...wb,
      wordIds: JSON.parse(wb.wordIds),
      categories: JSON.parse(wb.categories || '[]'),
      difficulties: JSON.parse(wb.difficulties || '[]'),
      tags: JSON.parse(wb.tags || '[]'),
    }));
  }

  private generateShareCode(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}