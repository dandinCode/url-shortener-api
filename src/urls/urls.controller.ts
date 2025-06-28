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
import { UpdateUrlDto } from './dto/update-url.dto';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiParam,
} from '@nestjs/swagger';

@ApiTags('urls')
@Controller('urls')
export class UrlsController {
    constructor(private readonly urlsService: UrlsService) { }

    @UseGuards(OptionalJwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Encurtar uma nova URL (com ou sem autenticação)' })
    @ApiResponse({ status: 201, description: 'URL encurtada com sucesso' })
    @ApiBody({ type: CreateUrlDto })
    async create(@Body() dto: CreateUrlDto, @Req() req: Request) {
        const user = req.user as any;
        const result = await this.urlsService.create(dto, user?.id);
        return {
            shortUrl: `${process.env.BASE_URL}/${result.shortCode}`,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Listar URLs do usuário autenticado' })
    @ApiResponse({ status: 200, description: 'Lista de URLs do usuário' })
    async findMine(@Req() req: Request) {
        const user = req.user as any;
        return this.urlsService.findByOwner(user.id);
    }

    @Get(':shortCode')
    @HttpCode(HttpStatus.FOUND)
    @ApiOperation({ summary: 'Redirecionar URL encurtada' })
    @ApiResponse({ status: 302, description: 'Redirecionamento realizado' })
    @ApiParam({ name: 'shortCode', description: 'Código curto da URL encurtada' })
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
    @Patch(':code')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Atualizar a URL de destino' })
    @ApiResponse({ status: 200, description: 'URL atualizada com sucesso' })
    @ApiParam({ name: 'code', description: 'Código da URL encurtada' })
    @ApiBody({ type: UpdateUrlDto })
    async update(
        @Param('code') code: string,
        @Req() req: Request,
        @Body() dto: UpdateUrlDto,
    ) {
        const user = req.user as any;
        await this.urlsService.update(code, user.id, dto);
        return { message: 'URL atualizada com sucesso' };
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':code')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Deletar uma URL do usuário autenticado' })
    @ApiResponse({ status: 200, description: 'URL deletada com sucesso' })
    @ApiParam({ name: 'code', description: 'Código da URL encurtada' })
    async remove(@Param('code') code: string, @Req() req: Request) {
        const user = req.user as any;
        return this.urlsService.remove(code, user.id);
    }
}