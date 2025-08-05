import { Wordbook } from '../entities/wordbook.entity';

export interface WordbookRepository {
  findById(id: number): Promise<Wordbook | null>;
  findByUserId(userId: number): Promise<Wordbook[]>;
  findByShareCode(shareCode: string): Promise<Wordbook | null>;
  findPublicWordbooks(limit?: number, offset?: number): Promise<Wordbook[]>;
  save(wordbook: Wordbook): Promise<Wordbook>;
  update(wordbook: Wordbook): Promise<Wordbook>;
  delete(id: number): Promise<void>;
  exists(id: number): Promise<boolean>;
  
  // Search and filtering
  findByTags(tags: string[], limit?: number): Promise<Wordbook[]>;
  findByCategory(category: string, limit?: number): Promise<Wordbook[]>;
  search(query: string, limit?: number): Promise<Wordbook[]>;
}

export const WORDBOOK_REPOSITORY = Symbol('WORDBOOK_REPOSITORY');