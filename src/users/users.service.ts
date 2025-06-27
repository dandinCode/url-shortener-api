import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existing = await this.userRepo.findByEmail(createUserDto.email);
    if (existing) throw new ConflictException('Email já está em uso');

    const hash = await bcrypt.hash(createUserDto.password, 10);
    const saved = await this.userRepo.createUser({
      email: createUserDto.email,
      password: hash,
    });

    const { password, ...result } = saved;
    return result;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }
}
