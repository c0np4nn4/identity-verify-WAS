import { Controller, Get, Query, UseFilters, Post, Body } from '@nestjs/common';
import { IssuerAPIService } from './issuer-api.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UserVCDto } from '../dto/user-vc.dto';
import { CustomExceptionFilter } from '../filter/exception.filter';
import { CustomErrorException } from '../filter/custom-error.exception';

@Controller('api/issuer')
@ApiTags('Issuer API')
@UseFilters(CustomExceptionFilter)
export class IssuerAPIController {
  constructor(private readonly issuerAPIService: IssuerAPIService) {}

  // Holder에서 호출
  @Post('/create-vc')
  @ApiOperation({
    summary: 'HOLDER 호출) 사용자 VC 생성 후 블록체인에 키체인 적재',
  })
  async createUserVC(@Body() dto: UserVCDto) {
    const { vc } = this.issuerAPIService.createUserVC(dto);
    const vcString = JSON.stringify(vc);
    const issuerPubKey = await this.issuerAPIService.getIssuerPubKey();
    try {
      // 블록체인에 키 체인 적재
      await this.issuerAPIService.loadKeyChain(issuerPubKey, vcString);
    } catch (error) {
      throw new CustomErrorException('Block Chain Load Failed', 500);
    }
    return { issuerPubKey, vc: vcString };
  }

  /*
    @ Test Pub Key, Pri Key, Sign (base58)
    - Pub Key: 5Uqg8vy52ewsmmbVvZ8osgvuXx3HtaPHVHvUqHiZxAqN
    - Pri Key: 35o77UthJ4nRdPPPSBJKqscwZ9q51tPF9wCDz9Jbm7294WiCYCKL4BJD1udK5VaJ4HytrGkwpUYQ3g2H1B41RF2Y
    - Sign: 5bshjAdAYRCiSfSv8Xg9wS7XZ9EzE1SLJbgpAk5LUmqVhcWg8BFUP5pnsqUkVEaWb5JsPP4H8UebWwTtjzZxQPRz
    - Message: pnu_uuidv4
  */

  // Holder에서 호출
  @Post('/generate-proof-value')
  @ApiOperation({
    summary: 'base58 string[64] 형태 Proof Value 생성',
  })
  generateProofValue() {
    return this.issuerAPIService.generateProofValue();
  }

  // Holder에서 호출
  @Get('/verify-major-match')
  @ApiOperation({
    summary: 'SERVICE 호출) 학과 본부라 가정, 학번 - email 매칭 여부 검증',
  })
  @ApiQuery({
    name: 'email',
    description: '인증할 이메일 주소',
  })
  @ApiQuery({
    name: 'studentNumber',
    description: '학번',
  })
  async verifyMatchMajor(
    @Query('email') email: string,
    @Query('studentNumber') studentNumber: string,
  ) {
    return await this.issuerAPIService.verifyMatchMajor(email, studentNumber);
  }
}
