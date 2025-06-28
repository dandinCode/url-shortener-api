import { Injectable } from '@nestjs/common';
import { AccessLogRepository } from './repositories/access-log.repository';
import { AccessLog } from './access-log.entity';

@Injectable()
export class AccessLogService {
    constructor(private readonly repository: AccessLogRepository) { }

    async logAccess(data: Partial<AccessLog>): Promise<AccessLog> {
        return this.repository.createLog(data);
    }

    async findByUrlId(urlId: number): Promise<AccessLog[]> {
        return this.repository.findByUrlId(urlId);
    }
}