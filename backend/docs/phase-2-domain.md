# Phase 2: Domain Layer (도메인 계층)

## 목표
비즈니스 로직의 핵심인 도메인 엔티티, 값 객체, 리포지토리 인터페이스를 구현하여 Clean Architecture의 중심부를 구축합니다.

## 범위
- Domain Entity 구현 (User, WordProgress, StudySession, Wordbook)
- Value Object 구현 (Email, WordId, ConfidenceLevel)
- Repository Interface 정의
- Domain Service 구현

## 도메인 분석

### 핵심 도메인 개념
1. **User**: 학습자 정보와 설정
2. **WordProgress**: 단어별 학습 진도
3. **StudySession**: 학습 세션 정보
4. **Wordbook**: 커스텀 단어장
5. **ConfidenceLevel**: 학습 신뢰도 (0-5)

## 구현할 파일 목록

### 1. Value Objects (`src/domain/value-objects/`)

#### `email.vo.ts`
```typescript
import { InvalidDomainDataException } from '../../shared/exceptions/domain.exception';

export class Email {
  private readonly _value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new InvalidDomainDataException('email', value, 'Invalid email format');
    }
    this._value = value.toLowerCase().trim();
  }

  get value(): string {
    return this._value;
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 255;
  }

  static from(value: string): Email {
    return new Email(value);
  }
}
```

#### `word-id.vo.ts`
```typescript
import { InvalidDomainDataException } from '../../shared/exceptions/domain.exception';

export class WordId {
  private readonly _value: string;

  constructor(value: string | number) {
    const stringValue = String(value).trim();
    if (!this.isValid(stringValue)) {
      throw new InvalidDomainDataException('wordId', value, 'Word ID must be non-empty string');
    }
    this._value = stringValue;
  }

  get value(): string {
    return this._value;
  }

  equals(other: WordId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  private isValid(value: string): boolean {
    return value.length > 0 && value.length <= 100;
  }

  static from(value: string | number): WordId {
    return new WordId(value);
  }
}
```

#### `confidence-level.vo.ts`
```typescript
import { InvalidDomainDataException } from '../../shared/exceptions/domain.exception';

export class ConfidenceLevel {
  private readonly _value: number;

  constructor(value: number) {
    if (!this.isValid(value)) {
      throw new InvalidDomainDataException(
        'confidenceLevel', 
        value, 
        'Confidence level must be between 0 and 5'
      );
    }
    this._value = Math.floor(value);
  }

  get value(): number {
    return this._value;
  }

  isLowConfidence(): boolean {
    return this._value <= 2;
  }

  isHighConfidence(): boolean {
    return this._value >= 4;
  }

  increment(): ConfidenceLevel {
    return new ConfidenceLevel(Math.min(5, this._value + 1));
  }

  decrement(): ConfidenceLevel {
    return new ConfidenceLevel(Math.max(0, this._value - 1));
  }

  equals(other: ConfidenceLevel): boolean {
    return this._value === other._value;
  }

  private isValid(value: number): boolean {
    return Number.isInteger(value) && value >= 0 && value <= 5;
  }

  static from(value: number): ConfidenceLevel {
    return new ConfidenceLevel(value);
  }

  static lowest(): ConfidenceLevel {
    return new ConfidenceLevel(0);
  }

  static highest(): ConfidenceLevel {
    return new ConfidenceLevel(5);
  }
}
```

### 2. Domain Entities (`src/domain/entities/`)

