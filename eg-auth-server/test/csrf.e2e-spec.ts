import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('CsrfController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(require('cookie-parser')());
    await app.init();
  });

  it('/csrf/token (GET) should return a token', () => {
    return request(app.getHttpServer())
      .get('/csrf/token')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('csrfToken');
        expect(typeof res.body.csrfToken).toBe('string');
      });
  });
});
