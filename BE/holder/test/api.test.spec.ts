// holder-api.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { HolderAPIModule } from '../src/holder/holder-api.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';

describe('HolderAPIController (e2e)', () => {
  jest.setTimeout(100000);

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        HolderAPIModule,
        ConfigModule.forRoot({
          envFilePath: './src/config/.launch.env',
          isGlobal: true,
        }),
        JwtModule.registerAsync({
          imports: [],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            global: true,
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: '300s' },
          }),
        }),
        MailerModule.forRootAsync({
          imports: [],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            transport: {
              host: 'smtp.gmail.com',
              port: 587,
              auth: {
                user: configService.get<string>('MAIL_USER'),
                pass: configService.get<string>('MAIL_PASSWORD'),
              },
            },
            defaults: {
              from: `"no-reply" <noreply@gmail.com>`,
            },
          }),
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Send Email Code (POST)', async () => {
    const dto = { email: 'jamjam1208@naver.com' };
    const res = await request(app.getHttpServer())
      .post('/api/holder/v1/send-email')
      .send(dto)
      .expect(201);

    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('token');

    const { token } = res.body.data;
    expect(typeof token).toBe('string');

    const jwtPattern =
      /^[A-Za-z0-9-_=]+\.([A-Za-z0-9-_=]+)\.([A-Za-z0-9-_=]+)$/;
    expect(token).toMatch(jwtPattern);
  });

  afterAll(async () => {
    await app.close();
  });
});
