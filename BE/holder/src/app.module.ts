import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { HolderAPIModule } from './holder/holder-api.module';

@Module({
  imports: [
    HolderAPIModule,
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'test'
          ? './src/config/.test.env'
          : './src/config/.launch.env',
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class HolderAppModule {}
