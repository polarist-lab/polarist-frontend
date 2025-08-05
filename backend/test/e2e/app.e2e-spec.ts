import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { GlobalExceptionFilter } from '../../src/presentation/filters/global-exception.filter';
import { ResponseTransformInterceptor } from '../../src/presentation/interceptors/response.interceptor';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply the same configuration as in main.ts
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhiteListed: true,
      transform: true,
    }));
    
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalInterceptors(new ResponseTransformInterceptor());
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/health (GET)', () => {
    it('should return health status', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.status).toBeDefined();
        });
    });
  });

  describe('Authentication Flow', () => {
    it('should handle mock login', () => {
      return request(app.getHttpServer())
        .get('/auth/mock-login')
        .expect(302); // Redirect
    });
  });

  describe('/users (Protected Routes)', () => {
    beforeAll(async () => {
      // Create a test user and get auth token
      const createUserResponse = await request(app.getHttpServer())
        .post('/users')
        .send({
          googleId: 'test-google-id-e2e',
          email: 'e2e@example.com',
          name: 'E2E Test User',
          locale: 'en',
        })
        .expect(201);

      // Mock getting auth token (in real e2e, you'd use the auth flow)
      // For now, we'll skip the protected route tests
      authToken = 'mock-token';
    });

    it('should create user successfully', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          googleId: 'test-google-id-unique',
          email: 'unique-test@example.com',
          name: 'Unique Test User',
          locale: 'en',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.email).toBe('unique-test@example.com');
        });
    });

    it('should validate user input', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          googleId: '',
          email: 'invalid-email',
          name: '',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.success).toBe(false);
          expect(res.body.error.code).toBe('VALIDATION_ERROR');
        });
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 routes', () => {
      return request(app.getHttpServer())
        .get('/non-existent-route')
        .expect(404);
    });

    it('should handle validation errors', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({})
        .expect(400)
        .expect((res) => {
          expect(res.body.success).toBe(false);
          expect(res.body.error).toBeDefined();
        });
    });
  });
});