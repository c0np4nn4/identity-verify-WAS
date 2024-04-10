import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/entity/user.entity';

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
  entities: [UserEntity],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  charset: 'utf8mb4_unicode_ci',
  timezone: '+09:00',
});
