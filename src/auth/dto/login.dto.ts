import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'usuario@email.com',
    description: 'E-mail do usuário',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'p4ssw0rd',
    description: 'Senha do usuário (mínimo 6 caracteres)',
  })
  @IsString()
  @MinLength(6)
  password: string;
}