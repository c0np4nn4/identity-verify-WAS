import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
<<<<<<< HEAD
import { StudentEntity } from '../entity/student.entity';
=======
import { UserEntity } from 'src/entity/user.entity';
>>>>>>> 4b9006879fd1399d99ee374d3863f97aff149b04

export const TypeormConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PWD'),
  database: 'db',
<<<<<<< HEAD
  entities: [HolderVCEntity, StudentEntity],
  synchronize: true,
=======
  entities: [UserEntity],
  synchronize: false,
>>>>>>> 4b9006879fd1399d99ee374d3863f97aff149b04
  logging: true,
});
