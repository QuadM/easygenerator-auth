import { Controller, Get, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { CsrfService } from './csrf.service';

@Controller('csrf')
export class CsrfController {
  constructor(private readonly csrfService: CsrfService) {}

  @Get('token')
  getCsrfToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = this.csrfService.generateToken(request, response);

    return { csrfToken: token };
  }
}
