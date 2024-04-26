import { Module } from '@nestjs/common';
import { IssuerAPIController } from './issuer-api.controller';
import { IssuerAPIService } from './issuer-api.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [IssuerAPIController],
  providers: [IssuerAPIService],
})
export class IssuerAPIModule {}
