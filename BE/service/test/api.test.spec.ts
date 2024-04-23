import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../src/entity/user.entity';
import { ServiceAPIService } from '../src/api/service/service-api.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { hashSync } from 'bcryptjs';
import { BoatEntity } from '../src/entity/boat.entity';
import { AlarmAPIService } from '../src/api/alarm/alarm-api.service';
import { MatchLogAPIService } from '../src/api/match-log/match-log-api.service';
import { BoatAPIService } from '../src/api/boat/boat-api.service';
import { MatchLogEntity } from '../src/entity/match-log.entity';
import { AlarmEntity } from '../src/entity/alarm.entity';

class UserMockRepository {
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

class BoatMockRepository {}

class MatchLogMockRepository {}

class AlarmMockRepository {}

describe('ServiceAPIController (e2e)', () => {
  let serviceApiService: ServiceAPIService;
  let boatApiService: BoatAPIService;
  let matchLogApiService: MatchLogAPIService;
  let alarmApiService: AlarmAPIService;

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
          useClass: UserMockRepository,
        },
        BoatAPIService,
        {
          provide: getRepositoryToken(BoatEntity),
          useClass: BoatMockRepository,
        },
        MatchLogAPIService,
        {
          provide: getRepositoryToken(MatchLogEntity),
          useClass: MatchLogMockRepository,
        },
        AlarmAPIService,
        {
          provide: getRepositoryToken(AlarmEntity),
          useClass: AlarmMockRepository,
        },
      ],
    }).compile();

    serviceApiService = moduleFixture.get<ServiceAPIService>(ServiceAPIService);
    boatApiService = moduleFixture.get<BoatAPIService>(BoatAPIService);
    matchLogApiService =
      moduleFixture.get<MatchLogAPIService>(MatchLogAPIService);
    alarmApiService = moduleFixture.get<AlarmAPIService>(AlarmAPIService);
  });

  it('Register User: Success', async () => {
    // const [id, nickname, password] = ['new_id', 'new_nickname', 'pwd'];
    // const dto = { nickname, id, password };
    // const res = await serviceApiService.registerUser(dto);
    // expect(res.statusCode).toEqual(200);
  });
});
