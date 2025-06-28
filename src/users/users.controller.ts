import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiOperation({ summary: 'Registra um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 409, description: 'E-mail já está em uso' })
  @ApiBody({ type: CreateUserDto })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}