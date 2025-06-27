import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from './repositories/user.repository';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: jest.Mocked<UserRepository>;

  const mockUserRepository = {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(UserRepository);
    jest.clearAllMocks(); 
  });

  it('should throw if email already exists', async () => {
    userRepository.findByEmail.mockResolvedValueOnce({ id: 1 } as User);

    await expect(
      service.create({ email: 'test@email.com', password: '123456' }),
    ).rejects.toThrow(ConflictException);
  });

  it('should create user if email does not exist', async () => {
    userRepository.findByEmail.mockResolvedValueOnce(null);
    userRepository.createUser.mockResolvedValueOnce({
      id: 1,
      email: 'novo@email.com',
      password: 'hash',
    } as User);

    const result = await service.create({
      email: 'novo@email.com',
      password: '123456',
    });

    expect(result).toEqual({
      id: 1,
      email: 'novo@email.com',
    });
  });

  it('should return user by email', async () => {
    const user = { id: 1, email: 'a@b.com', password: 'hash' } as User;
    userRepository.findByEmail.mockResolvedValueOnce(user);

    const result = await service.findByEmail('a@b.com');
    expect(result).toEqual(user);
  });

  it('should throw NotFoundException if user not found by id', async () => {
    userRepository.findById.mockResolvedValueOnce(null);

    await expect(service.findById(99)).rejects.toThrow(NotFoundException);
  });
});
