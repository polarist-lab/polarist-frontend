import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProgressService, WordProgress, StudyStats } from './progress.service';

@Controller('progress')
@UseGuards(AuthGuard('jwt'))
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Get('stats')
  async getStudyStats(@Req() req: any): Promise<StudyStats> {
    return this.progressService.getStudyStats(req.user.id);
  }

  @Get('words')
  async getUserProgress(@Req() req: any): Promise<WordProgress[]> {
    return this.progressService.getUserProgress(req.user.id);
  }

  @Get('learned-words')
  async getLearnedWords(@Req() req: any): Promise<{ learnedWords: string[] }> {
    const learnedWords = await this.progressService.getLearnedWords(req.user.id);
    return { learnedWords };
  }

  @Get('words/:wordId')
  async getWordProgress(@Req() req: any, @Param('wordId') wordId: string): Promise<WordProgress | null> {
    return this.progressService.getWordProgress(req.user.id, wordId);
  }

  @Post('words/:wordId')
  async updateWordProgress(
    @Req() req: any,
    @Param('wordId') wordId: string,
    @Body() body: { isCorrect: boolean }
  ): Promise<WordProgress> {
    return this.progressService.updateWordProgress(req.user.id, wordId, body.isCorrect);
  }

  @Post('sessions/start')
  async startStudySession(@Req() req: any): Promise<{ sessionId: string }> {
    const sessionId = await this.progressService.startStudySession(req.user.id);
    return { sessionId };
  }

  @Post('sessions/:sessionId/end')
  async endStudySession(
    @Param('sessionId') sessionId: string,
    @Body() body: { duration: number; metadata?: any }
  ) {
    const session = await this.progressService.endStudySession(sessionId, body.duration, body.metadata);
    return { session };
  }

  @Put('sessions/:sessionId')
  async updateSessionProgress(
    @Param('sessionId') sessionId: string,
    @Body() body: { wordsStudied: number; correctAnswers: number; totalAttempts: number }
  ): Promise<{ message: string }> {
    await this.progressService.updateSessionProgress(
      sessionId,
      body.wordsStudied,
      body.correctAnswers,
      body.totalAttempts
    );
    return { message: 'Session progress updated successfully' };
  }

  @Delete('words/:wordId')
  async resetWordProgress(@Req() req: any, @Param('wordId') wordId: string): Promise<{ message: string }> {
    await this.progressService.resetWordProgress(req.user.id, wordId);
    return { message: 'Word progress reset successfully' };
  }
}