import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createDrizzleDatabase, DrizzleDatabase } from './drizzle/config';
import { DatabaseService } from './database.service';

export const DRIZZLE_DATABASE = Symbol('DRIZZLE_DATABASE');

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE_DATABASE,
      useFactory: (configService: ConfigService): DrizzleDatabase => {
        const databaseUrl = configService.get<string>('DATABASE_URL', 'data/sqlite.db');
        return createDrizzleDatabase(databaseUrl);
      },
      inject: [ConfigService],
    },
    DatabaseService,
  ],
  exports: [DRIZZLE_DATABASE, DatabaseService],
})
export class DatabaseModule {}