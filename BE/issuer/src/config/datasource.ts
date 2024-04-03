import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { StudentKeyPairEntity } from '../entity/student-key-pair.entity';

const configService: ConfigService = new ConfigService();

export default new DataSource({
  migrationsTableName: 'migrations',
  type: 'mysql',
  host: 'mysql-student',
  port: 3307,
  username: 'root',
  password: '1111',
  database: 'db',
  synchronize: false,
  entities: [StudentKeyPairEntity],
  migrations: ['src/migrations/*.ts'],
  charset: 'utf8mb4_unicode_ci',
});
