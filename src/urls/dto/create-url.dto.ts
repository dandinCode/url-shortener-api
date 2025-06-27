import { IsUrl, IsOptional } from 'class-validator';

export class CreateUrlDto {
  @IsUrl()
  originalUrl: string;
}