import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  get databaseUrl(): string {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error('DATABASE_URL environment variable is required');
    }
    return url;
  }

  get jwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is required');
    }
    return secret;
  }

  get csrfSecret(): string {
    const secret = process.env.CSRF_SECRET;
    if (!secret) {
      throw new Error('CSRF_SECRET environment variable is required');
    }
    return secret;
  }

  get frontendUrl(): string {
    return process.env.FRONTEND_URL || 'http://localhost:5173';
  }

  get nodeEnv(): string {
    return process.env.NODE_ENV || 'development';
  }

  get port(): number {
    const port = process.env.PORT;
    return port ? parseInt(port, 10) : 3000;
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  validateEnvironment(): void {
    // This will throw if any required env vars are missing
    try {
      void this.databaseUrl;
      void this.jwtSecret;
      void this.csrfSecret;
    } catch (error) {
      throw new Error(`Environment validation failed: ${error}`);
    }
  }
}
