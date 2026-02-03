import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { ConfigService } from './common/config.service';
import { CsrfService } from './common/csrf.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  // Validate environment variables before starting
  const configService = new ConfigService();
  configService.validateEnvironment();

  const app = await NestFactory.create(AppModule);

  // Enable global prefix
  app.setGlobalPrefix('api');

  // Security Middleware
  app.use(helmet());

  // Enable CORS for frontend integration
  app.enableCors({
    origin: configService.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  });

  // Enable cookie parser (required for csrf-csrf)
  app.use(cookieParser());

  // Get CSRF service and apply middleware globally
  const csrfService = app.get(CsrfService);
  app.use(csrfService.getMiddleware());

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: configService.isProduction,
    }),
  );

  // Enable global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableShutdownHooks();

  // Swagger Configuration
  const options = new DocumentBuilder()
    .setTitle('EG Auth API')
    .setDescription(
      'Authentication Service API with JWT, CSRF, and HTTP-only cookies',
    )
    .setVersion('1.0')
    .addTag('auth')
    .addCookieAuth('access_token') // Document that we use cookies
    .addApiKey(
      { type: 'apiKey', name: 'X-CSRF-Token', in: 'header' },
      'X-CSRF-Token',
    )
    .addSecurityRequirements('X-CSRF-Token')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.port;
  await app.listen(port);

  console.log(`eg-auth-server listening on http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api/docs`);
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
