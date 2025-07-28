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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const progress_service_1 = require("./progress.service");
let ProgressController = class ProgressController {
    constructor(progressService) {
        this.progressService = progressService;
    }
    async getStudyStats(req) {
        return this.progressService.getStudyStats(req.user.id);
    }
    async getUserProgress(req) {
        return this.progressService.getUserProgress(req.user.id);
    }
    async getLearnedWords(req) {
        const learnedWords = await this.progressService.getLearnedWords(req.user.id);
        return { learnedWords };
    }
    async getWordProgress(req, wordId) {
        return this.progressService.getWordProgress(req.user.id, wordId);
    }
    async updateWordProgress(req, wordId, body) {
        return this.progressService.updateWordProgress(req.user.id, wordId, body.isCorrect);
    }
    async startStudySession(req) {
        const sessionId = await this.progressService.startStudySession(req.user.id);
        return { sessionId };
    }
    async endStudySession(sessionId, body) {
        const session = await this.progressService.endStudySession(sessionId, body.duration, body.metadata);
        return { session };
    }
    async updateSessionProgress(sessionId, body) {
        await this.progressService.updateSessionProgress(sessionId, body.wordsStudied, body.correctAnswers, body.totalAttempts);
        return { message: 'Session progress updated successfully' };
    }
    async resetWordProgress(req, wordId) {
        await this.progressService.resetWordProgress(req.user.id, wordId);
        return { message: 'Word progress reset successfully' };
    }
};
exports.ProgressController = ProgressController;
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "getStudyStats", null);
__decorate([
    (0, common_1.Get)('words'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "getUserProgress", null);
__decorate([
    (0, common_1.Get)('learned-words'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "getLearnedWords", null);
__decorate([
    (0, common_1.Get)('words/:wordId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('wordId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "getWordProgress", null);
__decorate([
    (0, common_1.Post)('words/:wordId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('wordId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "updateWordProgress", null);
__decorate([
    (0, common_1.Post)('sessions/start'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "startStudySession", null);
__decorate([
    (0, common_1.Post)('sessions/:sessionId/end'),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "endStudySession", null);
__decorate([
    (0, common_1.Put)('sessions/:sessionId'),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "updateSessionProgress", null);
__decorate([
    (0, common_1.Delete)('words/:wordId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('wordId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "resetWordProgress", null);
exports.ProgressController = ProgressController = __decorate([
    (0, common_1.Controller)('progress'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [progress_service_1.ProgressService])
], ProgressController);
