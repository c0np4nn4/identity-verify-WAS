import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HolderAPIModule } from './holder/holder-api.module';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as moment from 'moment';
import { LoggerMiddleware } from './middleware/logger.middleware';

const winstonFormat = winston.format.combine(
  winston.format.timestamp(),
  nestWinstonModuleUtilities.format.nestLike('HOLDER', {
    colors: true,
    prettyPrint: true,
  }),
);

@Module({
  imports: [
    HolderAPIModule,
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'test'
          ? './src/config/.test.env'
          : './src/config/.launch.env',
      isGlobal: true,
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
export class HolderAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
