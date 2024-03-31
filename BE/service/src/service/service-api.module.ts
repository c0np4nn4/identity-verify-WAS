import { Module } from '@nestjs/common';
import { ServiceAPIController } from './service-api.controller';
import { ServiceAPIService } from './service-api.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/user.entity';
import { EmailCodeEntity } from 'src/entity/email-code.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([UserEntity, EmailCodeEntity]),
  ],
  controllers: [ServiceAPIController],
  providers: [ServiceAPIService],
})
export class ServiceAPIModule {}
