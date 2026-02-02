import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as argon2 from 'argon2';

// We mock PrismaService to avoid needing a real DB connection for these E2E tests
// This focuses on testing the HTTP layer, Guards, and Pipes.
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    
    // Enable cookie parser (required for csrf-csrf)
    app.use(require('cookie-parser')());
    
    await app.init();
    prisma = moduleFixture.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Helper to get CSRF token
  const getCsrfToken = async () => {
    const response = await request(app.getHttpServer()).get('/csrf/token');
    return response.body.csrfToken;
  };

  describe('/auth/signup (POST)', () => {
    it('should create a new user', async () => {
      const csrfToken = await getCsrfToken();
      const createUserDto = { username: 'e2euser', password: 'password123' };
      
      // Mock finding user (not found)
      prisma.user.findUnique.mockResolvedValue(null);
      
      // Mock creating user
      prisma.user.create.mockImplementation(async (args) => ({
        id: '123',
        username: args.data.username,
        password: args.data.password,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      // We need to pass the CSRF token in header
      return request(app.getHttpServer())
        .post('/auth/signup')
        .set('x-csrf-token', csrfToken)
        .send(createUserDto)
        .expect(201)
        .expect((res) => {
          expect(res.body.message).toBe('User created successfully');
          expect(res.body.user).toHaveProperty('id');
          expect(res.body.user.username).toBe('e2euser');
        });
    });

    it('should fail without CSRF token', async () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({ username: 'nouser', password: 'pass' })
        .expect(403);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should return JWT token on success', async () => {
      const csrfToken = await getCsrfToken();
      const loginDto = { username: 'existing', password: 'password' };
      
      const hashedPassword = await argon2.hash('password');
      prisma.user.findUnique.mockResolvedValue({
        id: '1',
        username: 'existing',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return request(app.getHttpServer())
        .post('/auth/login')
        .set('x-csrf-token', csrfToken)
        .send(loginDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body.user.username).toBe('existing');
        });
    });

    it('should fail with invalid credentials', async () => {
      const csrfToken = await getCsrfToken();
       prisma.user.findUnique.mockResolvedValue(null);

       return request(app.getHttpServer())
        .post('/auth/login')
        .set('x-csrf-token', csrfToken)
        .send({ username: 'unknown', password: 'bad' })
        .expect(401);
    });
  });

  describe('/auth/profile (GET)', () => {
    it('should return profile for authenticated user', async () => {
      const csrfToken = await getCsrfToken();
      
      // 1. Login to get token
      const hashedPassword = await argon2.hash('password');
      prisma.user.findUnique.mockResolvedValue({
        id: '1',
        username: 'test',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .set('x-csrf-token', csrfToken)
        .send({ username: 'test', password: 'password' });
      
      const token = loginRes.body.access_token;

      // 2. Access profile
      // Mock findById for JwtStrategy
      prisma.user.findUnique.mockResolvedValue({
        id: '1',
        username: 'test',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.username).toBe('test');
        });
    });
  });
});
