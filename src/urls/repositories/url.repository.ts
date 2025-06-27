import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Url } from '../url.entity';
import { Repository, IsNull } from 'typeorm';

@Injectable()
export class UrlRepository {
  constructor(
    @InjectRepository(Url)
    private repository: Repository<Url>,
  ) { }

  async findByShortCode(code: string): Promise<Url | null> {
    return this.repository.findOneBy({ shortCode: code, deletedAt: IsNull() });
  }

  async findByOwner(ownerId: number): Promise<Url[]> {
    return this.repository.find({ where: { ownerId, deletedAt: IsNull() } });
  }

  async createUrl(data: Partial<Url>): Promise<Url> {
    const url = this.repository.create(data);
    return this.repository.save(url);
  }

  async updateUrl(id: number, data: Partial<Url>): Promise<void> {
    await this.repository.update({ id }, data);
  }

  async deleteUrl(shortCode: string): Promise<void> {
    await this.repository.update({ shortCode }, { deletedAt: new Date() });
  }

  async incrementClicks(id: number): Promise<void> {
    await this.repository.increment({ id }, 'clicks', 1);
  }
}