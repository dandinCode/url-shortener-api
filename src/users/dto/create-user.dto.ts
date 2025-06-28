import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        example: 'usuario@email.com',
        description: 'E-mail único para cadastro',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'p4ssw0rd',
        description: 'Senha com no mínimo 6 caracteres',
    })
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}