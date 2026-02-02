import { Module } from '@nestjs/common';
import { CsrfService } from './csrf.service';
import { CsrfController } from './csrf.controller';
import { ConfigService } from './config.service';

@Module({
  providers: [CsrfService, ConfigService],
  controllers: [CsrfController],
  exports: [CsrfService, ConfigService],
})
export class CommonModule {}
