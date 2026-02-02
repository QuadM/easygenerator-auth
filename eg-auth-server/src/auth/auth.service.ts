import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

export interface UserPayload {
  id: string;
  email: string;
}

export interface LoginResponse {
  access_token: string;
  user: UserPayload;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<UserPayload | null> {
    if (!email || !pass) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.usersService.findByEmail(email);
    if (user && (await argon2.verify(user.password, pass))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    this.logger.warn(`Failed login attempt for user: ${email}`);
    return null;
  }

  login(user: UserPayload): LoginResponse {
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`User logged in: ${user.email}`);
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async signup(
    email: string,
    username: string,
    pass: string,
  ): Promise<LoginResponse> {
    this.logger.log(`Process signup for user: ${email}`);
    const user = await this.usersService.createUser(email, username, pass);
    return this.login(user);
  }
}
