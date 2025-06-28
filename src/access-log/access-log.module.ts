import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessLog } from './access-log.entity';
import { AccessLogService } from './access-log.service';
import { AccessLogRepository } from './repositories/access-log.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AccessLog])],
  providers: [AccessLogService, AccessLogRepository],
  exports: [AccessLogService],
})
export class AccessLogModule { }
