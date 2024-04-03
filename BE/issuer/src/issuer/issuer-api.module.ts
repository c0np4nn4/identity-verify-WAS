import { Module } from '@nestjs/common';
import { IssuerAPIController } from './issuer-api.controller';
import { IssuerAPIService } from './issuer-api.service';
import { HttpModule } from '@nestjs/axios';
import { StudentKeyPairEntity } from 'src/entity/student-key-pair.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([StudentKeyPairEntity])],
  controllers: [IssuerAPIController],
  providers: [IssuerAPIService],
})
export class IssuerAPIModule {}
