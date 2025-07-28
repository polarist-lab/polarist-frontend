import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { users, User, NewUser } from '../database/schema';

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  async findById(id: number): Promise<User | null> {
    const result = await this.db.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    
    return result[0] || null;
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const result = await this.db.db
      .select()
      .from(users)
      .where(eq(users.googleId, googleId))
      .limit(1);
    
    return result[0] || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    return result[0] || null;
  }

  async create(userData: NewUser): Promise<User> {
    const result = await this.db.db
      .insert(users)
      .values(userData)
      .returning();
    
    return result[0];
  }

  async update(id: number, updateData: Partial<NewUser>): Promise<User> {
    const result = await this.db.db
      .update(users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    
    return result[0];
  }

  async delete(id: number): Promise<void> {
    await this.db.db.delete(users).where(eq(users.id, id));
  }
}