import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Controller('health')
export class HealthController {
  constructor(private db: DatabaseService) {}

  @Get()
  async getHealth() {
    try {
      // Test database connection by selecting from users table
      const { users } = await import('../database/schema');
      await this.db.db.select().from(users).limit(1);
      
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0',
        database: 'connected',
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
        },
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get('api')
  async getApiStatus() {
    return {
      status: 'ok',
      message: 'Polarist Backend API is running',
      endpoints: {
        auth: '/api/auth',
        users: '/api/users',
        progress: '/api/progress',
        health: '/api/health',
      },
      documentation: 'See API_DOCUMENTATION.md for detailed API documentation',
    };
  }
}