#### `user.entity.ts`
```typescript
import { Email } from '../value-objects/email.vo';
import { InvalidDomainDataException } from '../../shared/exceptions/domain.exception';

export interface UserProps {
  id?: number;
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
  locale?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private _id?: number;
  private _googleId: string;
  private _email: Email;
  private _name: string;
  private _avatar?: string;
  private _locale: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: UserProps) {
    this.validateProps(props);
    
    this._id = props.id;
    this._googleId = props.googleId;
    this._email = Email.from(props.email);
    this._name = props.name;
    this._avatar = props.avatar;
    this._locale = props.locale || 'en';
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  // Getters
  get id(): number | undefined {
    return this._id;
  }

  get googleId(): string {
    return this._googleId;
  }

  get email(): Email {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  get avatar(): string | undefined {
    return this._avatar;
  }

  get locale(): string {
    return this._locale;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business methods
  updateProfile(name: string, avatar?: string): void {
    if (!name || name.trim().length === 0) {
      throw new InvalidDomainDataException('name', name, 'Name cannot be empty');
    }
    
    this._name = name.trim();
    if (avatar !== undefined) {
      this._avatar = avatar;
    }
    this._updatedAt = new Date();
  }

  changeLocale(locale: string): void {
    const validLocales = ['en', 'ko', 'ja', 'zh', 'id', 'th', 'vi', 'ar', 'es', 'hi', 'pt'];
    if (!validLocales.includes(locale)) {
      throw new InvalidDomainDataException('locale', locale, 'Invalid locale');
    }
    
    this._locale = locale;
    this._updatedAt = new Date();
  }

  setId(id: number): void {
    if (this._id !== undefined) {
      throw new InvalidDomainDataException('id', id, 'ID already set');
    }
    this._id = id;
  }

  equals(other: User): boolean {
    return this._googleId === other._googleId;
  }

  private validateProps(props: UserProps): void {
    if (!props.googleId || props.googleId.trim().length === 0) {
      throw new InvalidDomainDataException('googleId', props.googleId, 'Google ID is required');
    }
    
    if (!props.name || props.name.trim().length === 0) {
      throw new InvalidDomainDataException('name', props.name, 'Name is required');
    }
    
    if (props.name.length > 100) {
      throw new InvalidDomainDataException('name', props.name, 'Name too long');
    }
  }

  static create(props: Omit<UserProps, 'id' | 'createdAt' | 'updatedAt'>): User {
    return new User(props);
  }
}
```

#### `word-progress.entity.ts`
```typescript
import { WordId } from '../value-objects/word-id.vo';
import { ConfidenceLevel } from '../value-objects/confidence-level.vo';
import { InvalidDomainDataException } from '../../shared/exceptions/domain.exception';

export interface WordProgressProps {
  id?: number;
  userId: number;
  wordId: string;
  isLearned?: boolean;
  attempts?: number;
  correctAnswers?: number;
  confidence?: number;
  lastStudied?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class WordProgress {
  private _id?: number;
  private _userId: number;
  private _wordId: WordId;
  private _isLearned: boolean;
  private _attempts: number;
  private _correctAnswers: number;
  private _confidence: ConfidenceLevel;
  private _lastStudied?: Date;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: WordProgressProps) {
    this.validateProps(props);
    
    this._id = props.id;
    this._userId = props.userId;
    this._wordId = WordId.from(props.wordId);
    this._isLearned = props.isLearned || false;
    this._attempts = props.attempts || 0;
    this._correctAnswers = props.correctAnswers || 0;
    this._confidence = ConfidenceLevel.from(props.confidence || 0);
    this._lastStudied = props.lastStudied;
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

  get wordId(): WordId {
    return this._wordId;
  }

  get isLearned(): boolean {
    return this._isLearned;
  }

  get attempts(): number {
    return this._attempts;
  }

  get correctAnswers(): number {
    return this._correctAnswers;
  }

  get confidence(): ConfidenceLevel {
    return this._confidence;
  }

  get lastStudied(): Date | undefined {
    return this._lastStudied;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business methods
  recordAttempt(isCorrect: boolean): void {
    this._attempts++;
    if (isCorrect) {
      this._correctAnswers++;
      this._confidence = this._confidence.increment();
    } else {
      this._confidence = this._confidence.decrement();
    }
    
    this._lastStudied = new Date();
    this._updatedAt = new Date();
    
    this.updateLearnedStatus();
  }

  getAccuracy(): number {
    return this._attempts === 0 ? 0 : this._correctAnswers / this._attempts;
  }

  isReadyForReview(): boolean {
    if (!this._lastStudied) return true;
    
    const daysSinceLastStudy = this.getDaysSince(this._lastStudied);
    const confidenceLevel = this._confidence.value;
    
    // Review intervals based on confidence level
    const reviewIntervals = [1, 2, 4, 7, 14, 30]; // days
    return daysSinceLastStudy >= reviewIntervals[confidenceLevel];
  }

  markAsLearned(): void {
    this._isLearned = true;
    this._updatedAt = new Date();
  }

  reset(): void {
    this._attempts = 0;
    this._correctAnswers = 0;
    this._confidence = ConfidenceLevel.lowest();
    this._isLearned = false;
    this._lastStudied = undefined;
    this._updatedAt = new Date();
  }

  setId(id: number): void {
    if (this._id !== undefined) {
      throw new InvalidDomainDataException('id', id, 'ID already set');
    }
    this._id = id;
  }

  private updateLearnedStatus(): void {
    const accuracy = this.getAccuracy();
    const hasMinimumAttempts = this._attempts >= 3;
    const hasHighAccuracy = accuracy >= 0.8;
    const hasHighConfidence = this._confidence.isHighConfidence();
    
    this._isLearned = hasMinimumAttempts && hasHighAccuracy && hasHighConfidence;
  }

  private getDaysSince(date: Date): number {
    const now = new Date();
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.floor((now.getTime() - date.getTime()) / msPerDay);
  }

  private validateProps(props: WordProgressProps): void {
    if (!props.userId || props.userId <= 0) {
      throw new InvalidDomainDataException('userId', props.userId, 'Valid user ID is required');
    }
    
    if (props.attempts !== undefined && props.attempts < 0) {
      throw new InvalidDomainDataException('attempts', props.attempts, 'Attempts cannot be negative');
    }
    
    if (props.correctAnswers !== undefined && props.correctAnswers < 0) {
      throw new InvalidDomainDataException('correctAnswers', props.correctAnswers, 'Correct answers cannot be negative');
    }
    
    if (props.attempts !== undefined && props.correctAnswers !== undefined && 
        props.correctAnswers > props.attempts) {
      throw new InvalidDomainDataException(
        'correctAnswers', 
        props.correctAnswers, 
        'Correct answers cannot exceed total attempts'
      );
    }
  }

  static create(props: Omit<WordProgressProps, 'id' | 'createdAt' | 'updatedAt'>): WordProgress {
    return new WordProgress(props);
  }
}
```

