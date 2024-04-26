import { Test, TestingModule } from '@nestjs/testing';
import { IssuerAPIService } from '../src/issuer/issuer-api.service';
import { ConfigModule } from '@nestjs/config';

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
      providers: [IssuerAPIService],
    }).compile();

    issuerApiService = moduleFixture.get<IssuerAPIService>(IssuerAPIService);
  });

  it('Create User VC: Success', () => {
    const dto = { studentMajorCode: '24', holderPubKey: 'hpubkey' };
    const res = issuerApiService.createUserVC(dto);
    expect(res).toHaveProperty('uuid');
    expect(res).toHaveProperty('vc');
  });

  //! {"index":0,"kind":{"index":0,"kind":{"FunctionCallError":{"ExecutionError":"The length of a log message 16402 exceeds the limit 16384"}}}}
  // it('Load Key Chain: Success', async () => {
  //   const issuerPubKey = 'quixotic-debt.testnet';
  //   const vc =
  //     '{"context":["https://www.w3.org/ns/credentials/v2"],"id":"url:uuid:21de72f6-0f4a-4e59-8beb-73a17a863f9c","credential_type":["VerifiableCredential","MajorCredential"],"issuer":"did:near:pnu.testnet","validFrom":"2024-04-07T14:17:17Z","credentialSubject":{"id":"did:near:123123.testnet","subject":{"school_did":"did:near:pnu.testnet","major":"24"}},"proof":{"type":"CircRefNEARDIDProof","cryptosuite":"eddsa","created":"2024-04-07T14:17:17Z","verificationMethod":"CircRefVCSignatureVerificationMethod","proofPurpose":"assertionMethod","proofValue":"1B59B0290FEA0A7C8EB3308FA5AE87AFCC970D5C68AE651CE8E7A002E121A993F5EF3FCDEDC9C4A64E76A119F42259D2B4F2D24999469871CB2288A5E9C39402"}}';
  //   const res = await issuerApiService.loadKeyChain(issuerPubKey, vc);
  //   expect(Array.isArray(res)).toBe(true);
  // });

  it('Generate Proof Value: Success', () => {
    const res = issuerApiService.generateProofValue();
    expect(res).toHaveProperty('proofValue');
    expect(res).toHaveProperty('message');
  });
});
