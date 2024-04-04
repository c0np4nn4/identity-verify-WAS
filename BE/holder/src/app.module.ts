import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { HolderAPIModule } from './holder/holder-api.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    HolderAPIModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'test'
          ? './src/config/.test.env'
          : './src/config/.launch.env',
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          auth: {
            user: 'jinjae781@gmail.com',
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"no-reply" <noreply@gmail.com>`,
        },
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class HolderAppModule {}