#### `study-session.entity.ts`
```typescript
import { InvalidDomainDataException } from '../../shared/exceptions/domain.exception';

export interface StudySessionProps {
  id?: number;
  userId: number;
  sessionId: string;
  wordsStudied?: number;
  correctAnswers?: number;
  totalAttempts?: number;
  duration?: number;
  metadata?: Record<string, any>;
  startTime?: Date;
  endTime?: Date;
  createdAt?: Date;
}

export class StudySession {
  private _id?: number;
  private _userId: number;
  private _sessionId: string;
  private _wordsStudied: number;
  private _correctAnswers: number;
  private _totalAttempts: number;
  private _duration?: number;
  private _metadata?: Record<string, any>;
  private _startTime: Date;
  private _endTime?: Date;
  private _createdAt: Date;

  constructor(props: StudySessionProps) {
    this.validateProps(props);
    
    this._id = props.id;
    this._userId = props.userId;
    this._sessionId = props.sessionId;
    this._wordsStudied = props.wordsStudied || 0;
    this._correctAnswers = props.correctAnswers || 0;
    this._totalAttempts = props.totalAttempts || 0;
    this._duration = props.duration;
    this._metadata = props.metadata;
    this._startTime = props.startTime || new Date();
    this._endTime = props.endTime;
    this._createdAt = props.createdAt || new Date();
  }

  // Getters
  get id(): number | undefined {
    return this._id;
  }

  get userId(): number {
    return this._userId;
  }

  get sessionId(): string {
    return this._sessionId;
  }

  get wordsStudied(): number {
    return this._wordsStudied;
  }

  get correctAnswers(): number {
    return this._correctAnswers;
  }

  get totalAttempts(): number {
    return this._totalAttempts;
  }

  get duration(): number | undefined {
    return this._duration;
  }

  get metadata(): Record<string, any> | undefined {
    return this._metadata;
  }

  get startTime(): Date {
    return this._startTime;
  }

  get endTime(): Date | undefined {
    return this._endTime;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  // Business methods
  recordWordStudy(isCorrect: boolean): void {
    this._wordsStudied++;
    this._totalAttempts++;
    if (isCorrect) {
      this._correctAnswers++;
    }
  }

  updateProgress(wordsStudied: number, correctAnswers: number, totalAttempts: number): void {
    if (wordsStudied < 0 || correctAnswers < 0 || totalAttempts < 0) {
      throw new InvalidDomainDataException('progress', { wordsStudied, correctAnswers, totalAttempts }, 'Progress values cannot be negative');
    }
    
    if (correctAnswers > totalAttempts) {
      throw new InvalidDomainDataException('correctAnswers', correctAnswers, 'Cannot exceed total attempts');
    }
    
    this._wordsStudied = wordsStudied;
    this._correctAnswers = correctAnswers;
    this._totalAttempts = totalAttempts;
  }

  endSession(metadata?: Record<string, any>): void {
    if (this._endTime) {
      throw new InvalidDomainDataException('endTime', this._endTime, 'Session already ended');
    }
    
    this._endTime = new Date();
    this._duration = Math.floor((this._endTime.getTime() - this._startTime.getTime()) / 1000);
    
    if (metadata) {
      this._metadata = { ...this._metadata, ...metadata };
    }
  }

  getAccuracy(): number {
    return this._totalAttempts === 0 ? 0 : this._correctAnswers / this._totalAttempts;
  }

  isActive(): boolean {
    return this._endTime === undefined;
  }

  getDurationInMinutes(): number {
    if (!this._duration) return 0;
    return Math.floor(this._duration / 60);
  }

  setId(id: number): void {
    if (this._id !== undefined) {
      throw new InvalidDomainDataException('id', id, 'ID already set');
    }
    this._id = id;
  }

  private validateProps(props: StudySessionProps): void {
    if (!props.userId || props.userId <= 0) {
      throw new InvalidDomainDataException('userId', props.userId, 'Valid user ID is required');
    }
    
    if (!props.sessionId || props.sessionId.trim().length === 0) {
      throw new InvalidDomainDataException('sessionId', props.sessionId, 'Session ID is required');
    }
    
    if (props.wordsStudied !== undefined && props.wordsStudied < 0) {
      throw new InvalidDomainDataException('wordsStudied', props.wordsStudied, 'Words studied cannot be negative');
    }
    
    if (props.correctAnswers !== undefined && props.correctAnswers < 0) {
      throw new InvalidDomainDataException('correctAnswers', props.correctAnswers, 'Correct answers cannot be negative');
    }
    
    if (props.totalAttempts !== undefined && props.totalAttempts < 0) {
      throw new InvalidDomainDataException('totalAttempts', props.totalAttempts, 'Total attempts cannot be negative');
    }
  }

  static create(props: Omit<StudySessionProps, 'id' | 'createdAt'>): StudySession {
    return new StudySession(props);
  }

  static generateSessionId(userId: number): string {
    return `session_${userId}_${Date.now()}`;
  }
}
```

