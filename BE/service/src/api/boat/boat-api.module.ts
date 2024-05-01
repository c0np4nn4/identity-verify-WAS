import { Module } from '@nestjs/common';
import { BoatAPIController } from './boat-api.controller';
import { BoatAPIService } from './boat-api.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoatEntity } from '@entity/boat.entity';
import { TokenGuard } from 'src/common/guard/token.guard';
import { ServiceAPIModule } from '../service/service-api.module';
import { CustomLoggerService } from 'src/module/custom.logger';

@Module({
  imports: [TypeOrmModule.forFeature([BoatEntity]), ServiceAPIModule],
  controllers: [BoatAPIController],
  providers: [BoatAPIService, TokenGuard, CustomLoggerService],
  exports: [BoatAPIService],
})
export class BoatAPIModule {}
