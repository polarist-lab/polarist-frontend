import { validate } from 'class-validator';
import { CreateUserDto } from '../users/create-user.dto';

describe('CreateUserDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = new CreateUserDto();
    dto.googleId = 'google-123';
    dto.email = 'test@example.com';
    dto.name = 'Test User';
    dto.avatar = 'https://example.com/avatar.jpg';
    dto.locale = 'en';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation with invalid email', async () => {
    const dto = new CreateUserDto();
    dto.googleId = 'google-123';
    dto.email = 'invalid-email';
    dto.name = 'Test User';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
  });

  it('should fail validation with empty name', async () => {
    const dto = new CreateUserDto();
    dto.googleId = 'google-123';
    dto.email = 'test@example.com';
    dto.name = '';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('name');
  });

  it('should fail validation with invalid locale', async () => {
    const dto = new CreateUserDto();
    dto.googleId = 'google-123';
    dto.email = 'test@example.com';
    dto.name = 'Test User';
    dto.locale = 'invalid';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('locale');
  });
});