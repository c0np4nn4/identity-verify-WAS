import { Module } from '@nestjs/common';
import { ServiceAPIModule } from './service/service-api.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfig } from './config/typeorm.config';
import Joi from 'joi';

@Module({
  imports: [
    ServiceAPIModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'test'
          ? './src/config/.test.env'
          : './src/config/.launch.env',
      validationSchema: Joi.object({
        API_CREATE_USER_VC: Joi.string().required(),
        API_GET_USER_MAJOR: Joi.string().required(),
        API_GET_PROOF_VALUE: Joi.string().required(),
        API_VERIFY_MAJOR_MATCH: Joi.string().required(),
        MAIL_PASSWORD: Joi.string().required(),
        MAIL_USER: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        TypeormConfig(configService),
    }),
  ],
  controllers: [],
  providers: [],
})
export class ServiceAppModule {}
