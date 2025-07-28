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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const database_service_1 = require("../database/database.service");
const schema_1 = require("../database/schema");
let UsersService = class UsersService {
    constructor(db) {
        this.db = db;
    }
    async findById(id) {
        const result = await this.db.db
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, id))
            .limit(1);
        return result[0] || null;
    }
    async findByGoogleId(googleId) {
        const result = await this.db.db
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.googleId, googleId))
            .limit(1);
        return result[0] || null;
    }
    async findByEmail(email) {
        const result = await this.db.db
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, email))
            .limit(1);
        return result[0] || null;
    }
    async create(userData) {
        const result = await this.db.db
            .insert(schema_1.users)
            .values(userData)
            .returning();
        return result[0];
    }
    async update(id, updateData) {
        const result = await this.db.db
            .update(schema_1.users)
            .set({ ...updateData, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, id))
            .returning();
        return result[0];
    }
    async delete(id) {
        await this.db.db.delete(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], UsersService);
