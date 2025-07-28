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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(jwtService, usersService) {
        this.jwtService = jwtService;
        this.usersService = usersService;
    }
    async googleLogin(googleUser) {
        // Check if user exists
        let user = await this.usersService.findByGoogleId(googleUser.googleId);
        if (!user) {
            // Create new user if doesn't exist
            user = await this.usersService.create({
                googleId: googleUser.googleId,
                email: googleUser.email,
                name: googleUser.name,
                avatar: googleUser.avatar,
            });
        }
        else {
            // Update user info if exists
            user = await this.usersService.update(user.id, {
                name: googleUser.name,
                avatar: googleUser.avatar,
                updatedAt: new Date(),
            });
        }
        const payload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload);
        return {
            user,
            accessToken,
        };
    }
    async validateUser(userId) {
        return this.usersService.findById(userId);
    }
    async handleGoogleSignup(googleUser, guestId) {
        // Check if user already exists
        const existingUser = await this.usersService.findByGoogleId(googleUser.googleId);
        if (existingUser) {
            // User already exists - signup should fail
            throw new Error('Account already exists');
        }
        // Create new user
        const user = await this.usersService.create({
            googleId: googleUser.googleId,
            email: googleUser.email,
            name: googleUser.name,
            avatar: googleUser.avatar,
        });
        const payload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload);
        // Try to migrate guest data if guestId provided
        let guestDataMigrated = false;
        if (guestId) {
            try {
                guestDataMigrated = await this.migrateGuestData(user.id, guestId);
            }
            catch (error) {
                console.warn('Guest data migration failed during signup:', error);
            }
        }
        return {
            user,
            accessToken,
            isNewUser: true,
            guestDataMigrated,
        };
    }
    async handleGoogleLogin(googleUser) {
        // Check if user exists
        let user = await this.usersService.findByGoogleId(googleUser.googleId);
        if (!user) {
            // User doesn't exist - login should fail
            throw new Error('Account not found');
        }
        // Update user info
        user = await this.usersService.update(user.id, {
            name: googleUser.name,
            avatar: googleUser.avatar,
            updatedAt: new Date(),
        });
        const payload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload);
        return {
            user,
            accessToken,
            accountExists: true,
        };
    }
    async migrateGuestData(userId, guestId) {
        try {
            // This is a placeholder for guest data migration logic
            // In a real implementation, you would:
            // 1. Fetch guest data from localStorage/temporary storage
            // 2. Convert it to user-specific format
            // 3. Save it to the user's profile/database
            // 4. Clean up guest data
            console.log(`Migrating guest data from ${guestId} to user ${userId}`);
            // For now, just return true to indicate success
            // This would be implemented based on your data storage strategy
            return true;
        }
        catch (error) {
            console.error('Guest data migration failed:', error);
            return false;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService])
], AuthService);
