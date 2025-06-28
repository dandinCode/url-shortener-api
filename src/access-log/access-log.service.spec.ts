import { Test, TestingModule } from '@nestjs/testing';
import { AccessLogService } from './access-log.service';
import { AccessLogRepository } from './repositories/access-log.repository';
import { AccessLog } from './access-log.entity';

describe('AccessLogService', () => {
  let service: AccessLogService;
  let mockRepository: { createLog: jest.Mock };

  beforeEach(async () => {
    mockRepository = {
      createLog: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessLogService,
        {
          provide: AccessLogRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AccessLogService>(AccessLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call repository.createLog and return the result', async () => {
    const mockData: Partial<AccessLog> = {
      ip: '8.8.8.8',
      city: 'Mountain View',
      country: 'US',
    };

    const mockResult = {
      id: 1,
      ...mockData,
      accessedAt: new Date(),
    } as AccessLog;

    mockRepository.createLog.mockResolvedValue(mockResult);

    const result = await service.logAccess(mockData);
    expect(mockRepository.createLog).toHaveBeenCalledWith(mockData);
    expect(result).toEqual(mockResult);
  });
});