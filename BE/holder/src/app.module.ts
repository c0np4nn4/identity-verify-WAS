import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { HolderAPIModule } from './holder/holder-api.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from './config/mailer.config';

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
      useFactory: () => {
        return { ...mailerConfig };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class HolderAppModule {}
