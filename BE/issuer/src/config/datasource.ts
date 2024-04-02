import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { StudentKeyPairEntity } from 'src/entity/student-key-pair.entity';

const configService: ConfigService = new ConfigService();

export default new DataSource({
  migrationsTableName: 'migrations',
  type: 'mysql',
  host: 'localhost',
  port: 3307,
  username: 'root',
  password: '1111',
  database: 'db',
  // synchronize: true,
  entities: [StudentKeyPairEntity],
  migrations: ['src/migrations/*.ts'],
  charset: 'utf8mb4_unicode_ci',
  synchronize: false,
});
