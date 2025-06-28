import { IsUrl, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUrlDto {
    @ApiProperty({
        example: 'https://nova-url.com',
        description: 'Nova URL de destino',
    })
    @IsUrl()
    @IsNotEmpty()
    originalUrl: string;
}