#### `wordbook.entity.ts`
```typescript
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
```

### 3. Repository Interfaces (`src/domain/repositories/`)

#### `user.repository.interface.ts`
```typescript
import { User } from '../entities/user.entity';
import { Email } from '../value-objects/email.vo';

export interface UserRepository {
  findById(id: number): Promise<User | null>;
  findByGoogleId(googleId: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: number): Promise<void>;
  exists(id: number): Promise<boolean>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
```

#### `progress.repository.interface.ts`
```typescript
import { WordProgress } from '../entities/word-progress.entity';
import { StudySession } from '../entities/study-session.entity';
import { WordId } from '../value-objects/word-id.vo';

export interface ProgressRepository {
  // Word Progress
  findWordProgress(userId: number, wordId: WordId): Promise<WordProgress | null>;
  findUserProgress(userId: number): Promise<WordProgress[]>;
  findProgressByIds(userId: number, wordIds: WordId[]): Promise<WordProgress[]>;
  saveWordProgress(progress: WordProgress): Promise<WordProgress>;
  updateWordProgress(progress: WordProgress): Promise<WordProgress>;
  deleteWordProgress(userId: number, wordId: WordId): Promise<void>;
  
  // Study Sessions
  findActiveSession(userId: number): Promise<StudySession | null>;
  findSessionById(sessionId: string): Promise<StudySession | null>;
  findUserSessions(userId: number, limit?: number): Promise<StudySession[]>;
  saveStudySession(session: StudySession): Promise<StudySession>;
  updateStudySession(session: StudySession): Promise<StudySession>;
  
  // Analytics
  getUserStats(userId: number): Promise<{
    totalWordsStudied: number;
    totalSessions: number;
    averageAccuracy: number;
    totalStudyTime: number;
    streak: number;
  }>;
  getLearnedWords(userId: number): Promise<WordId[]>;
}

export const PROGRESS_REPOSITORY = Symbol('PROGRESS_REPOSITORY');
```

