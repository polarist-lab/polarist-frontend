export class TestHelpers {
  static async createTestUser(app: INestApplication, userData?: Partial<any>) {
    const defaultUser = {
      googleId: `test-${Date.now()}`,
      email: `test-${Date.now()}@example.com`,
      name: 'Test User',
      locale: 'en',
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ ...defaultUser, ...userData })
      .expect(201);

    return response.body.data;
  }

  static async generateJwtToken(app: INestApplication, userId: number): Promise<string> {
    const authService = app.get(AuthService);
    return authService.generateToken({ userId, sub: userId });
  }

  static async cleanupTestData(app: INestApplication) {
    const databaseService = app.get(DatabaseService);
    // 테스트 데이터 정리
    await databaseService.db.delete(users).where(like(users.email, 'test-%@example.com'));
  }
}