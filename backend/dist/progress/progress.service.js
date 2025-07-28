"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const database_service_1 = require("../database/database.service");
const schema_1 = require("../database/schema");
let ProgressService = class ProgressService {
    constructor(db) {
        this.db = db;
    }
    async getWordProgress(userId, wordId) {
        const result = await this.db.db
            .select()
            .from(schema_1.userProgress)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.userProgress.userId, userId), (0, drizzle_orm_1.eq)(schema_1.userProgress.wordId, wordId)))
            .limit(1);
        if (!result[0])
            return null;
        const progress = result[0];
        return {
            wordId: progress.wordId,
            isLearned: progress.isLearned ?? false,
            attempts: progress.attempts ?? 0,
            correctAnswers: progress.correctAnswers ?? 0,
            confidence: progress.confidence ?? 0,
            lastStudied: progress.lastStudied,
        };
    }
    async getUserProgress(userId) {
        const results = await this.db.db
            .select()
            .from(schema_1.userProgress)
            .where((0, drizzle_orm_1.eq)(schema_1.userProgress.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.userProgress.lastStudied));
        return results.map(progress => ({
            wordId: progress.wordId,
            isLearned: progress.isLearned ?? false,
            attempts: progress.attempts ?? 0,
            correctAnswers: progress.correctAnswers ?? 0,
            confidence: progress.confidence ?? 0,
            lastStudied: progress.lastStudied,
        }));
    }
    async updateWordProgress(userId, wordId, isCorrect) {
        const existing = await this.getWordProgress(userId, wordId);
        if (existing) {
            // Update existing progress
            const newAttempts = existing.attempts + 1;
            const newCorrectAnswers = existing.correctAnswers + (isCorrect ? 1 : 0);
            const accuracy = newCorrectAnswers / newAttempts;
            const newConfidence = Math.min(5, Math.floor(accuracy * 5));
            const isLearned = accuracy >= 0.8 && newAttempts >= 3;
            const updated = await this.db.db
                .update(schema_1.userProgress)
                .set({
                attempts: newAttempts,
                correctAnswers: newCorrectAnswers,
                confidence: newConfidence,
                isLearned,
                lastStudied: new Date(),
                updatedAt: new Date(),
            })
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.userProgress.userId, userId), (0, drizzle_orm_1.eq)(schema_1.userProgress.wordId, wordId)))
                .returning();
            return {
                wordId: updated[0].wordId,
                isLearned: updated[0].isLearned ?? false,
                attempts: updated[0].attempts ?? 0,
                correctAnswers: updated[0].correctAnswers ?? 0,
                confidence: updated[0].confidence ?? 0,
                lastStudied: updated[0].lastStudied,
            };
        }
        else {
            // Create new progress entry
            const newProgress = {
                userId,
                wordId,
                attempts: 1,
                correctAnswers: isCorrect ? 1 : 0,
                confidence: isCorrect ? 1 : 0,
                isLearned: false,
                lastStudied: new Date(),
            };
            const created = await this.db.db
                .insert(schema_1.userProgress)
                .values(newProgress)
                .returning();
            return {
                wordId: created[0].wordId,
                isLearned: created[0].isLearned ?? false,
                attempts: created[0].attempts ?? 0,
                correctAnswers: created[0].correctAnswers ?? 0,
                confidence: created[0].confidence ?? 0,
                lastStudied: created[0].lastStudied,
            };
        }
    }
    async startStudySession(userId) {
        const sessionId = `session_${userId}_${Date.now()}`;
        const newSession = {
            userId,
            sessionId,
            wordsStudied: 0,
            correctAnswers: 0,
            totalAttempts: 0,
            startTime: new Date(),
        };
        await this.db.db.insert(schema_1.studySessions).values(newSession);
        return sessionId;
    }
    async endStudySession(sessionId, duration, metadata) {
        const updated = await this.db.db
            .update(schema_1.studySessions)
            .set({
            duration,
            endTime: new Date(),
            metadata: metadata ? JSON.stringify(metadata) : null,
        })
            .where((0, drizzle_orm_1.eq)(schema_1.studySessions.sessionId, sessionId))
            .returning();
        return updated[0];
    }
    async updateSessionProgress(sessionId, wordsStudied, correctAnswers, totalAttempts) {
        await this.db.db
            .update(schema_1.studySessions)
            .set({
            wordsStudied,
            correctAnswers,
            totalAttempts,
        })
            .where((0, drizzle_orm_1.eq)(schema_1.studySessions.sessionId, sessionId));
    }
    async getStudyStats(userId) {
        // Get user progress
        const progressResults = await this.db.db
            .select()
            .from(schema_1.userProgress)
            .where((0, drizzle_orm_1.eq)(schema_1.userProgress.userId, userId));
        // Get study sessions
        const sessionResults = await this.db.db
            .select()
            .from(schema_1.studySessions)
            .where((0, drizzle_orm_1.eq)(schema_1.studySessions.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.studySessions.createdAt));
        const totalWordsStudied = progressResults.length;
        const totalSessions = sessionResults.length;
        // Calculate average accuracy
        const totalAttempts = progressResults.reduce((sum, p) => sum + (p.attempts ?? 0), 0);
        const totalCorrect = progressResults.reduce((sum, p) => sum + (p.correctAnswers ?? 0), 0);
        const averageAccuracy = totalAttempts > 0 ? totalCorrect / totalAttempts : 0;
        // Calculate total study time
        const totalStudyTime = sessionResults
            .filter(s => s.duration)
            .reduce((sum, s) => sum + (s.duration || 0), 0);
        // Calculate streak (consecutive days with study sessions)
        let streak = 0;
        const today = new Date();
        const oneDayMs = 24 * 60 * 60 * 1000;
        for (let i = 0; i < sessionResults.length; i++) {
            const sessionDate = new Date(sessionResults[i].createdAt);
            const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / oneDayMs);
            if (daysDiff === streak) {
                streak++;
            }
            else if (daysDiff > streak) {
                break;
            }
        }
        return {
            totalWordsStudied,
            totalSessions,
            averageAccuracy,
            totalStudyTime,
            streak,
        };
    }
    async getLearnedWords(userId) {
        const results = await this.db.db
            .select({ wordId: schema_1.userProgress.wordId })
            .from(schema_1.userProgress)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.userProgress.userId, userId), (0, drizzle_orm_1.eq)(schema_1.userProgress.isLearned, true)));
        return results.map(r => r.wordId);
    }
    async resetWordProgress(userId, wordId) {
        await this.db.db
            .delete(schema_1.userProgress)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.userProgress.userId, userId), (0, drizzle_orm_1.eq)(schema_1.userProgress.wordId, wordId)));
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], ProgressService);
