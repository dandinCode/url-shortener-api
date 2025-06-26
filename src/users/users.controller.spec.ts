import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should create a new user', async () => {
    const dto: CreateUserDto = {
      email: 'test@example.com',
      password: '123456',
    };

    const expectedResult = {
      id: 1,
      email: 'test@example.com',
    };

    mockUsersService.create.mockResolvedValueOnce(expectedResult);

    const result = await controller.register(dto);
    expect(result).toEqual(expectedResult);
    expect(usersService.create).toHaveBeenCalledWith(dto);
  });

  it('should throw ConflictException if email already exists', async () => {
    const dto: CreateUserDto = {
      email: 'test@example.com',
      password: '123456',
    };

    mockUsersService.create.mockRejectedValueOnce(new ConflictException('Email já está em uso'));

    await expect(controller.register(dto)).rejects.toThrow(ConflictException);
  });
});
