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
exports.WordbooksService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const database_service_1 = require("../database/database.service");
const schema_1 = require("../database/schema");
let WordbooksService = class WordbooksService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async createWordbook(userId, createDto) {
        const shareCode = this.generateShareCode();
        const wordbook = await this.databaseService.db.insert(schema_1.customWordbooks).values({
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
    async getUserWordbooks(userId) {
        const wordbooks = await this.databaseService.db
            .select()
            .from(schema_1.customWordbooks)
            .where((0, drizzle_orm_1.eq)(schema_1.customWordbooks.userId, userId));
        return wordbooks.map(wb => ({
            ...wb,
            wordIds: JSON.parse(wb.wordIds),
            categories: JSON.parse(wb.categories || '[]'),
            difficulties: JSON.parse(wb.difficulties || '[]'),
            tags: JSON.parse(wb.tags || '[]'),
        }));
    }
    async getWordbookById(id, userId) {
        const wordbook = await this.databaseService.db
            .select()
            .from(schema_1.customWordbooks)
            .where((0, drizzle_orm_1.eq)(schema_1.customWordbooks.id, id))
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
    async getWordbookByShareCode(shareCode) {
        const wordbook = await this.databaseService.db
            .select()
            .from(schema_1.customWordbooks)
            .where((0, drizzle_orm_1.eq)(schema_1.customWordbooks.shareCode, shareCode))
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
    async updateWordbook(id, userId, updateDto) {
        // Check ownership
        const existing = await this.getWordbookById(id, userId);
        if (existing.userId !== userId) {
            throw new Error('Not authorized to update this wordbook');
        }
        const updateData = {};
        if (updateDto.name)
            updateData.name = updateDto.name;
        if (updateDto.description !== undefined)
            updateData.description = updateDto.description;
        if (updateDto.wordIds) {
            updateData.wordIds = JSON.stringify(updateDto.wordIds);
            updateData.totalWords = updateDto.wordIds.length;
        }
        if (updateDto.categories)
            updateData.categories = JSON.stringify(updateDto.categories);
        if (updateDto.difficulties)
            updateData.difficulties = JSON.stringify(updateDto.difficulties);
        if (updateDto.tags)
            updateData.tags = JSON.stringify(updateDto.tags);
        if (updateDto.isPublic !== undefined)
            updateData.isPublic = updateDto.isPublic;
        updateData.updatedAt = new Date();
        const result = await this.databaseService.db
            .update(schema_1.customWordbooks)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(schema_1.customWordbooks.id, id))
            .returning();
        return result[0];
    }
    async deleteWordbook(id, userId) {
        // Check ownership
        const existing = await this.getWordbookById(id, userId);
        if (existing.userId !== userId) {
            throw new Error('Not authorized to delete this wordbook');
        }
        await this.databaseService.db
            .delete(schema_1.customWordbooks)
            .where((0, drizzle_orm_1.eq)(schema_1.customWordbooks.id, id));
        return { success: true };
    }
    async incrementStudyCount(id) {
        // First get current count
        const current = await this.databaseService.db
            .select({ studyCount: schema_1.customWordbooks.studyCount })
            .from(schema_1.customWordbooks)
            .where((0, drizzle_orm_1.eq)(schema_1.customWordbooks.id, id))
            .limit(1);
        if (current[0]) {
            await this.databaseService.db
                .update(schema_1.customWordbooks)
                .set({
                studyCount: (current[0].studyCount || 0) + 1,
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.eq)(schema_1.customWordbooks.id, id));
        }
    }
    async getPublicWordbooks(limit = 20) {
        const wordbooks = await this.databaseService.db
            .select()
            .from(schema_1.customWordbooks)
            .where((0, drizzle_orm_1.eq)(schema_1.customWordbooks.isPublic, true))
            .limit(limit);
        return wordbooks.map(wb => ({
            ...wb,
            wordIds: JSON.parse(wb.wordIds),
            categories: JSON.parse(wb.categories || '[]'),
            difficulties: JSON.parse(wb.difficulties || '[]'),
            tags: JSON.parse(wb.tags || '[]'),
        }));
    }
    generateShareCode() {
        return Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
    }
};
exports.WordbooksService = WordbooksService;
exports.WordbooksService = WordbooksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], WordbooksService);
