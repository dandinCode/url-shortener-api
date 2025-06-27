import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Req,
    UseGuards,
    Delete,
    Patch,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

@Controller()
export class UrlsController {
    constructor(private readonly urlsService: UrlsService) { }

    @UseGuards(OptionalJwtAuthGuard)
    @Post('urls')
    async create(@Body() dto: CreateUrlDto, @Req() req: Request) {
        const user = req.user as any;
        console.log('req.user', user)
        const result = await this.urlsService.create(dto, user?.id);
        return {
            shortUrl: `${process.env.BASE_URL}/${result.shortCode}`,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get('urls')
    async findMine(@Req() req: Request) {
        const user = req.user as any;
        return this.urlsService.findByOwner(user.id);
    }

    @Get(':shortCode')
    @HttpCode(HttpStatus.FOUND)
    async redirect(@Param('shortCode') shortCode: string, @Req() req: Request) {
        const url = await this.urlsService.redirect(shortCode);
        return {
            statusCode: 302,
            headers: {
                location: url,
            },
        };
    }

    @UseGuards(JwtAuthGuard)
    @Delete('urls/:code')
    async remove(@Param('code') code: string, @Req() req: Request) {
        const user = req.user as any;
        return this.urlsService.remove(code, user.id);
    }
}
