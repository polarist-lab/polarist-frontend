import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ProgressModule } from './progress/progress.module';
import { WordbooksModule } from './wordbooks/wordbooks.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProgressModule,
    WordbooksModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}