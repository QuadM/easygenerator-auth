import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '../common/config.service';

interface JwtPayload {
  sub: string;
  email: string;
  username?: string;
  iat?: number;
  exp?: number;
}

interface ValidatedUser {
  id: string;
  email: string;
  username?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: { cookies?: Record<string, string> } | null) => {
          if (req && req.cookies) {
            return req.cookies['access_token'] ?? null;
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<ValidatedUser> {
    try {
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return { id: payload.sub, email: user.email, username: user.username };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
