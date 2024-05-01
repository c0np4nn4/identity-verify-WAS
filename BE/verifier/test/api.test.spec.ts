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

  it('Verify Proof: Success', async () => {
    return;
  });
});
