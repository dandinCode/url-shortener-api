import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should return access_token on successful login', async () => {
    const dto = { email: 'test@example.com', password: '123456' };
    const user = { id: 1, email: dto.email };
    const token = { access_token: 'mock_token' };

    mockAuthService.validateUser.mockResolvedValueOnce(user);
    mockAuthService.login.mockResolvedValueOnce(token);

    const result = await controller.login(dto);
    expect(result).toEqual(token);
    expect(authService.validateUser).toHaveBeenCalledWith(dto.email, dto.password);
    expect(authService.login).toHaveBeenCalledWith(user);
  });

  it('should throw if validateUser fails', async () => {
    const dto = { email: 'fail@email.com', password: 'wrong' };
    mockAuthService.validateUser.mockRejectedValueOnce(new UnauthorizedException());

    await expect(controller.login(dto)).rejects.toThrow(UnauthorizedException);
  });
});
