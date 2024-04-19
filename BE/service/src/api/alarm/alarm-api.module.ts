import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenGuard } from 'src/common/guard/token.guard';
import { ServiceAPIModule } from '../service/service-api.module';
import { AlarmAPIController } from './alarm-api.controller';
import { AlarmAPIService } from './alarm-api.service';
import { AlarmEntity } from '@entity/alarm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AlarmEntity]), ServiceAPIModule],
  controllers: [AlarmAPIController],
  providers: [AlarmAPIService, TokenGuard],
})
export class AlarmAPIModule {}
