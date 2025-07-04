import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UrlRepository } from './repositories/url.repository';
import { CreateUrlDto } from './dto/create-url.dto';
import { randomBytes } from 'crypto';
import { Url } from './url.entity';
import { UpdateUrlDto } from './dto/update-url.dto';
import { AccessLogService } from '../access-log/access-log.service';
import { Request } from 'express';
import * as geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';
import { UrlAccessInfoDto } from './dto/url-access-info.dto';

@Injectable()
export class UrlsService {
    constructor(
        private readonly urlRepository: UrlRepository,
        private readonly accessLogService: AccessLogService,
    ) { }

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

    async update(code: string, userId: number, dto: UpdateUrlDto): Promise<void> {
        const url = await this.urlRepository.findByShortCode(code);

        if (!url || url.ownerId !== userId) {
            throw new ForbiddenException('Acesso negado');
        }

        await this.urlRepository.updateUrl(url.id, dto.originalUrl);
    }

    async findByOwner(userId: number): Promise<Url[]> {
        return this.urlRepository.findByOwner(userId);
    }

    async redirect(shortCode: string, req: Request): Promise<string> {
        const url = await this.urlRepository.findByShortCode(shortCode);
        if (!url) throw new NotFoundException('URL não encontrada');

        const ip = req.headers['x-forwarded-for']?.toString().split(',')[0].trim() || req.ip || '';
        const geo = geoip.lookup(ip) || {};

        const parser = new UAParser(req.headers['user-agent']);
        const ua = parser.getResult();

        await this.accessLogService.logAccess({
            url,
            ip,
            userAgent: req.headers['user-agent'],
            city: geo.city || null,
            region: geo.region || null,
            country: geo.country || null,
            latitude: geo.ll?.[0] || null,
            longitude: geo.ll?.[1] || null,
            os: ua.os.name,
            browser: ua.browser.name,
            device: parser.getDevice().type || 'desktop',
        });

        await this.urlRepository.incrementClicks(url.id);
        return url.originalUrl;
    }

    async getAccessLogsByUser(userId: number): Promise<UrlAccessInfoDto[]> {
        const urls = await this.urlRepository.findByOwner(userId);
        const result: UrlAccessInfoDto[] = [];

        for (const url of urls) {
            const logs = await this.accessLogService.findByUrlId(url.id);

            const grouped = logs.reduce((acc, log) => {
                const key = log.ip || 'unknown';
                if (!acc[key]) {
                    acc[key] = {
                        ip: log.ip,
                        city: log.city,
                        region: log.region,
                        country: log.country,
                        os: log.os,
                        browser: log.browser,
                        device: log.device,
                        clicks: 0,
                    };
                }
                acc[key].clicks++;
                return acc;
            }, {} as Record<string, any>);

            result.push({
                shortCode: url.shortCode,
                originalUrl: url.originalUrl,
                totalClicks: url.clicks,
                accessByUser: Object.values(grouped),
            });
        }
        return result;
    }

    async remove(code: string, userId: number): Promise<void> {
        const url = await this.urlRepository.findByShortCode(code);
        if (!url || url.ownerId !== userId) throw new ForbiddenException('Acesso negado');
        await this.urlRepository.deleteUrl(code);
    }
}