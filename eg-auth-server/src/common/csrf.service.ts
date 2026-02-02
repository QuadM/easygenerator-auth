import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { doubleCsrf, DoubleCsrfConfigOptions } from 'csrf-csrf';
import { ConfigService } from './config.service';

@Injectable()
export class CsrfService {
  private readonly csrfProtection: ReturnType<typeof doubleCsrf>;

  constructor(private configService: ConfigService) {
    const config: DoubleCsrfConfigOptions = {
      getSecret: () => this.configService.csrfSecret,
      getSessionIdentifier: (req: Request) => {
        if (!this.configService.isProduction) {
          return 'dev-session';
        }
        // Use a combination of IP and User-Agent as session identifier
        return `${req.ip || 'unknown'}-${req.get('User-Agent') || 'unknown'}`;
      },
      cookieName: this.configService.isProduction 
        ? '__Host-psifi.x-csrf-token' 
        : 'psifi.x-csrf-token',
      cookieOptions: {
        httpOnly: true,
        sameSite: this.configService.isProduction ? 'strict' : 'lax',
        secure: this.configService.isProduction,
        maxAge: 1000 * 60 * 60, // 1 hour
      },
      size: 64,
      ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
      getCsrfTokenFromRequest: (req: Request) => {
        const headerToken = req.headers['x-csrf-token'] as string;
        const bodyToken = (req.body as { csrfToken?: string })?.csrfToken;
        return headerToken || bodyToken || '';
      },
    };

    this.csrfProtection = doubleCsrf(config);
  }

  generateToken(req: Request, res: Response): string {
    return this.csrfProtection.generateCsrfToken(req, res);
  }

  validateToken(req: Request): boolean {
    try {
      return this.csrfProtection.validateRequest(req);
    } catch {
      return false;
    }
  }

  getMiddleware() {
    return this.csrfProtection.doubleCsrfProtection;
  }
}
