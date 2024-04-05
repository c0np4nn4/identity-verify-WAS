import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { HolderAPIModule } from './holder/holder-api.module';
import { MailerModule } from '@nestjs-modules/mailer';
import * as Joi from 'joi';

@Module({
  imports: [
    HolderAPIModule,
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'test'
          ? './src/config/.test.env'
          : './src/config/.launch.env',
      isGlobal: true,
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
  ],
  controllers: [],
  providers: [],
})
export class HolderAppModule {}
