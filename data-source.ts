import { DataSource } from 'typeorm';
import { User } from './src/users/user.entity';
import { Url } from './src/urls/url.entity';
import * as dotenv from 'dotenv';
import { AccessLog } from './src/access-log/access-log.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'url_shortener',
  entities: [User, Url, AccessLog],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