#### `wordbook.repository.interface.ts`
```typescript
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
```

### 4. Domain Services (`src/domain/services/`)

#### `progress-calculation.service.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { WordProgress } from '../entities/word-progress.entity';
import { ConfidenceLevel } from '../value-objects/confidence-level.vo';

@Injectable()
export class ProgressCalculationService {
  calculateNextReviewDate(progress: WordProgress): Date {
    const confidenceLevel = progress.confidence.value;
    const reviewIntervals = [1, 2, 4, 7, 14, 30]; // days
    
    const intervalDays = reviewIntervals[confidenceLevel] || 1;
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + intervalDays);
    
    return nextReview;
  }

  calculateLearningVelocity(progressList: WordProgress[]): number {
    if (progressList.length === 0) return 0;
    
    const learnedWords = progressList.filter(p => p.isLearned).length;
    const totalWords = progressList.length;
    
    return learnedWords / totalWords;
  }

  calculateOptimalBatchSize(userAccuracy: number): number {
    // Adaptive batch size based on user performance
    if (userAccuracy >= 0.9) return 25;
    if (userAccuracy >= 0.8) return 20;
    if (userAccuracy >= 0.7) return 15;
    if (userAccuracy >= 0.6) return 12;
    return 10;
  }

  identifyWeakWords(progressList: WordProgress[]): WordProgress[] {
    return progressList.filter(progress => {
      const accuracy = progress.getAccuracy();
      return accuracy < 0.6 && progress.attempts >= 3;
    });
  }

  calculateConfidenceDistribution(progressList: WordProgress[]): Record<number, number> {
    const distribution: Record<number, number> = {
      0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };
    
    progressList.forEach(progress => {
      const level = progress.confidence.value;
      distribution[level]++;
    });
    
    return distribution;
  }

  predictCompletionTime(progressList: WordProgress[], studyHoursPerDay: number): number {
    const unlearned = progressList.filter(p => !p.isLearned);
    const averageReviewsNeeded = 5; // empirical average
    const wordsPerHour = 30; // empirical average
    
    const totalReviewsNeeded = unlearned.length * averageReviewsNeeded;
    const hoursNeeded = totalReviewsNeeded / wordsPerHour;
    
    return Math.ceil(hoursNeeded / studyHoursPerDay);
  }
}
```

#### `wordbook-validation.service.ts`
```typescript
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
```

## 테스트 작성

### Value Object 테스트 (`src/domain/value-objects/__tests__/`)

#### `email.vo.spec.ts`
```typescript
import { Email } from '../email.vo';
import { InvalidDomainDataException } from '../../../shared/exceptions/domain.exception';

