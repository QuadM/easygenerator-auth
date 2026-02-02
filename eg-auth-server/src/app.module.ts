import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from './common/common.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [PrismaModule, CommonModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
