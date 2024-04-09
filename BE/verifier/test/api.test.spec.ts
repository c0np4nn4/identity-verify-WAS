// holder-api.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { VerifierAPIService } from '../src/verifier/verifier-api.service';

describe('HolderAPIController (e2e)', () => {
  let verifierAPIService: VerifierAPIService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [VerifierAPIService],
    }).compile();

    verifierAPIService =
      moduleFixture.get<VerifierAPIService>(VerifierAPIService);
  });

  it('Create User VC: Success', () => {
    const [proof, IssuerPubKey, majorCode, message, params, vkey, strategy] = [
      'proof',
      'IssuerPubKey',
      '12',
      'message',
      {},
      new Uint8Array(),
      new Uint8Array(),
    ];
    const res = verifierAPIService.verifyProof(
      proof,
      IssuerPubKey,
      majorCode,
      message,
      params,
      vkey,
      strategy,
    );
    expect(res).toBe(true);
  });
});
