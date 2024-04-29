import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/entity/user.entity';
import { BoatEntity } from '@entity/boat.entity';
import { MatchLogEntity } from '@entity/match-log.entity';
import { AlarmEntity } from '@entity/alarm.entity';

export const TypeormConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PWD'),
  database: 'db',
  entities: [UserEntity, BoatEntity, MatchLogEntity, AlarmEntity],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: true,
  logging: true,
  charset: 'utf8mb4_unicode_ci',
  timezone: '+09:00',
});
