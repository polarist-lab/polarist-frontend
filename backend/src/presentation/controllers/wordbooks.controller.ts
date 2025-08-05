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
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

// Use Cases
import { CreateWordbookUseCase } from '../../application/use-cases/wordbooks/create-wordbook.use-case';

// DTOs
import { CreateWordbookDto } from '../../application/dtos/wordbooks/create-wordbook.dto';
import { UpdateWordbookDto, ShareWordbookDto } from '../../application/dtos/wordbooks/update-wordbook.dto';
import { WordbookResponseDto, WordbookListResponseDto } from '../../application/dtos/wordbooks/wordbook-response.dto';

// Guards & Types
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../types/request.types';

@ApiTags('Wordbooks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wordbooks')
export class WordbooksController {
  constructor(
    private readonly createWordbookUseCase: CreateWordbookUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new wordbook' })
  @ApiResponse({ status: 201, description: 'Wordbook created successfully', type: WordbookResponseDto })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async createWordbook(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateWordbookDto
  ): Promise<WordbookResponseDto> {
    return this.createWordbookUseCase.execute(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user wordbooks' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 20)' })
  @ApiResponse({ status: 200, description: 'Wordbooks retrieved', type: WordbookListResponseDto })
  async getUserWordbooks(
    @Req() req: AuthenticatedRequest,
    @Query('page') page = 1,
    @Query('limit') limit = 20
  ): Promise<WordbookListResponseDto> {
    // TODO: Implement get user wordbooks use case
    return {
      wordbooks: [],
      total: 0,
      page: Number(page),
      limit: Number(limit),
      hasNext: false,
      hasPrev: false,
    };
  }

  @Get('public')
  @ApiOperation({ summary: 'Get public wordbooks' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 20)' })
  @ApiQuery({ name: 'tags', required: false, description: 'Filter by tags (comma-separated)' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiQuery({ name: 'search', required: false, description: 'Search in wordbook names' })
  @ApiResponse({ status: 200, description: 'Public wordbooks retrieved', type: WordbookListResponseDto })
  async getPublicWordbooks(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('tags') tags?: string,
    @Query('category') category?: string,
    @Query('search') search?: string
  ): Promise<WordbookListResponseDto> {
    // TODO: Implement get public wordbooks use case
    return {
      wordbooks: [],
      total: 0,
      page: Number(page),
      limit: Number(limit),
      hasNext: false,
      hasPrev: false,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get wordbook by ID' })
  @ApiParam({ name: 'id', description: 'Wordbook ID' })
  @ApiResponse({ status: 200, description: 'Wordbook found', type: WordbookResponseDto })
  @ApiResponse({ status: 404, description: 'Wordbook not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async getWordbookById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest
  ): Promise<WordbookResponseDto> {
    // TODO: Implement get wordbook by id use case
    throw new Error('Not implemented');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update wordbook' })
  @ApiParam({ name: 'id', description: 'Wordbook ID' })
  @ApiResponse({ status: 200, description: 'Wordbook updated successfully', type: WordbookResponseDto })
  @ApiResponse({ status: 403, description: 'Not authorized to update this wordbook' })
  @ApiResponse({ status: 404, description: 'Wordbook not found' })
  async updateWordbook(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWordbookDto,
    @Req() req: AuthenticatedRequest
  ): Promise<WordbookResponseDto> {
    // TODO: Implement update wordbook use case
    throw new Error('Not implemented');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete wordbook' })
  @ApiParam({ name: 'id', description: 'Wordbook ID' })
  @ApiResponse({ status: 200, description: 'Wordbook deleted successfully' })
  @ApiResponse({ status: 403, description: 'Not authorized to delete this wordbook' })
  @ApiResponse({ status: 404, description: 'Wordbook not found' })
  async deleteWordbook(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest
  ) {
    // TODO: Implement delete wordbook use case
    return { message: 'Wordbook deleted successfully', id };
  }

  @Put(':id/share')
  @ApiOperation({ summary: 'Enable/disable wordbook sharing' })
  @ApiParam({ name: 'id', description: 'Wordbook ID' })
  @ApiResponse({ status: 200, description: 'Wordbook sharing updated', type: WordbookResponseDto })
  async updateWordbookSharing(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ShareWordbookDto,
    @Req() req: AuthenticatedRequest
  ): Promise<WordbookResponseDto> {
    // TODO: Implement update wordbook sharing use case
    throw new Error('Not implemented');
  }

  @Get('shared/:shareCode')
  @ApiOperation({ summary: 'Get wordbook by share code' })
  @ApiParam({ name: 'shareCode', description: 'Wordbook share code' })
  @ApiResponse({ status: 200, description: 'Shared wordbook found', type: WordbookResponseDto })
  @ApiResponse({ status: 404, description: 'Shared wordbook not found' })
  async getSharedWordbook(@Param('shareCode') shareCode: string): Promise<WordbookResponseDto> {
    // TODO: Implement get shared wordbook use case
    throw new Error('Not implemented');
  }
}