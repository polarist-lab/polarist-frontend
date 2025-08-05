import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL || 'data/sqlite.db',
  type: 'sqlite',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  migrations: {
    dir: 'src/infrastructure/database/drizzle/migrations',
  },
}));