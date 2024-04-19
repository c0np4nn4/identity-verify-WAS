import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../src/entity/user.entity';
import { ServiceAPIService } from '../src/api/service/service-api.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { hashSync } from 'bcryptjs';

class MockRepository {
  mockId = 'id';
  mockNickname = 'nickname';
  mockPassword = hashSync('pwd', 10);

  setMockEntity() {
    const userReoisitory: UserEntity = new UserEntity();
    userReoisitory.id = this.mockId;
    userReoisitory.nickname = this.mockNickname;
    userReoisitory.password = this.mockPassword;
    return userReoisitory;
  }

  async findOne(object: any) {
    const id = object?.where?.id;
    const nickname = object?.where?.nickname;
    const mockEntity = this.setMockEntity();
    if (mockEntity.id === id) {
      return mockEntity;
    }
    if (mockEntity.nickname === nickname) {
      return mockEntity;
    }
    return false;
  }

  async save(object: any) {
    return true;
  }
}

describe('ServiceAPIController (e2e)', () => {
  let serviceApiService: ServiceAPIService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        ConfigModule.forRoot({
          envFilePath: './src/config/.test.env',
          isGlobal: true,
        }),
        JwtModule.registerAsync({
          imports: [],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            global: true,
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: '90d' },
          }),
        }),
      ],
      providers: [
        ServiceAPIService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: MockRepository,
        },
      ],
    }).compile();

    serviceApiService = moduleFixture.get<ServiceAPIService>(ServiceAPIService);
  });

  it('Register User: Success', async () => {
    const [id, nickname, password] = ['new_id', 'new_nickname', 'pwd'];
    const dto = { nickname, id, password };
    const res = await serviceApiService.registerUser(dto);

    expect(res.statusCode).toEqual(200);
  });

  it('Register User: Duplicate Fail', async () => {
    const [id, nickname, password] = ['id', 'nickname', 'pwd'];
    const dto = { nickname, id, password };
    const res = await serviceApiService.registerUser(dto);

    expect(res.statusCode).toEqual(400);
  });

  it('Login User: Success', async () => {
    const [id, password] = ['id', 'pwd'];
    const dto = { id, password };
    const res = await serviceApiService.loginUser(dto);

    expect(res.statusCode).toEqual(200);
  });

  it('Login User: 404 Fail', async () => {
    const [id, password] = ['none_id', 'none_pwd'];
    const dto = { id, password };
    const res = await serviceApiService.loginUser(dto);

    expect(res.statusCode).toEqual(404);
  });
});