describe('Email', () => {
  describe('constructor', () => {
    it('should create valid email', () => {
      const email = new Email('test@example.com');
      expect(email.value).toBe('test@example.com');
    });

    it('should normalize email to lowercase', () => {
      const email = new Email('Test@Example.COM');
      expect(email.value).toBe('test@example.com');
    });

    it('should trim whitespace', () => {
      const email = new Email('  test@example.com  ');
      expect(email.value).toBe('test@example.com');
    });

    it('should throw error for invalid email', () => {
      expect(() => new Email('invalid-email')).toThrow(InvalidDomainDataException);
    });

    it('should throw error for empty email', () => {
      expect(() => new Email('')).toThrow(InvalidDomainDataException);
    });
  });

  describe('equals', () => {
    it('should return true for same email', () => {
      const email1 = new Email('test@example.com');
      const email2 = new Email('test@example.com');
      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for different emails', () => {
      const email1 = new Email('test1@example.com');
      const email2 = new Email('test2@example.com');
      expect(email1.equals(email2)).toBe(false);
    });
  });
});
```

### Entity 테스트 (`src/domain/entities/__tests__/`)

#### `user.entity.spec.ts`
```typescript
import { User } from '../user.entity';
import { InvalidDomainDataException } from '../../../shared/exceptions/domain.exception';

describe('User', () => {
  const validUserProps = {
    googleId: 'google-123',
    email: 'test@example.com',
    name: 'Test User',
    avatar: 'https://example.com/avatar.jpg',
  };

  describe('constructor', () => {
    it('should create user with valid props', () => {
      const user = new User(validUserProps);
      
      expect(user.googleId).toBe('google-123');
      expect(user.email.value).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.avatar).toBe('https://example.com/avatar.jpg');
      expect(user.locale).toBe('en');
    });

    it('should throw error for empty name', () => {
      expect(() => new User({ ...validUserProps, name: '' }))
        .toThrow(InvalidDomainDataException);
    });

    it('should throw error for empty googleId', () => {
      expect(() => new User({ ...validUserProps, googleId: '' }))
        .toThrow(InvalidDomainDataException);
    });
  });

  describe('updateProfile', () => {
    it('should update name and avatar', () => {
      const user = new User(validUserProps);
      user.updateProfile('New Name', 'new-avatar.jpg');
      
      expect(user.name).toBe('New Name');
      expect(user.avatar).toBe('new-avatar.jpg');
    });

    it('should throw error for empty name', () => {
      const user = new User(validUserProps);
      expect(() => user.updateProfile('')).toThrow(InvalidDomainDataException);
    });
  });

  describe('changeLocale', () => {
    it('should change locale to valid value', () => {
      const user = new User(validUserProps);
      user.changeLocale('ko');
      
      expect(user.locale).toBe('ko');
    });

    it('should throw error for invalid locale', () => {
      const user = new User(validUserProps);
      expect(() => user.changeLocale('invalid'))
        .toThrow(InvalidDomainDataException);
    });
  });
});
```

## PR 체크리스트

### 도메인 모델
- [ ] 모든 엔티티가 비즈니스 규칙을 올바르게 구현
- [ ] Value Object가 불변성을 보장
- [ ] 도메인 서비스가 적절한 책임을 가짐
- [ ] Repository 인터페이스가 도메인 중심으로 설계됨

### 코드 품질
- [ ] 모든 public 메서드에 대한 단위 테스트 작성
- [ ] 예외 시나리오에 대한 테스트 포함
- [ ] 불변성과 캡슐화 원칙 준수
- [ ] 비즈니스 규칙이 도메인 계층에 집중

### 설계 원칙
- [ ] 단일 책임 원칙 준수
- [ ] 도메인 계층이 외부 의존성 없음
- [ ] 인터페이스 분리 원칙 적용
- [ ] 도메인 이벤트가 필요한 경우 고려됨

## 다음 단계 준비사항

1. **DTO 설계**: 각 엔티티에 대응하는 요청/응답 DTO 구조 설계
2. **Use Case 정의**: 비즈니스 유스케이스별 시나리오 정리
3. **Application Service 인터페이스**: 도메인 서비스와 Use Case 연결점 설계

## 예상 작업 시간

- **Value Object 구현**: 1일
- **Domain Entity 구현**: 2일
- **Repository Interface 정의**: 0.5일
- **Domain Service 구현**: 1일
- **단위 테스트 작성**: 1.5일
- **문서화 및 리뷰**: 0.5일

**총 예상 시간**: 6.5일

이 단계를 완료하면 비즈니스 로직의 핵심이 도메인 계층에 안전하게 캡슐화되어 후속 단계에서 안정적인 기반을 제공할 수 있습니다.