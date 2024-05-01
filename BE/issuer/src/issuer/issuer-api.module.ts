import { Module } from '@nestjs/common';
import { IssuerAPIController } from './issuer-api.controller';
import { IssuerAPIService } from './issuer-api.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CounterEntity } from '@entity/counter.entity';
import { CustomLoggerService } from 'src/module/custom.logger';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([CounterEntity])],
  controllers: [IssuerAPIController],
  providers: [IssuerAPIService, CustomLoggerService],
})
export class IssuerAPIModule {}
