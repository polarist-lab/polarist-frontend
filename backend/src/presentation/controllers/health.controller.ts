import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DatabaseService } from '../../infrastructure/database/database.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  @ApiOperation({ summary: 'Basic health check' })
  @ApiResponse({ status: 200, description: 'Service health status' })
  async check() {
    const dbHealthy = await this.databaseService.healthCheck();
    
    return {
      status: dbHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealthy ? 'up' : 'down',
        api: 'up',
      },
    };
  }

  @Get('database')
  @ApiOperation({ summary: 'Database health check' })
  @ApiResponse({ status: 200, description: 'Database connection status' })
  async checkDatabase() {
    const isHealthy = await this.databaseService.healthCheck();
    
    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      service: 'database',
      timestamp: new Date().toISOString(),
    };
  }
}