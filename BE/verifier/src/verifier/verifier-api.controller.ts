import { Body, Controller, Get, Post, Query, UseFilters } from '@nestjs/common';
import { VerifierAPIService } from './verifier-api.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProofDto } from '../dto/proof.dto';
import { CustomExceptionFilter } from '../filter/exception.filter';
import { CustomErrorException } from '../filter/custom-error.exception';

@Controller('api/verifier')
@ApiTags('VERIFIER API')
@UseFilters(CustomExceptionFilter)
export class VerifierAPIController {
  constructor(private readonly verifierAPIService: VerifierAPIService) {}

  @Post('verify-proof')
  @ApiOperation({
    summary: '생성된 Proof를 검증',
  })
  async verifyProof(@Body() dto: ProofDto): Promise<boolean> {
    const {
      HolderPubKey,
      proof,
      IssuerPubKey,
      majorCode,
      message,
      params,
      vkey,
      strategy,
    } = dto;
    const verifyResult = this.verifierAPIService.verifyProof(
      proof,
      IssuerPubKey,
      majorCode,
      message,
      params,
      // TODO: 잘 쪼개지는지 테스트 필요
      Uint8Array.from(vkey.split('').map((letter) => letter.charCodeAt(0))),
      Uint8Array.from(strategy.split('').map((letter) => letter.charCodeAt(0))),
    );
    if (!verifyResult) return false;
    try {
      await this.verifierAPIService.loadProofResult(HolderPubKey);
      return true;
    } catch (error) {
      throw new CustomErrorException('Verfiy Load Failed', 502);
    }
  }
}
