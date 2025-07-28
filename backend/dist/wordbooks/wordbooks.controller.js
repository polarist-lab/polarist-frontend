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
exports.WordbooksController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const wordbooks_service_1 = require("./wordbooks.service");
let WordbooksController = class WordbooksController {
    constructor(wordbooksService) {
        this.wordbooksService = wordbooksService;
    }
    // Create a new wordbook
    async createWordbook(req, createDto) {
        return this.wordbooksService.createWordbook(req.user.id, createDto);
    }
    // Get user's wordbooks
    async getMyWordbooks(req) {
        return this.wordbooksService.getUserWordbooks(req.user.id);
    }
    // Get public wordbooks
    async getPublicWordbooks(limit) {
        const limitNum = limit ? parseInt(limit, 10) : 20;
        return this.wordbooksService.getPublicWordbooks(limitNum);
    }
    // Get wordbook by share code
    async getSharedWordbook(shareCode) {
        return this.wordbooksService.getWordbookByShareCode(shareCode);
    }
    // Get specific wordbook
    async getWordbook(id, req) {
        return this.wordbooksService.getWordbookById(parseInt(id, 10), req.user.id);
    }
    // Update wordbook
    async updateWordbook(id, req, updateDto) {
        return this.wordbooksService.updateWordbook(parseInt(id, 10), req.user.id, updateDto);
    }
    // Delete wordbook
    async deleteWordbook(id, req) {
        return this.wordbooksService.deleteWordbook(parseInt(id, 10), req.user.id);
    }
    // Start studying a wordbook (increment study count)
    async startStudying(id) {
        await this.wordbooksService.incrementStudyCount(parseInt(id, 10));
        return { success: true };
    }
};
exports.WordbooksController = WordbooksController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WordbooksController.prototype, "createWordbook", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WordbooksController.prototype, "getMyWordbooks", null);
__decorate([
    (0, common_1.Get)('public'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WordbooksController.prototype, "getPublicWordbooks", null);
__decorate([
    (0, common_1.Get)('shared/:shareCode'),
    __param(0, (0, common_1.Param)('shareCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WordbooksController.prototype, "getSharedWordbook", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WordbooksController.prototype, "getWordbook", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], WordbooksController.prototype, "updateWordbook", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WordbooksController.prototype, "deleteWordbook", null);
__decorate([
    (0, common_1.Post)(':id/study'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WordbooksController.prototype, "startStudying", null);
exports.WordbooksController = WordbooksController = __decorate([
    (0, common_1.Controller)('wordbooks'),
    __metadata("design:paramtypes", [wordbooks_service_1.WordbooksService])
], WordbooksController);
