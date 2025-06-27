import { IsUrl, IsNotEmpty } from 'class-validator';

export class UpdateUrlDto {
    @IsNotEmpty()
    @IsUrl()
    originalUrl: string;
}