import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method;

    // Only check CSRF for state-changing operations
    if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      return true;
    }

    // Check if CSRF token exists in headers or body
    // Note: The client sends 'x-csrf-token' header, which contains the token value.
    // This matches the validation logic in content/csrf.service.ts
    const csrfToken =
      request.get('x-csrf-token') ||
      (request.body as { csrfToken?: string })?.csrfToken;

    if (!csrfToken) {
      throw new ForbiddenException('CSRF token is required');
    }

    // The actual validation is handled by the csrf-csrf middleware
    // If we reach here, the middleware has already validated the token
    return true;
  }
}
