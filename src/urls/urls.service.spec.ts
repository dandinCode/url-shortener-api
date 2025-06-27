import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from './urls.service';
import { UrlRepository } from './repositories/url.repository';
import { CreateUrlDto } from './dto/create-url.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

const mockRepo = {
  createUrl: jest.fn(),
  findByShortCode: jest.fn(),
  incrementClicks: jest.fn(),
  deleteUrl: jest.fn(),
  findByOwner: jest.fn(),
};

describe('UrlsService', () => {
  let service: UrlsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlsService, { provide: UrlRepository, useValue: mockRepo }],
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

    const result = await service.redirect('abc123');
    expect(mockRepo.incrementClicks).toHaveBeenCalledWith(1);
    expect(result).toBe('https://google.com');
  });

  it('should throw if url not found on redirect', async () => {
    mockRepo.findByShortCode.mockResolvedValue(null);
    await expect(service.redirect('fail')).rejects.toThrow(NotFoundException);
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
});
