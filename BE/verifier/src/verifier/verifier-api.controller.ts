import { Body, Controller, Post } from '@nestjs/common';
import { VerifierAPIService } from './verifier-api.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProofDto } from '../dto/proof.dto';
import { CustomErrorException } from '../filter/custom-error.exception';
import { CustomLoggerService } from 'src/module/custom.logger';

@Controller('api/verifier')
@ApiTags('VERIFIER API')
export class VerifierAPIController {
  constructor(
    private readonly verifierAPIService: VerifierAPIService,
    private readonly customLoggerService: CustomLoggerService,
  ) {}

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
      const verifyResult = await this.verifierAPIService.loadProofResult(
        ServiceName,
        HolderPubKey,
      );
      if (!verifyResult) {
        throw new CustomErrorException('Verify Load Failed', 502);
      }
      return true;
    } catch (error) {
      this.customLoggerService.error('/verify-proof', 'Proof 적재 실패', {});
      throw new CustomErrorException('Verfiy Load Failed', 502);
    }
  }
}
