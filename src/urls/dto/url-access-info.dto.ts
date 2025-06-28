import { ApiProperty } from '@nestjs/swagger';

export class AccessByUserDto {
    @ApiProperty({ description: 'Endereço IP do usuário' })
    ip: string;

    @ApiProperty({ description: 'Cidade do acesso', required: false })
    city?: string;

    @ApiProperty({ description: 'Região ou estado do acesso', required: false })
    region?: string;

    @ApiProperty({ description: 'País do acesso', required: false })
    country?: string;

    @ApiProperty({ description: 'Sistema operacional do dispositivo', required: false })
    os?: string;

    @ApiProperty({ description: 'Navegador utilizado', required: false })
    browser?: string;

    @ApiProperty({ description: 'Tipo de dispositivo (desktop, mobile, etc.)', required: false })
    device?: string;

    @ApiProperty({ description: 'Número de cliques a partir deste IP' })
    clicks: number;
}

export class UrlAccessInfoDto {
    @ApiProperty({ description: 'Código curto da URL' })
    shortCode: string;

    @ApiProperty({ description: 'URL original completa' })
    originalUrl: string;

    @ApiProperty({ description: 'Total de cliques na URL' })
    totalClicks: number;

    @ApiProperty({ type: [AccessByUserDto], description: 'Detalhes de acesso agrupados por usuário/IP' })
    accessByUser: AccessByUserDto[];
}