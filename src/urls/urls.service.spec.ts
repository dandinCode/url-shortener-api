import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from './urls.service';
import { UrlRepository } from './repositories/url.repository';
import { CreateUrlDto } from './dto/create-url.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateUrlDto } from './dto/update-url.dto';
import { Request } from 'express';
import { AccessLogService } from '../access-log/access-log.service';

const mockRepo = {
  createUrl: jest.fn(),
  findByShortCode: jest.fn(),
  incrementClicks: jest.fn(),
  updateUrl: jest.fn(),
  deleteUrl: jest.fn(),
  findByOwner: jest.fn(),
};

const mockAccessLogService = {
  logAccess: jest.fn(),
  findByUrlId: jest.fn(),
};

describe('UrlsService', () => {
  let service: UrlsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlsService, { provide: UrlRepository, useValue: mockRepo }, { provide: AccessLogService, useValue: mockAccessLogService }],
    }).compile();

    service = module.get<UrlsService>(UrlsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create a url', async () => {
    const dto: CreateUrlDto = { originalUrl: 'https://google.com' };
    mockRepo.createUrl.mockResolvedValue({ shortCode: 'abc123' });

    const result = await service.create(dto, 1);
    expect(mockRepo.createUrl).toHaveBeenCalledWith(expect.objectContaining({
      originalUrl: dto.originalUrl,
      ownerId: 1,
    }));
    expect(result.shortCode).toBeDefined();
  });

  it('should redirect and count click', async () => {
    mockRepo.findByShortCode.mockResolvedValue({ id: 1, originalUrl: 'https://google.com' });
    mockRepo.incrementClicks.mockResolvedValue(undefined);

    const mockRequest: Partial<Request> = {
      ip: '8.8.8.8',
      headers: {
        'user-agent': 'jest-test-agent',
        'accept-language': 'en-US,en;q=0.9',
      },
    };

    const result = await service.redirect('abc123', mockRequest as Request);

    expect(mockRepo.incrementClicks).toHaveBeenCalledWith(1);
    expect(result).toBe('https://google.com');
  });

  it('should throw if url not found on redirect', async () => {
    mockRepo.findByShortCode.mockResolvedValue(null);

    const mockRequest: Partial<Request> = {
      ip: '8.8.8.8',
      headers: {},
    };

    await expect(service.redirect('fail', mockRequest as Request)).rejects.toThrow(NotFoundException);
  });


  it('should update url if user is owner', async () => {
    const url = { id: 1, ownerId: 1, shortCode: 'abc123' };
    const dto: UpdateUrlDto = { originalUrl: 'https://nova-url.com' };

    mockRepo.findByShortCode.mockResolvedValue(url);
    mockRepo.updateUrl.mockResolvedValue(undefined);

    await service.update('abc123', 1, dto);

    expect(mockRepo.findByShortCode).toHaveBeenCalledWith('abc123');
    expect(mockRepo.updateUrl).toHaveBeenCalledWith(url.id, dto.originalUrl);
  });

  it('should throw ForbiddenException if user is not owner', async () => {
    const url = { id: 1, ownerId: 2, shortCode: 'abc123' };
    const dto: UpdateUrlDto = { originalUrl: 'https://nova-url.com' };

    mockRepo.findByShortCode.mockResolvedValue(url);

    await expect(service.update('abc123', 1, dto)).rejects.toThrow(ForbiddenException);
    expect(mockRepo.updateUrl).not.toHaveBeenCalled();
  });

  it('should throw ForbiddenException if url not found', async () => {
    const dto: UpdateUrlDto = { originalUrl: 'https://nova-url.com' };

    mockRepo.findByShortCode.mockResolvedValue(null);

    await expect(service.update('abc123', 1, dto)).rejects.toThrow(ForbiddenException);
    expect(mockRepo.updateUrl).not.toHaveBeenCalled();
  });

  it('should remove own url', async () => {
    mockRepo.findByShortCode.mockResolvedValue({ ownerId: 1 });
    await service.remove('abc123', 1);
    expect(mockRepo.deleteUrl).toHaveBeenCalledWith('abc123');
  });

  it('should forbid deletion of another users url', async () => {
    mockRepo.findByShortCode.mockResolvedValue({ ownerId: 2 });
    await expect(service.remove('abc123', 1)).rejects.toThrow(ForbiddenException);
  });

  it('should return access logs grouped by IP for user URLs', async () => {
    mockRepo.findByOwner.mockResolvedValue([
      { id: 1, shortCode: 'abc123', originalUrl: 'https://site.com', clicks: 5 },
      { id: 2, shortCode: 'def456', originalUrl: 'https://outro.com', clicks: 3 },
    ]);

    mockAccessLogService.findByUrlId = jest.fn()
      .mockResolvedValueOnce([
        { ip: '1.1.1.1', city: 'City1', region: 'Region1', country: 'BR', os: 'Windows', browser: 'Chrome', device: 'desktop' },
        { ip: '1.1.1.1', city: 'City1', region: 'Region1', country: 'BR', os: 'Windows', browser: 'Chrome', device: 'desktop' },
        { ip: '2.2.2.2', city: 'City2', region: 'Region2', country: 'BR', os: 'Linux', browser: 'Firefox', device: 'mobile' },
      ])
      .mockResolvedValueOnce([]);

    const result = await service.getAccessLogsByUser(1);

    expect(mockRepo.findByOwner).toHaveBeenCalledWith(1);
    expect(mockAccessLogService.findByUrlId).toHaveBeenCalledTimes(2);

    expect(result).toEqual([
      {
        shortCode: 'abc123',
        originalUrl: 'https://site.com',
        totalClicks: 5,
        accessByUser: [
          {
            ip: '1.1.1.1',
            city: 'City1',
            region: 'Region1',
            country: 'BR',
            os: 'Windows',
            browser: 'Chrome',
            device: 'desktop',
            clicks: 2,
          },
          {
            ip: '2.2.2.2',
            city: 'City2',
            region: 'Region2',
            country: 'BR',
            os: 'Linux',
            browser: 'Firefox',
            device: 'mobile',
            clicks: 1,
          },
        ],
      },
      {
        shortCode: 'def456',
        originalUrl: 'https://outro.com',
        totalClicks: 3,
        accessByUser: [],
      },
    ]);
  });
});