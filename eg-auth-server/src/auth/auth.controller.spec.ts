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
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
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
    it('should return login response and set cookie', async () => {
      const req = { user: { id: '1', email: 'test' } };
      const dto = { email: 'test', password: 'password' };
      const expectedResponse = { access_token: 'token', user: req.user };
      const expectedResult = { user: req.user };
      const mockRes = { cookie: jest.fn() };
      
      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(req as any, mockRes as any);
      expect(result).toEqual(expectedResult);
      expect(mockAuthService.login).toHaveBeenCalledWith(req.user);
      expect(mockRes.cookie).toHaveBeenCalledWith('access_token', 'token', expect.any(Object));
    });
  });

  describe('signup', () => {
    it('should create a user and set cookie', async () => {
      const dto = { email: 'new@mail.com', username: 'new', password: 'Test@123' };
      const expectedResponse = { access_token: 'token', user: { id: '2', email: 'new@mail.com' } };
      const expectedResult = { user: { id: '2', email: 'new@mail.com' } };
      const mockRes = { cookie: jest.fn() };
      
      mockAuthService.signup.mockResolvedValue(expectedResponse);

      const result = await controller.signup(dto, mockRes as any);
      expect(result).toEqual(expectedResult);
      expect(mockAuthService.signup).toHaveBeenCalledWith(dto.email, dto.username, dto.password);
      expect(mockRes.cookie).toHaveBeenCalledWith('access_token', 'token', expect.any(Object));
    });
  });

  describe('getProfile', () => {
    it('should return the user from request', () => {
      const req = { user: { id: '1', email: 'test', userId: '1' } };
      const result = controller.getProfile(req as any);
      expect(result).toEqual(req.user);
    });
  });

  describe('logout', () => {
    it('should return success message and clear cookie', async () => {
      const mockRes = { clearCookie: jest.fn() };
      const result = await controller.logout(mockRes as any);
      expect(result).toEqual({ message: 'Logged out successfully' });
      expect(mockRes.clearCookie).toHaveBeenCalledWith('access_token');
    });
  });
});
