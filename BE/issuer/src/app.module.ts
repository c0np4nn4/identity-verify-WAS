import { Module } from '@nestjs/common';
import { IssuerAPIModule } from './issuer/issuer-api.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    IssuerAPIModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'test'
          ? './src/config/.test.env'
          : './src/config/.launch.env',
    }),
  ],
  controllers: [],
  providers: [],
})
export class IssuerAppModule {}
