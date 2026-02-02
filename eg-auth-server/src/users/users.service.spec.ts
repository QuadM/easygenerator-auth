import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';

// Mock the external argon2 library
jest.mock('argon2');

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      const user = { id: '1', email: 'test', password: 'hashedpassword' };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      expect(await service.findByEmail('test')).toEqual(user);
    });

    it('should return null if not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      expect(await service.findByEmail('unknown')).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return a user without password if found', async () => {
      const user = { id: '1', email: 'test', password: 'hashedpassword' };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.findById('1');
      expect(result).toEqual({ id: '1', email: 'test' });
      expect(result).not.toHaveProperty('password');
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(service.findById('unknown')).rejects.toThrow('User not found');
    });
  });

  describe('createUser', () => {
    it('should create a user with a hashed password', async () => {
      const username = 'newuser';
      const password = 'password123';
      const hashedPassword = 'hashed_password123';
      const createdUser = { id: '1', email: 'newuser@mail.com', username, password: hashedPassword };

      (argon2.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrismaService.user.findUnique.mockResolvedValue(null); // No existing user
      mockPrismaService.user.create.mockResolvedValue(createdUser);

      const result = await service.createUser('newuser@mail.com', username, password);

      expect(argon2.hash).toHaveBeenCalledWith(password, expect.any(Object));
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { email: 'newuser@mail.com', username, password: hashedPassword },
      });
      expect(result).toEqual({ id: '1', email: 'newuser@mail.com', username });
    });

    it('should throw ConflictException if user already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: '1', email: 'existing@mail.com', username: 'existing' });
      
      await expect(service.createUser('existing@mail.com', 'existing', 'pass')).rejects.toThrow('An account with that email address already exists.');
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });
});
