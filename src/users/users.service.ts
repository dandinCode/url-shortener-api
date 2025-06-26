import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
        const existing = await this.usersRepository.findOneBy({ email: createUserDto.email });
        if (existing) throw new ConflictException('Email já está em uso');

        const hash = await bcrypt.hash(createUserDto.password, 10);
        const user = this.usersRepository.create({
        email: createUserDto.email,
        password: hash,
        });

        const saved = await this.usersRepository.save(user);
        const { password, ...result } = saved;
        return result;
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.usersRepository.findOneBy({ email });
        if (!user) throw new NotFoundException('Usuário não encontrado');
        return user;
    }

    async findById(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id }, relations: ['urls'] });
        if (!user) throw new NotFoundException('Usuário não encontrado');
        return user;
    }
} 