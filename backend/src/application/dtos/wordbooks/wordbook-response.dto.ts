export class WordbookResponseDto {
  id?: number;
  userId: number;
  name: string;
  description?: string;
  wordIds: string[];
  categories: string[];
  difficulties: string[];
  tags: string[];
  isPublic: boolean;
  isShared: boolean;
  shareCode?: string;
  totalWords: number;
  studyCount: number;
  canEdit: boolean;
  createdAt: string;
  updatedAt: string;

  static fromEntity(wordbook: any, currentUserId?: number): WordbookResponseDto {
    return {
      id: wordbook.id,
      userId: wordbook.userId,
      name: wordbook.name,
      description: wordbook.description,
      wordIds: Array.isArray(wordbook.wordIds) ? wordbook.wordIds : [],
      categories: Array.isArray(wordbook.categories) ? wordbook.categories : [],
      difficulties: Array.isArray(wordbook.difficulties) ? wordbook.difficulties : [],
      tags: Array.isArray(wordbook.tags) ? wordbook.tags : [],
      isPublic: wordbook.isPublic,
      isShared: wordbook.isShared,
      shareCode: wordbook.shareCode,
      totalWords: wordbook.totalWords,
      studyCount: wordbook.studyCount,
      canEdit: currentUserId ? wordbook.isOwnedBy(currentUserId) : false,
      createdAt: wordbook.createdAt.toISOString(),
      updatedAt: wordbook.updatedAt.toISOString(),
    };
  }
}

export class WordbookListResponseDto {
  wordbooks: WordbookResponseDto[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;

  static fromPaginatedData(
    wordbooks: any[], 
    total: number, 
    page: number, 
    limit: number,
    currentUserId?: number
  ): WordbookListResponseDto {
    return {
      wordbooks: wordbooks.map(wb => WordbookResponseDto.fromEntity(wb, currentUserId)),
      total,
      page,
      limit,
      hasNext: (page * limit) < total,
      hasPrev: page > 1,
    };
  }
}