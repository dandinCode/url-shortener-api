import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('Auth E2E', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register and login a user', async () => {
    const user = {
      email: `test${Date.now()}@email.com`,
      password: '123456',
    };

    const registerResponse = await request(app.getHttpServer())
      .post('/users')
      .send(user)
      .expect(201);

    expect(registerResponse.body.email).toBe(user.email);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(user)
      .expect(201);

    expect(loginResponse.body).toHaveProperty('access_token');
    accessToken = loginResponse.body.access_token;
  });

  it('should allow creating and redirecting short URL without login', async () => {
    const res = await request(app.getHttpServer())
      .post('/urls')
      .send({ originalUrl: 'https://nestjs.com' })
      .expect(201);

    expect(res.body.shortUrl).toMatch(/http:\/\/localhost:3000\//);

    const code = res.body.shortUrl.split('/').pop();
    await request(app.getHttpServer())
      .get(`/urls/${code}`)
      .set('User-Agent', 'e2e-test-agent')
      .set('Accept-Language', 'pt-BR')
      .set('x-forwarded-for', '8.8.8.8')
      .expect(302);
  });

  it('should allow logged user to create and list URLs', async () => {
    const create = await request(app.getHttpServer())
      .post('/urls')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ originalUrl: 'https://nestjs.com/docs' })
      .expect(201);

    expect(create.body.shortUrl).toBeDefined();

    const list = await request(app.getHttpServer())
      .get('/urls')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(list.body)).toBe(true);
  });

  it('should allow logged user to update own URL', async () => {
    const create = await request(app.getHttpServer())
      .post('/urls')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ originalUrl: 'https://nestjs.com/update' })
      .expect(201);

    const code = create.body.shortUrl.split('/').pop();
    expect(code).toBeDefined();

    const update = await request(app.getHttpServer())
      .patch(`/urls/${code}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ originalUrl: 'https://nestjs.com/atualizado' })
      .expect(200);

    expect(update.body).toEqual({ message: 'URL atualizada com sucesso' });

    const list = await request(app.getHttpServer())
      .get('/urls')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const updatedUrl = list.body.find((url: any) => url.shortCode === code);
    expect(updatedUrl.originalUrl).toBe('https://nestjs.com/atualizado');
  });

  it('should allow logged user to delete own URL', async () => {
    const create = await request(app.getHttpServer())
      .post('/urls')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ originalUrl: 'https://nestjs.com/delete' })
      .expect(201);
    const code = create.body.shortUrl.split('/').pop();

    await request(app.getHttpServer())
      .delete(`/urls/${code}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('should return access logs for logged user', async () => {
    const create = await request(app.getHttpServer())
      .post('/urls')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ originalUrl: 'https://nestjs.com/accesslog' })
      .expect(201);

    const code = create.body.shortUrl.split('/').pop();

    await request(app.getHttpServer())
      .get(`/urls/${code}`)
      .set('User-Agent', 'e2e-test-agent')
      .set('Accept-Language', 'pt-BR')
      .set('x-forwarded-for', '1.2.3.4')
      .expect(302);

    await new Promise((r) => setTimeout(r, 500));

    const logs = await request(app.getHttpServer())
      .get('/urls/access-logs')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(logs.body)).toBe(true);
    expect(logs.body.length).toBeGreaterThan(0);

    const logEntry = logs.body.find((entry: any) => entry.shortCode === code);
    expect(logEntry).toBeDefined();
    expect(logEntry.accessByUser.length).toBeGreaterThan(0);
    expect(logEntry.accessByUser[0].ip).toBe('1.2.3.4');
    expect(logEntry.accessByUser[0].clicks).toBe(1);
  });
});