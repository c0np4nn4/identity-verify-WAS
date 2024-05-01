/* eslint-disable prefer-const */
import { Test, TestingModule } from '@nestjs/testing';
import { IssuerAPIService } from '../src/issuer/issuer-api.service';
import { ConfigModule } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CounterEntity } from '../src/entity/counter.entity';

class CounterRepository {
  setMockRepository() {
    const counterReoisitory: CounterEntity[] = [];
    let row: CounterEntity;

    row = new CounterEntity();
    row.id = 'counter';
    row.count = 0;
    counterReoisitory.push(row);
    return counterReoisitory;
  }

  async findOne(object: any) {
    const id = object?.where?.id;

    const mockRepository = this.setMockRepository();
    let result: CounterEntity;
    mockRepository.map((row) => {
      if (id === 'counter') {
        result = row;
        return;
      }
    });
    return result;
  }

  async save(object: any) {
    return this.setMockRepository();
  }
}

describe('IssuerAPIController (e2e)', () => {
  // 블록체인 적재시 걸리는 시간 고려
  jest.setTimeout(100000);

  let issuerApiService: IssuerAPIService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: './src/config/.test.env',
          isGlobal: true,
        }),
      ],
      providers: [
        IssuerAPIService,
        {
          provide: getRepositoryToken(CounterEntity),
          useClass: CounterRepository,
        },
      ],
    }).compile();

    issuerApiService = moduleFixture.get<IssuerAPIService>(IssuerAPIService);
  });

  it('Create User VC: Success', () => {
    const dto = { studentMajorCode: '24', holderPubKey: 'hpubkey' };
    const res = issuerApiService.createUserVC(dto);
    expect(res).toHaveProperty('uuid');
    expect(res).toHaveProperty('vc');
  });

  // TODO
  // - issuerPubKey 와 vc{ ... }의 `issuer` 를 통일해야함
  // - `pnu.testnet` 에는 최종 완성된 스마트 컨트랙트를 배포할 예정임
  it('Load Key Chain: Success', async () => {
    const issuerPubKey = 'meaty-man.testnet';
    const vc = `{
        uuid: '505264c8-fea3-4ff0-8bb4-d5b49ea7936b',
        vc: {
          context: [ 'https://www.w3.org/ns/credentials/v2' ],
          id: 'url:uuid:505264c8-fea3-4ff0-8bb4-d5b49ea7936b',
          credential_type: [ 'VerifiableCredential', 'MajorCredential' ],
          issuer: 'did:near:pnu.testnet',
          validFrom: '2024-05-01T13:45:03Z',
          credentialSubject: { id: 'did:near:hpubkey.testnet', subject: [Object] },
          proof: {
            type: 'CircRefNEARDIDProof',
            cryptosuite: 'eddsa',
            created: '2024-05-01T13:45:03Z',
            verificationMethod: 'CircRefVCSignatureVerificationMethod',
            proofPurpose: 'assertionMethod',
            proofValue: ''
          }
        }
      }`;
    const res = await issuerApiService.loadKeyChain(issuerPubKey, vc);
    expect(Array.isArray(res)).toBe(true);
  });

  it('Generate Proof Value: Success', async () => {
    const res = await issuerApiService.generateProofValue();
    expect(res).toHaveProperty('proofValue');
    expect(res).toHaveProperty('message');
  });
});
