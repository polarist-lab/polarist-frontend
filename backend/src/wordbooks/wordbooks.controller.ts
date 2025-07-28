import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete,
  Body, 
  Param, 
  Query,
  Req,
  UseGuards 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WordbooksService, CreateWordbookDto, UpdateWordbookDto } from './wordbooks.service';

@Controller('wordbooks')
export class WordbooksController {
  constructor(private wordbooksService: WordbooksService) {}

  // Create a new wordbook
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createWordbook(@Req() req: any, @Body() createDto: CreateWordbookDto) {
    return this.wordbooksService.createWordbook(req.user.id, createDto);
  }

  // Get user's wordbooks
  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  async getMyWordbooks(@Req() req: any) {
    return this.wordbooksService.getUserWordbooks(req.user.id);
  }

  // Get public wordbooks
  @Get('public')
  async getPublicWordbooks(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.wordbooksService.getPublicWordbooks(limitNum);
  }

  // Get wordbook by share code
  @Get('shared/:shareCode')
  async getSharedWordbook(@Param('shareCode') shareCode: string) {
    return this.wordbooksService.getWordbookByShareCode(shareCode);
  }

  // Get specific wordbook
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getWordbook(@Param('id') id: string, @Req() req: any) {
    return this.wordbooksService.getWordbookById(parseInt(id, 10), req.user.id);
  }

  // Update wordbook
  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateWordbook(
    @Param('id') id: string, 
    @Req() req: any, 
    @Body() updateDto: UpdateWordbookDto
  ) {
    return this.wordbooksService.updateWordbook(parseInt(id, 10), req.user.id, updateDto);
  }

  // Delete wordbook
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteWordbook(@Param('id') id: string, @Req() req: any) {
    return this.wordbooksService.deleteWordbook(parseInt(id, 10), req.user.id);
  }

  // Start studying a wordbook (increment study count)
  @Post(':id/study')
  async startStudying(@Param('id') id: string) {
    await this.wordbooksService.incrementStudyCount(parseInt(id, 10));
    return { success: true };
  }
}