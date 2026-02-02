import { Test, TestingModule } from '@nestjs/testing';
import { CsrfService } from './csrf.service';
import { ConfigService } from './config.service';

const mockConfigService = {
  csrfSecret: 'test-secret-unused-in-mock',
  isProduction: false,
};

// We need to mock double-csrf since it returns functions
jest.mock('csrf-csrf', () => ({
  doubleCsrf: jest.fn(() => ({
    generateCsrfToken: jest.fn(() => 'mock-token'),
    validateRequest: jest.fn(() => true),
    doubleCsrfProtection: jest.fn(
      (_req: unknown, _res: unknown, next: () => void) => next(),
    ),
  })),
}));

describe('CsrfService', () => {
  let service: CsrfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CsrfService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<CsrfService>(CsrfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a token', () => {
    const req = {} as import('express').Request;
    const res = {} as import('express').Response;
    const token = service.generateToken(req, res);
    expect(token).toBe('mock-token');
  });

  it('should validate a token', () => {
    const req = {} as import('express').Request;
    expect(service.validateToken(req)).toBe(true);
  });
});
