import { Test, TestingModule } from '@nestjs/testing';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Request } from 'express';
import { UrlAccessInfoDto } from './dto/url-access-info.dto';

describe('UrlsController', () => {
  let controller: UrlsController;
  let service: UrlsService;

  const mockService = {
    create: jest.fn(),
    redirect: jest.fn(),
    findByOwner: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getAccessLogsByUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlsController],
      providers: [{ provide: UrlsService, useValue: mockService }],
    }).compile();

    controller = module.get<UrlsController>(UrlsController);
    service = module.get<UrlsService>(UrlsService);
  });

  it('should create a short URL', async () => {
    mockService.create.mockResolvedValue({ shortCode: 'abc123' });
    const req = { user: { id: 1 } } as unknown as Request;
    const dto: CreateUrlDto = { originalUrl: 'https://nestjs.com' };

    const result = await controller.create(dto, req);

    expect(result.shortUrl).toContain('/abc123');
    expect(mockService.create).toHaveBeenCalledWith(dto, 1);
  });

  it('should redirect to original URL', async () => {
    mockService.redirect.mockResolvedValue('https://nestjs.com');
    const req = {} as Request;

    const result = await controller.redirect('abc123', req);

    expect(result.headers.location).toBe('https://nestjs.com');
  });

  it('should list users URLs', async () => {
    const urls = [{ id: 1, shortCode: 'abc123' }];
    mockService.findByOwner.mockResolvedValue(urls);
    const req = { user: { id: 1 } } as unknown as Request;

    const result = await controller.findMine(req);

    expect(result).toBe(urls);
    expect(mockService.findByOwner).toHaveBeenCalledWith(1);
  });

  it('should call urlsService.update with correct values', async () => {
    const code = 'xyz789';
    const userId = 1;
    const dto = { originalUrl: 'https://novaurl.com' };

    const req = {
      user: { id: userId },
    } as any;

    const updateSpy = jest.spyOn(service, 'update').mockResolvedValue();

    const result = await controller.update(code, req, dto);

    expect(updateSpy).toHaveBeenCalledWith(code, userId, dto);
    expect(result).toEqual({ message: 'URL atualizada com sucesso' });
  });

  it('should remove a URL owned by the user', async () => {
    const req = { user: { id: 1 } } as unknown as Request;
    await controller.remove('abc123', req);
    expect(mockService.remove).toHaveBeenCalledWith('abc123', 1);
  });

  it('should get access logs grouped by user', async () => {
    const fakeLogs: UrlAccessInfoDto[] = [
      {
        shortCode: 'abc123',
        originalUrl: 'https://example.com',
        totalClicks: 5,
        accessByUser: [
          {
            ip: '123.45.67.89',
            clicks: 3,
            city: 'São Paulo',
            region: 'SP',
            country: 'BR',
            os: 'Windows',
            browser: 'Chrome',
            device: 'desktop',
          },
        ],
      },
    ];
    mockService.getAccessLogsByUser.mockResolvedValue(fakeLogs);

    const req = { user: { id: 1 } } as unknown as Request;

    const result = await controller.getLogs(req);

    expect(result).toBe(fakeLogs);
    expect(mockService.getAccessLogsByUser).toHaveBeenCalledWith(1);
  });
});