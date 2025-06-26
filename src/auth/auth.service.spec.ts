import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'signed_token'),
  };

  let mockUser;

  beforeEach(async () => {
    mockUser = {
      id: 1,
      email: 'test@example.com',
      password: await bcrypt.hash('123456', 10), // ✅ criptografado corretamente aqui
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should validate a user with correct credentials', async () => {
    mockUsersService.findByEmail.mockResolvedValueOnce(mockUser);

    const result = await service.validateUser('test@example.com', '123456');
    expect(result.email).toEqual(mockUser.email);
    expect(result.password).toBeUndefined();
  });

  it('should throw if password is wrong', async () => {
    mockUsersService.findByEmail.mockResolvedValueOnce(mockUser);
    await expect(service.validateUser('test@example.com', 'wrong'))
      .rejects
      .toThrow(UnauthorizedException);
  });

  it('should return access_token on login', async () => {
    const result = await service.login({ id: 1, email: 'test@example.com' });
    expect(result).toEqual({ access_token: 'signed_token' });
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: 1,
      email: 'test@example.com',
    });
  });
});
