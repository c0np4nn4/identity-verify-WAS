import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { VerifierAPIModule } from './verifier/verifier-api.module';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as moment from 'moment';
import { LoggerMiddleware } from './middleware/logger.middleware';

const winstonFormat = winston.format.combine(
  winston.format.timestamp(),
  nestWinstonModuleUtilities.format.nestLike('VERIFIER', {
    colors: true,
    prettyPrint: true,
  }),
);

@Module({
  imports: [
    VerifierAPIModule,
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
export class VerifierAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
