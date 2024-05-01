import { Body, Controller, Post } from '@nestjs/common';
import { VerifierAPIService } from './verifier-api.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProofDto } from '../dto/proof.dto';
import { CustomErrorException } from '../filter/custom-error.exception';

@Controller('api/verifier')
@ApiTags('VERIFIER API')
export class VerifierAPIController {
  constructor(private readonly verifierAPIService: VerifierAPIService) { }

  @Post('verify-proof')
  @ApiOperation({
    summary: '생성된 Proof를 검증',
  })

  async verifyProof(@Body() dto: ProofDto): Promise<boolean> {
    const { ServiceName, HolderPubKey, proof, IssuerPubKey, vKey } = dto;

    const verifyResult = await this.verifierAPIService.verifyProof(
      proof,
      IssuerPubKey,
      vKey,
    );

    if (!verifyResult) return false;

    // Send data to blockchain (NEAR)
    try {
      if (await this.verifierAPIService.loadProofResult(ServiceName, HolderPubKey)) {
        return true;
      } else {
        throw new CustomErrorException('Verify Load Failed', 502);
      };
    } catch (error) {
      throw new CustomErrorException('Verfiy Load Failed', 502);
    }
  }
}
