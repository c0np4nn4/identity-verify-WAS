import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { IssuerAPIService } from './issuer-api.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UserVCDto } from '../dto/user-vc.dto';
import { CustomErrorException } from '../filter/custom-error.exception';

@Controller('api/issuer')
@ApiTags('Issuer API')
export class IssuerAPIController {
  constructor(private readonly issuerAPIService: IssuerAPIService) {}

  // * Holder에서 호출
  @Post('/create-vc')
  @ApiOperation({
    summary: 'HOLDER 호출) 사용자 VC 생성 후 블록체인에 키체인 적재',
  })
  async createUserVC(@Body() dto: UserVCDto) {
    const { vc } = this.issuerAPIService.createUserVC(dto);
    const vcString = JSON.stringify(vc);
    const issuerPubKey = this.issuerAPIService.getIssuerPubKey();
    try {
      await this.issuerAPIService.loadKeyChain(issuerPubKey, vcString);
      return { issuerPubKey, vc: vcString };
    } catch (error) {
      throw new CustomErrorException('Block Chain Load Failed', 500);
    }
  }

  // * Holder에서 호출
  @Post('/generate-proof-value')
  @ApiOperation({
    summary: 'HOLDER 호출) base58 string[64] 형태 Proof Value 생성',
  })
  async generateProofValue() {
    return await this.issuerAPIService.generateProofValue();
  }
}
