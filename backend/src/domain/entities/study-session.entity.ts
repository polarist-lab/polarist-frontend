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