import { CounterEntity } from '../entity/counter.entity';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

const configService: ConfigService = new ConfigService();

export default new DataSource({
  migrationsTableName: 'migrations',
  type: 'mysql',
  host: 'mysql-counter',
  port: 3306,
  username: 'root',
  password: '1111',
  database: 'db',
  synchronize: false,
  entities: [CounterEntity],
  migrations: ['src/migrations/*.ts'],
  charset: 'utf8mb4_unicode_ci',
  timezone: '+09:00',
});
