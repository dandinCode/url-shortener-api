import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UrlRepository } from './repositories/url.repository';
import { CreateUrlDto } from './dto/create-url.dto';
import { randomBytes } from 'crypto';
import { Url } from './url.entity';

@Injectable()
export class UrlsService {
    constructor(private readonly urlRepository: UrlRepository) { }

    private generateShortCode(length = 6): string {
        return randomBytes(length).toString('base64url').slice(0, length);
    }

    async create(dto: CreateUrlDto, userId?: number): Promise<Url> {
        const shortCode = this.generateShortCode();
        return this.urlRepository.createUrl({
            originalUrl: dto.originalUrl,
            shortCode,
            ownerId: userId || null,
        });
    }

    async findByOwner(userId: number): Promise<Url[]> {
        return this.urlRepository.findByOwner(userId);
    }

    async redirect(shortCode: string): Promise<string> {
        const url = await this.urlRepository.findByShortCode(shortCode);
        if (!url) throw new NotFoundException('URL não encontrada');
        await this.urlRepository.incrementClicks(url.id);
        return url.originalUrl;
    }

    async remove(code: string, userId: number): Promise<void> {
        const url = await this.urlRepository.findByShortCode(code);
        console.log('Tentando deletar URL:', {
            code,
            urlOwner: url?.ownerId,
            userId,
        });
        if (!url || url.ownerId !== userId) throw new ForbiddenException('Acesso negado');
        await this.urlRepository.deleteUrl(code);
    }
}
