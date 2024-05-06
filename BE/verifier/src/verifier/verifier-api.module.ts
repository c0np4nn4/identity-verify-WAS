import { Module } from '@nestjs/common';
import { VerifierAPIController } from './verifier-api.controller';
import { VerifierAPIService } from './verifier-api.service';
import { CustomLoggerService } from 'src/module/custom.logger';

@Module({
  imports: [],
  controllers: [VerifierAPIController],
  providers: [VerifierAPIService, CustomLoggerService],
})
export class VerifierAPIModule {}
