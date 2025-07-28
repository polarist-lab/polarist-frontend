import { Module } from '@nestjs/common';
import { WordbooksController } from './wordbooks.controller';
import { WordbooksService } from './wordbooks.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [WordbooksController],
  providers: [WordbooksService],
  exports: [WordbooksService],
})
export class WordbooksModule {}