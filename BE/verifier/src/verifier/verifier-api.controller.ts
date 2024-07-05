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
  ) { }

  @Post('verify-proof')
  @ApiOperation({
    summary: '생성된 Proof를 검증',
  })
  async verifyProof(@Body() dto: ProofDto): Promise<boolean> {
    const { ServiceName, IssuerPubKey, proof } = dto;

    // const document = get_document(did: string): Document
    // const { encodedPubKey } = document.public_key;
    // const decodedPubkey = decode(encodedPubKey);
    // const publicSignals = convertToBinArray(decodedPubkey);
    // const verifyResult = await this.verifierAPIService.verifyProof(
    //   publicSignals,
    //   JSON.parse(proof),
    // );

    const verifyResult = await this.verifierAPIService.verifyProof(
      JSON.parse(''),
      JSON.parse(proof),
    );

    if (!verifyResult) return false;

    // Send data to blockchain (NEAR)
    try {
      const verifyResult = await this.verifierAPIService.loadProofResult(
        ServiceName,
        IssuerPubKey,
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
