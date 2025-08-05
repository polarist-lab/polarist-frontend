import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { Email } from '../../domain/value-objects/email.vo';
import { DatabaseService } from '../database/database.service';
import { users } from '../database/drizzle/schema';
import { DatabaseException } from '../../shared/exceptions/infrastructure.exception';
import { EntityNotFoundDomainException } from '../../shared/exceptions/domain.exception';

@Injectable()
export class DrizzleUserRepository implements UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findById(id: number): Promise<User | null> {
    try {
      const result = await this.databaseService.db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      return result[0] ? this.toDomainEntity(result[0]) : null;
    } catch (error) {
      throw new DatabaseException('findById', error as Error);
    }
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    try {
      const result = await this.databaseService.db
        .select()
        .from(users)
        .where(eq(users.googleId, googleId))
        .limit(1);

      return result[0] ? this.toDomainEntity(result[0]) : null;
    } catch (error) {
      throw new DatabaseException('findByGoogleId', error as Error);
    }
  }

  async findByEmail(email: Email): Promise<User | null> {
    try {
      const result = await this.databaseService.db
        .select()
        .from(users)
        .where(eq(users.email, email.value))
        .limit(1);

      return result[0] ? this.toDomainEntity(result[0]) : null;
    } catch (error) {
      throw new DatabaseException('findByEmail', error as Error);
    }
  }

  async save(user: User): Promise<User> {
    try {
      const userData = this.toDbRecord(user);
      const result = await this.databaseService.db
        .insert(users)
        .values(userData)
        .returning();

      const savedUser = this.toDomainEntity(result[0]);
      return savedUser;
    } catch (error) {
      throw new DatabaseException('save', error as Error);
    }
  }

  async update(user: User): Promise<User> {
    if (!user.id) {
      throw new EntityNotFoundDomainException('User', 'undefined');
    }

    try {
      const userData = this.toDbRecord(user);
      const result = await this.databaseService.db
        .update(users)
        .set({ ...userData, updatedAt: new Date() })
        .where(eq(users.id, user.id))
        .returning();

      if (result.length === 0) {
        throw new EntityNotFoundDomainException('User', user.id);
      }

      return this.toDomainEntity(result[0]);
    } catch (error) {
      if (error instanceof EntityNotFoundDomainException) {
        throw error;
      }
      throw new DatabaseException('update', error as Error);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const result = await this.databaseService.db
        .delete(users)
        .where(eq(users.id, id))
        .returning({ id: users.id });

      if (result.length === 0) {
        throw new EntityNotFoundDomainException('User', id);
      }
    } catch (error) {
      if (error instanceof EntityNotFoundDomainException) {
        throw error;
      }
      throw new DatabaseException('delete', error as Error);
    }
  }

  async exists(id: number): Promise<boolean> {
    try {
      const result = await this.databaseService.db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      return result.length > 0;
    } catch (error) {
      throw new DatabaseException('exists', error as Error);
    }
  }

  private toDomainEntity(dbRecord: any): User {
    return new User({
      id: dbRecord.id,
      googleId: dbRecord.googleId,
      email: dbRecord.email,
      name: dbRecord.name,
      avatar: dbRecord.avatar,
      locale: dbRecord.locale,
      createdAt: dbRecord.createdAt,
      updatedAt: dbRecord.updatedAt,
    });
  }

  private toDbRecord(user: User): any {
    return {
      id: user.id,
      googleId: user.googleId,
      email: user.email.value,
      name: user.name,
      avatar: user.avatar,
      locale: user.locale,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}