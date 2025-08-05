import { InvalidDomainDataException } from '../../shared/exceptions/domain.exception';

export interface WordbookProps {
  id?: number;
  userId: number;
  name: string;
  description?: string;
  wordIds: string[];
  categories?: string[];
  difficulties?: string[];
  tags?: string[];
  isPublic?: boolean;
  isShared?: boolean;
  shareCode?: string;
  totalWords?: number;
  studyCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Wordbook {
  private _id?: number;
  private _userId: number;
  private _name: string;
  private _description?: string;
  private _wordIds: string[];
  private _categories: string[];
  private _difficulties: string[];
  private _tags: string[];
  private _isPublic: boolean;
  private _isShared: boolean;
  private _shareCode?: string;
  private _totalWords: number;
  private _studyCount: number;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: WordbookProps) {
    this.validateProps(props);
    
    this._id = props.id;
    this._userId = props.userId;
    this._name = props.name.trim();
    this._description = props.description?.trim();
    this._wordIds = [...props.wordIds];
    this._categories = props.categories || [];
    this._difficulties = props.difficulties || [];
    this._tags = props.tags || [];
    this._isPublic = props.isPublic || false;
    this._isShared = props.isShared || false;
    this._shareCode = props.shareCode;
    this._totalWords = props.totalWords || props.wordIds.length;
    this._studyCount = props.studyCount || 0;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  // Getters
  get id(): number | undefined {
    return this._id;
  }

  get userId(): number {
    return this._userId;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | undefined {
    return this._description;
  }

  get wordIds(): string[] {
    return [...this._wordIds];
  }

  get categories(): string[] {
    return [...this._categories];
  }

  get difficulties(): string[] {
    return [...this._difficulties];
  }

  get tags(): string[] {
    return [...this._tags];
  }

  get isPublic(): boolean {
    return this._isPublic;
  }

  get isShared(): boolean {
    return this._isShared;
  }

  get shareCode(): string | undefined {
    return this._shareCode;
  }

  get totalWords(): number {
    return this._totalWords;
  }

  get studyCount(): number {
    return this._studyCount;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business methods
  updateBasicInfo(name: string, description?: string): void {
    if (!name || name.trim().length === 0) {
      throw new InvalidDomainDataException('name', name, 'Wordbook name cannot be empty');
    }
    
    if (name.length > 100) {
      throw new InvalidDomainDataException('name', name, 'Wordbook name too long');
    }
    
    this._name = name.trim();
    this._description = description?.trim();
    this._updatedAt = new Date();
  }

  addWords(wordIds: string[]): void {
    if (!wordIds || wordIds.length === 0) {
      throw new InvalidDomainDataException('wordIds', wordIds, 'Word IDs cannot be empty');
    }
    
    const uniqueWordIds = [...new Set([...this._wordIds, ...wordIds])];
    this._wordIds = uniqueWordIds;
    this._totalWords = uniqueWordIds.length;
    this._updatedAt = new Date();
  }

  removeWords(wordIds: string[]): void {
    this._wordIds = this._wordIds.filter(id => !wordIds.includes(id));
    this._totalWords = this._wordIds.length;
    this._updatedAt = new Date();
  }

  updateWordIds(wordIds: string[]): void {
    if (!wordIds || wordIds.length === 0) {
      throw new InvalidDomainDataException('wordIds', wordIds, 'Wordbook must contain at least one word');
    }
    
    this._wordIds = [...new Set(wordIds)];
    this._totalWords = this._wordIds.length;
    this._updatedAt = new Date();
  }

  addTags(tags: string[]): void {
    const sanitizedTags = tags.map(tag => tag.trim().toLowerCase()).filter(tag => tag.length > 0);
    this._tags = [...new Set([...this._tags, ...sanitizedTags])];
    this._updatedAt = new Date();
  }

  removeTags(tags: string[]): void {
    const lowercaseTags = tags.map(tag => tag.toLowerCase());
    this._tags = this._tags.filter(tag => !lowercaseTags.includes(tag.toLowerCase()));
    this._updatedAt = new Date();
  }

  makePublic(): void {
    this._isPublic = true;
    this._updatedAt = new Date();
  }

  makePrivate(): void {
    this._isPublic = false;
    this._updatedAt = new Date();
  }

  enableSharing(shareCode: string): void {
    if (!shareCode || shareCode.trim().length === 0) {
      throw new InvalidDomainDataException('shareCode', shareCode, 'Share code cannot be empty');
    }
    
    this._isShared = true;
    this._shareCode = shareCode.trim();
    this._updatedAt = new Date();
  }

  disableSharing(): void {
    this._isShared = false;
    this._shareCode = undefined;
    this._updatedAt = new Date();
  }

  incrementStudyCount(): void {
    this._studyCount++;
    this._updatedAt = new Date();
  }

  canBeAccessedBy(userId: number): boolean {
    return this._userId === userId || this._isPublic || this._isShared;
  }

  isOwnedBy(userId: number): boolean {
    return this._userId === userId;
  }

  setId(id: number): void {
    if (this._id !== undefined) {
      throw new InvalidDomainDataException('id', id, 'ID already set');
    }
    this._id = id;
  }

  private validateProps(props: WordbookProps): void {
    if (!props.userId || props.userId <= 0) {
      throw new InvalidDomainDataException('userId', props.userId, 'Valid user ID is required');
    }
    
    if (!props.name || props.name.trim().length === 0) {
      throw new InvalidDomainDataException('name', props.name, 'Wordbook name is required');
    }
    
    if (props.name.length > 100) {
      throw new InvalidDomainDataException('name', props.name, 'Wordbook name too long');
    }
    
    if (!props.wordIds || props.wordIds.length === 0) {
      throw new InvalidDomainDataException('wordIds', props.wordIds, 'Wordbook must contain at least one word');
    }
    
    if (props.studyCount !== undefined && props.studyCount < 0) {
      throw new InvalidDomainDataException('studyCount', props.studyCount, 'Study count cannot be negative');
    }
  }

  static create(props: Omit<WordbookProps, 'id' | 'createdAt' | 'updatedAt'>): Wordbook {
    return new Wordbook(props);
  }

  static generateShareCode(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}