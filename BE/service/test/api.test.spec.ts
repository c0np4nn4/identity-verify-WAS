import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../src/entity/user.entity';
import { ServiceAPIService } from '../src/service/service-api.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

const mockPostRepository = () => ({
  save: jest.fn().mockResolvedValue(undefined),
  findOne: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
});
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ServiceAPIController (e2e)', () => {
  let serviceApiService: ServiceAPIService;
  let userRepository: MockRepository<UserEntity>;

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
          useValue: mockPostRepository(),
        },
      ],
    }).compile();

    serviceApiService = moduleFixture.get<ServiceAPIService>(ServiceAPIService);
    userRepository = moduleFixture.get<MockRepository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('Register User: Success', async () => {
    const [pk, nickname, id, password] = [
      'user_pk',
      'test_name',
      'test',
      'pwd',
    ];
    const dto = { nickname, id, password };
    const res = await serviceApiService.registerUser(dto);

    expect(userRepository.save).toHaveBeenCalledTimes(1);
    expect(res.data).toHaveProperty('pk');

    await userRepository.delete({ pk });
  });

  it('Login User: Success', async () => {
    const [id, password] = ['test', 'pwd'];
    await userRepository.save({
      pk: 'user_pk',
      id,
      password,
    });

    const dto = { id, password };
    const res = await serviceApiService.loginUser(dto);
    console.log(res);

    await userRepository.delete({ id });
  });
});
