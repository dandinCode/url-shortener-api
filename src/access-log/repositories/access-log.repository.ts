import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessLog } from '../access-log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccessLogRepository {
    constructor(
        @InjectRepository(AccessLog)
        private readonly repo: Repository<AccessLog>,
    ) { }

    async createLog(data: Partial<AccessLog>): Promise<AccessLog> {
        const log = this.repo.create(data);
        return this.repo.save(log);
    }

    async findByUrlId(urlId: number): Promise<AccessLog[]> {
        return this.repo.find({
            where: { url: { id: urlId } },
        });
    }
}