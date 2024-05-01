import { Module } from '@nestjs/common';
import { ServiceAPIController } from './service-api.controller';
import { ServiceAPIService } from './service-api.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BoatEntity } from '@entity/boat.entity';
import { CustomLoggerService } from 'src/module/custom.logger';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([UserEntity, BoatEntity]),
    JwtModule.registerAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '90d' },
      }),
    }),
  ],
  controllers: [ServiceAPIController],
  providers: [ServiceAPIService, CustomLoggerService],
  exports: [ServiceAPIService],
})
export class ServiceAPIModule {}
