/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

jest.mock('argon2');

const mockUsersService = {
  findByEmail: jest.fn(),
  createUser: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user without password if validation succeeds', async () => {
      const user = { id: '1', email: 'test@mail.com', password: 'hashed' };
      mockUsersService.findByEmail.mockResolvedValue(user);
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@mail.com', 'pass');
      expect(result).toEqual({ id: '1', email: 'test@mail.com' });
    });

    it('should return null if user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      const result = await service.validateUser('test@mail.com', 'pass');
      expect(result).toBeNull();
    });

    it('should return null if password mismatch', async () => {
      const user = { id: '1', email: 'test@mail.com', password: 'hashed' };
      mockUsersService.findByEmail.mockResolvedValue(user);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('test@mail.com', 'wrongpass');
      expect(result).toBeNull();
    });

    it('should throw BadRequestException if username or password missing', async () => {
      await expect(service.validateUser('', 'pass')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.validateUser('user', '')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    it('should return access token', () => {
      const user = { id: '1', email: 'test@mail.com' };
      mockJwtService.sign.mockReturnValue('token');

      const result = service.login(user);

      expect(result).toEqual({ access_token: 'token', user });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: 'test@mail.com',
        sub: '1',
      });
    });


    it('should throw UnauthorizedException if no user provided', () => {
      expect(() => service.login(null as unknown as UserPayload)).toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('signup', () => {
    it('should call usersService.createUser', async () => {
      const resultUser = {
        id: '1',
        email: 'newuser@mail.com',
        username: 'newuser',
      };
      mockUsersService.createUser.mockResolvedValue(resultUser);
      mockJwtService.sign.mockReturnValue('token');

      const result = await service.signup(
        'newuser@mail.com',
        'newuser',
        'password',
      );
      expect(mockUsersService.createUser).toHaveBeenCalledWith(
        'newuser@mail.com',
        'newuser',
        'password',
      );
      expect(result).toEqual({ access_token: 'token', user: resultUser });
    });
  });
});
