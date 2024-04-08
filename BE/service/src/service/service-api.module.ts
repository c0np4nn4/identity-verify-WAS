import { Module } from '@nestjs/common';
import { ServiceAPIController } from './service-api.controller';
import { ServiceAPIService } from './service-api.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
<<<<<<< HEAD
import { HolderVCEntity } from '../entity/holder_vc.entity';
import { StudentEntity } from 'src/entity/student.entity';
=======
import { UserEntity } from 'src/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
>>>>>>> 4b9006879fd1399d99ee374d3863f97aff149b04

@Module({
  imports: [
    HttpModule,
<<<<<<< HEAD
    TypeOrmModule.forFeature([HolderVCEntity, StudentEntity]),
=======
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '90d' },
      }),
    }),
    JwtModule.registerAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '300s' },
      }),
    }),
>>>>>>> 4b9006879fd1399d99ee374d3863f97aff149b04
  ],
  controllers: [ServiceAPIController],
  providers: [ServiceAPIService],
})
export class ServiceAPIModule {}
