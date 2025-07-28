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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth.service");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    // Mock login for testing (remove in production)
    async mockLogin(res) {
        const mockUser = {
            googleId: 'mock-google-id-123',
            email: 'test@example.com',
            name: '테스트 사용자',
            avatar: 'https://via.placeholder.com/32',
        };
        const { user, accessToken } = await this.authService.googleLogin(mockUser);
        // Redirect to frontend with token
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}`);
    }
    // Google OAuth for Signup
    async googleSignup(guestId) {
        // OAuth 시작 with signup intent
        // guest_id는 Passport strategy에서 사용하기 위해 session에 저장
    }
    async googleSignupCallback(req, res) {
        try {
            const { user, accessToken, isNewUser, guestDataMigrated } = await this.authService.handleGoogleSignup(req.user, req.session?.guestId);
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            if (isNewUser) {
                // 새 사용자 생성 성공
                res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}&new_user=true&migrated=${guestDataMigrated}`);
            }
            else {
                // 계정이 이미 존재함 - 에러 페이지로 리다이렉트
                res.redirect(`${frontendUrl}/auth/error?reason=account_exists`);
            }
        }
        catch (error) {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            res.redirect(`${frontendUrl}/auth/error?reason=signup_failed`);
        }
    }
    // Google OAuth for Sign In
    async googleSignin() {
        // OAuth 시작 with signin intent
    }
    async googleSigninCallback(req, res) {
        try {
            const { user, accessToken, accountExists } = await this.authService.handleGoogleLogin(req.user);
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            if (accountExists) {
                // 기존 사용자 로그인 성공
                res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}`);
            }
            else {
                // 계정이 존재하지 않음 - 에러 페이지로 리다이렉트
                res.redirect(`${frontendUrl}/auth/error?reason=account_not_found`);
            }
        }
        catch (error) {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            res.redirect(`${frontendUrl}/auth/error?reason=login_failed`);
        }
    }
    async getProfile(req) {
        return {
            user: req.user,
            message: 'User profile retrieved successfully',
        };
    }
    async logout(res) {
        res.json({ message: 'Logged out successfully' });
    }
    // Guest data migration API
    async migrateGuestData(req, guestId) {
        try {
            const success = await this.authService.migrateGuestData(req.user.id, guestId);
            return { success, message: success ? 'Guest data migrated successfully' : 'No guest data found' };
        }
        catch (error) {
            return { success: false, message: 'Migration failed', error: error instanceof Error ? error.message : 'Unknown error' };
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('mock-login'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "mockLogin", null);
__decorate([
    (0, common_1.Get)('google/signup'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google-signup')),
    __param(0, (0, common_1.Query)('guest_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleSignup", null);
__decorate([
    (0, common_1.Get)('google/signup/redirect'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google-signup')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleSignupCallback", null);
__decorate([
    (0, common_1.Get)('google/signin'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google-login')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleSignin", null);
__decorate([
    (0, common_1.Get)('google/signin/redirect'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google-login')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleSigninCallback", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('logout'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('migrate-guest-data'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('guest_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "migrateGuestData", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
