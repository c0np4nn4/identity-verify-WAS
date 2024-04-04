import { Module } from '@nestjs/common';
import { ServiceAPIModule } from './service/service-api.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfig } from './config/typeorm.config';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from './jwt.config.service';

@Module({
  imports: [
    ServiceAPIModule,
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
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class ServiceAppModule {}
