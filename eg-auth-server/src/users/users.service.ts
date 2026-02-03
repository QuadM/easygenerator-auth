import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';

interface UserWithoutPassword {
  id: string;
  email: string;
  username: string;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { username } });
  }

  async findById(id: string): Promise<UserWithoutPassword> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new NotFoundException('User not found');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }

  async createUser(
    email: string,
    username: string,
    password: string,
  ): Promise<UserWithoutPassword> {
    const emailExists = await this.findByEmail(email);
    if (emailExists) {
      this.logger.warn(`Attempt to create duplicate user with email: ${email}`);
      throw new ConflictException(
        'An account with that email address already exists.',
      );
    }

    const usernameExists = await this.findByUsername(username);
    if (usernameExists) {
      this.logger.warn(`Attempt to create duplicate user with username: ${username}`);
      throw new ConflictException(
        'An account with that username already exists.',
      );
    }

    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });

    const user = await this.prisma.user.create({
      data: { email, username, password: hashedPassword },
    });

    this.logger.log(`User created successfully: ${user.id}`);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _p, ...rest } = user;
    return rest;
  }
}
