import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { AuthService, UserPayload, LoginResponse } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CsrfGuard } from '../common/csrf.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiCookieAuth,
} from '@nestjs/swagger';

interface AuthenticatedRequest extends ExpressRequest {
  user: UserPayload;
}

interface JwtAuthenticatedRequest extends ExpressRequest {
  user: {
    id: string;
    username: string;
  };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in. Returns JWT token and user info.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(
    @Request() req: any,
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    const loginResponse = await this.authService.login(req.user);

    // Set HttpOnly cookie
    res.cookie('access_token', loginResponse.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Use strict or lax depending on requirements
      maxAge: 3600 * 1000, // 1 hour
    });

    // Return user info only, token is in cookie
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { access_token, ...rest } = loginResponse;
    return rest;
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered.',
  })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    const loginResponse = await this.authService.signup(
      createUserDto.email,
      createUserDto.username,
      createUserDto.password,
    );

    // Set HttpOnly cookie
    res.cookie('access_token', loginResponse.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600 * 1000,
    });

    // Return user info only, token is in cookie
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { access_token, ...rest } = loginResponse;
    return rest;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Successfully logged out' })
  async logout(@Res({ passthrough: true }) res: ExpressResponse) {
    res.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Return current user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Request() req: any) {
    return req.user;
  }
}
