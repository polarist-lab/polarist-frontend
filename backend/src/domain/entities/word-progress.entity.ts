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