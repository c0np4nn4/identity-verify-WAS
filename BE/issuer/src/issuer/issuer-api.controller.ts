import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { IssuerAPIService } from './issuer-api.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UserVCDto } from '../dto/user-vc.dto';
import { CustomErrorException } from '../filter/custom-error.exception';
import { CustomLoggerService } from '../module/custom.logger';

@Controller('api/issuer')
@ApiTags('Issuer API')
export class IssuerAPIController {
  constructor(
    private readonly issuerAPIService: IssuerAPIService,
    private readonly customLoggerService: CustomLoggerService,
  ) {}

  // * Holder에서 호출
  @Post('/create-vc')
  @ApiOperation({
    summary: 'HOLDER 호출) 사용자 VC 생성 후 블록체인에 키체인 적재',
  })
  async createUserVC(@Body() dto: UserVCDto) {
    // 적재된 DID인지 확인: 아니라면 throw
    // await this.checkIsLoadedDID(dto.holderPubKey);

    const { vc } = this.issuerAPIService.createUserVC(dto);
    const vcString = JSON.stringify(vc);
    const issuerPubKey = this.issuerAPIService.getIssuerPubKey();

    try {
      await this.issuerAPIService.loadKeyChain(issuerPubKey, vcString);
      return { issuerPubKey, vc: vcString };
    } catch (error) {
      this.customLoggerService.error('/create-vc', '사용자 VC 생성 실패', {
        ...dto,
        vc,
        issuerPubKey,
      });
      throw new CustomErrorException('Block Chain Load Failed', 500);
    }
  }

  // * Holder에서 호출
  @Post('/generate-proof-value')
  @ApiOperation({
    summary: 'HOLDER 호출) base58 string[64] 형태 Proof Value 생성',
  })
  async generateProofValue() {
    try {
      return await this.issuerAPIService.generateProofValue();
    } catch (error) {
      this.customLoggerService.error(
        '/generate-proof-value',
        'Proof Value 생성 실패',
        {},
      );
      throw new CustomErrorException('Proof Value Generate Failed', 500);
    }
  }

  // createUserVC()에서 사용
  async checkIsLoadedDID(hpubkey: string) {
    try {
      const response = await this.issuerAPIService.checkIsLoadedDID(hpubkey);
      console.log(response);
    } catch (error) {
      this.customLoggerService.error('/create-vc', '적재되지 않은 DID', {
        hpubkey,
      });
      throw new CustomErrorException('Loaded DID Check Failed', 500);
    }
  }
}
