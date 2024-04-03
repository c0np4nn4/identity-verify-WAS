import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { StudentKeyPairEntity } from '../entity/student-key-pair.entity';

export const TypeormConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: 'mysql',
  port: 3306,
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PWD'),
  database: 'db',
  entities: [StudentKeyPairEntity],
  synchronize: true,
  logging: true,
});
