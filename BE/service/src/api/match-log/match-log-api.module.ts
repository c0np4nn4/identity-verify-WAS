import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenGuard } from 'src/common/guard/token.guard';
import { ServiceAPIModule } from '../service/service-api.module';
import { MatchLogEntity } from '@entity/match-log.entity';
import { MatchLogAPIController } from './match-log-api.controller';
import { MatchLogAPIService } from './match-log-api.service';
import { AlarmAPIModule } from '../alarm/alarm-api.module';
import { BoatAPIModule } from '../boat/boat-api.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatchLogEntity]),
    ServiceAPIModule,
    AlarmAPIModule,
    BoatAPIModule,
  ],
  controllers: [MatchLogAPIController],
  providers: [MatchLogAPIService, TokenGuard],
})
export class MatchLogAPIModule {}
