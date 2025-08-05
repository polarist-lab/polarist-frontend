import { Injectable, Inject } from '@nestjs/common';
import { DrizzleDatabase, DRIZZLE_DATABASE } from './drizzle/config';
import * as schema from './drizzle/schema';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject(DRIZZLE_DATABASE)
    public readonly db: DrizzleDatabase,
  ) {}

  async healthCheck(): Promise<boolean> {
    try {
      await this.db.select().from(schema.users).limit(1);
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}