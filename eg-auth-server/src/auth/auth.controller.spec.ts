/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/require-await */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CsrfGuard } from '../common/csrf.guard';

const mockAuthService = {
  login: jest.fn(),
  signup: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    })
      .overrideGuard(CsrfGuard) // Mock the guard to avoid complex setup
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return login response and set cookie', () => {
      const req = { user: { id: '1', email: 'test' } };
      const expectedResponse = { access_token: 'token', user: req.user };
      const expectedResult = { user: req.user };
      const mockRes = {
        cookie: jest.fn(),
      } as unknown as import('express').Response;

      mockAuthService.login.mockReturnValue(expectedResponse);

      const result = controller.login(
        req as Parameters<typeof controller.login>[0],
        mockRes,
      );
      expect(result).toEqual(expectedResult);
      expect(mockAuthService.login).toHaveBeenCalledWith(req.user);
      expect(mockRes.cookie).toHaveBeenCalledWith(
        'access_token',
        'token',
        expect.any(Object),
      );
    });
  });

  describe('signup', () => {
    it('should create a user and set cookie', async () => {
      const dto = {
        email: 'new@mail.com',
        username: 'new',
        password: 'Test@123',
      };
      const expectedResponse = {
        access_token: 'token',
        user: { id: '2', email: 'new@mail.com' },
      };
      const expectedResult = { user: { id: '2', email: 'new@mail.com' } };
      const mockRes = {
        cookie: jest.fn(),
      } as unknown as import('express').Response;

      mockAuthService.signup.mockResolvedValue(expectedResponse);

      const result = await controller.signup(dto, mockRes);
      expect(result).toEqual(expectedResult);
      expect(mockAuthService.signup).toHaveBeenCalledWith(
        dto.email,
        dto.username,
        dto.password,
      );
      expect(mockRes.cookie).toHaveBeenCalledWith(
        'access_token',
        'token',
        expect.any(Object),
      );
    });
  });

  describe('getProfile', () => {
    it('should return the user from request', () => {
      const req = { user: { id: '1', username: 'test' } } as Parameters<
        typeof controller.getProfile
      >[0];
      const result = controller.getProfile(req);
      expect(result).toEqual(req.user);
    });
  });

  describe('logout', () => {
    it('should return success message and clear cookie', async () => {
      const mockRes = {
        clearCookie: jest.fn(),
      } as unknown as import('express').Response;
      const result = controller.logout(mockRes);
      expect(result).toEqual({ message: 'Logged out successfully' });
      expect(mockRes.clearCookie).toHaveBeenCalledWith('access_token');
    });
  });
});
