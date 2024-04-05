import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HolderAPIController } from './holder-api.controller';
import { HolderAPIService } from './holder-api.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    HttpModule,
    JwtModule.registerAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '300s' },
      }),
    }),
    MailerModule.forRootAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          auth: {
            // TODO: launch.env에 추가
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"no-reply" <noreply@gmail.com>`,
        },
      }),
    }),
  ],
  controllers: [HolderAPIController],
  providers: [HolderAPIService],
})
export class HolderAPIModule {}
