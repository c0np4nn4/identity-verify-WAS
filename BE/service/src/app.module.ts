import { ServiceAPIModule } from './api/service/service-api.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfig } from './config/typeorm.config';
import { BoatAPIModule } from './api/boat/boat-api.module';
import { MatchLogAPIModule } from './api/match-log/match-log-api.module';
import { AlarmAPIModule } from './api/alarm/alarm-api.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as moment from 'moment';
import { LoggerMiddleware } from './middleware/logger.middleware';

const winstonFormat = winston.format.combine(
  winston.format.timestamp(),
  nestWinstonModuleUtilities.format.nestLike('SERVICE', {
    colors: true,
    prettyPrint: true,
  }),
);

@Module({
  imports: [
    ServiceAPIModule,
    BoatAPIModule,
    MatchLogAPIModule,
    AlarmAPIModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'test'
          ? './src/config/.test.env'
          : './src/config/.launch.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        TypeormConfig(configService),
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: 'info',
          format: winstonFormat,
        }),
        new winston.transports.File({
          dirname: `./error-logs`,
          filename: `${moment(new Date()).format('YYYY-MM-DD')}.log`,
          level: 'warn',
          format: winstonFormat,
        }),
        new winston.transports.File({
          dirname: `./logs`,
          filename: `${moment(new Date()).format('YYYY-MM-DD')}.log`,
          level: 'info',
          format: winstonFormat,
        }),
      ],
    }),
  ],
  controllers: [],
  providers: [],
})
export class ServiceAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
