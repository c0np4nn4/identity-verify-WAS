import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/entity/user.entity';
import { BoatEntity } from '@entity/boat.entity';
import { MatchLogEntity } from '@entity/match-log.entity';
import { AlarmEntity } from '@entity/alarm.entity';

const configService: ConfigService = new ConfigService();

export default new DataSource({
  migrationsTableName: 'migrations',
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '1111',
  database: 'db',
  // synchronize: true,
  entities: [UserEntity, BoatEntity, MatchLogEntity, AlarmEntity],
  migrations: ['src/migrations/*.ts'],
  synchronize: true,
  charset: 'utf8mb4_unicode_ci',
  timezone: '+09:00',
});
