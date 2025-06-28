import { IsUrl, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty({
    example: 'https://youtube.com',
    description: 'URL original que será encurtada',
  })
  @IsUrl()
  @IsNotEmpty()
  originalUrl: string;
}