import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete,
  Body, 
  Param, 
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

// Use Cases
import { UpdateWordProgressUseCase } from '../../application/use-cases/progress/update-word-progress.use-case';
import { GetUserProgressUseCase } from '../../application/use-cases/progress/get-user-progress.use-case';
import { GetStudyStatsUseCase } from '../../application/use-cases/progress/get-study-stats.use-case';
import { StartStudySessionUseCase } from '../../application/use-cases/progress/start-study-session.use-case';

// DTOs
import { UpdateWordProgressDto, WordProgressResponseDto, ResetWordProgressDto } from '../../application/dtos/progress/word-progress.dto';
import { StartStudySessionDto, StudySessionResponseDto } from '../../application/dtos/progress/study-session.dto';
import { StudyStatsResponseDto } from '../../application/dtos/progress/study-stats.dto';

// Guards & Types
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../types/request.types';

@ApiTags('Progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(
    private readonly updateWordProgressUseCase: UpdateWordProgressUseCase,
    private readonly getUserProgressUseCase: GetUserProgressUseCase,
    private readonly getStudyStatsUseCase: GetStudyStatsUseCase,
    private readonly startStudySessionUseCase: StartStudySessionUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get user progress for all words' })
  @ApiResponse({ status: 200, description: 'User progress retrieved', type: [WordProgressResponseDto] })
  async getUserProgress(@Req() req: AuthenticatedRequest): Promise<WordProgressResponseDto[]> {
    return this.getUserProgressUseCase.execute(req.user.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get user study statistics' })
  @ApiResponse({ status: 200, description: 'Study stats retrieved', type: StudyStatsResponseDto })
  async getStudyStats(@Req() req: AuthenticatedRequest): Promise<StudyStatsResponseDto> {
    return this.getStudyStatsUseCase.execute(req.user.id);
  }

  @Post('words')
  @ApiOperation({ summary: 'Update word learning progress' })
  @ApiResponse({ status: 200, description: 'Word progress updated', type: WordProgressResponseDto })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async updateWordProgress(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateWordProgressDto
  ): Promise<WordProgressResponseDto> {
    return this.updateWordProgressUseCase.execute(req.user.id, dto);
  }

  @Delete('words/:wordId')
  @ApiOperation({ summary: 'Reset word progress' })
  @ApiParam({ name: 'wordId', description: 'Word ID to reset' })
  @ApiResponse({ status: 200, description: 'Word progress reset successfully' })
  @ApiResponse({ status: 404, description: 'Word progress not found' })
  async resetWordProgress(
    @Req() req: AuthenticatedRequest,
    @Param('wordId') wordId: string
  ) {
    // TODO: Implement reset word progress use case
    return { message: 'Word progress reset successfully', wordId };
  }

  @Post('sessions')
  @ApiOperation({ summary: 'Start a new study session' })
  @ApiResponse({ status: 201, description: 'Study session started', type: StudySessionResponseDto })
  @ApiResponse({ status: 400, description: 'Active session already exists' })
  async startStudySession(
    @Req() req: AuthenticatedRequest,
    @Body() dto: StartStudySessionDto
  ): Promise<StudySessionResponseDto> {
    return this.startStudySessionUseCase.execute(req.user.id, dto);
  }

  @Put('sessions/:sessionId/end')
  @ApiOperation({ summary: 'End an active study session' })
  @ApiParam({ name: 'sessionId', description: 'Study session ID' })
  @ApiResponse({ status: 200, description: 'Study session ended', type: StudySessionResponseDto })
  @ApiResponse({ status: 404, description: 'Study session not found' })
  async endStudySession(
    @Param('sessionId') sessionId: string,
    @Body() dto: { duration: number; metadata?: Record<string, any> }
  ) {
    // TODO: Implement end study session use case
    return { message: 'Study session ended successfully', sessionId };
  }
}