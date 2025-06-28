import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './url.entity';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { UrlRepository } from './repositories/url.repository';
import { AccessLogModule } from '../access-log/access-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([Url]), AccessLogModule],
  controllers: [UrlsController],
  providers: [UrlsService, UrlRepository],
})
export class UrlsModule { }
