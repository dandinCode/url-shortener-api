import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';

describe('Auth E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
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
      email: 'e2e@email.com',
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
  });
});
