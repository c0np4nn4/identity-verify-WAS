import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/entity/user.entity';
import { EmailCodeEntity } from 'src/entity/email-code.entity';

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
  entities: [UserEntity, EmailCodeEntity],
  migrations: ['src/migrations/*.ts'],
  charset: 'utf8mb4_unicode_ci',
  synchronize: false,
});
