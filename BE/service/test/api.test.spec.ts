import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../src/entity/user.entity';
import { ServiceAPIService } from '../src/api/service/service-api.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { BoatEntity } from '../src/entity/boat.entity';
import { AlarmAPIService } from '../src/api/alarm/alarm-api.service';
import { MatchLogAPIService } from '../src/api/match-log/match-log-api.service';
import { BoatAPIService } from '../src/api/boat/boat-api.service';
import { MatchLogEntity } from '../src/entity/match-log.entity';
import { AlarmEntity } from '../src/entity/alarm.entity';

class UserMockRepository {}

class BoatMockRepository {
  setMockRepository() {
    const boatReoisitory: BoatEntity[] = [];
    let row: BoatEntity;

    row = new BoatEntity();
    row.pk = 1;
    row.userPk = 'a';
    row.label1 = '고양이';
    row.label2 = '시크룩';
    row.label3 = '저녁';
    // row.isOccupied = false;
    boatReoisitory.push(row);

    row = new BoatEntity();
    row.pk = 2;
    row.userPk = 'b';
    row.label1 = '토끼';
    row.label2 = '하늘하늘';
    row.label3 = '낮';
    // row.isOccupied = false;
    boatReoisitory.push(row);

    return boatReoisitory;
  }

  async find(object: any) {
    const userPk = object?.where?.userPk;
    // const isOccupied = object?.where?.isOccupied;

    const mockRepository = this.setMockRepository();
    const result: BoatEntity[] = [];
    mockRepository.map((row) => {
      if (row.userPk === userPk._value) {
        result.push(row);
      }
    });
    return result;
  }

  async findOne(object: any) {
    const boatPk = object?.where?.pk;

    const mockRepository = this.setMockRepository();
    let result: BoatEntity;
    mockRepository.map((row) => {
      if (Number(row.pk) === Number(boatPk)) {
        result = row;
        return;
      }
    });
    return result;
  }
}

class MatchLogMockRepository {}

class AlarmMockRepository {}

describe('API Test (e2e)', () => {
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

  it('View Boat List: Except Me', async () => {
    // const userPk = 'a';
    // const res = await boatApiService.getBoatList(userPk);
    // expect(res.length).toEqual(1);
  });
});
