import { Module } from '@nestjs/common';
import { ServiceAPIModule } from './api/service/service-api.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfig } from './config/typeorm.config';
import { BoatAPIModule } from './api/boat/boat-api.module';

@Module({
  imports: [
    ServiceAPIModule,
    BoatAPIModule,
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
  ],
  controllers: [],
  providers: [],
})
export class ServiceAppModule {}
