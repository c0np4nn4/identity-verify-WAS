import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { HolderAPIService } from './holder-api.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UserVCDto } from '../dto/user-vc.dto';
import { EmailSendCodeDto } from '../dto/email-send-code.dto';
import { CustomErrorException } from '../filter/custom-error.exception';
import { CustomLoggerService } from '../module/custom.logger';

@Controller('api/holder')
@ApiTags('HOLDER API')
export class HolderAPIController {
  constructor(
    private readonly holderAPIService: HolderAPIService,
    private readonly customLoggerService: CustomLoggerService,
  ) {}

  @Post('/reg-did')
  @ApiOperation({
    summary: 'Holder DID 생성 및 적재',
  })
  async registerDID(@Body() dto: UserVCDto) {
    try {
      // DID를 Near 네트워크에 적재
      const result = await this.holderAPIService.loadDID(dto.holderPubKey);
      return { statusCode: 200, data: { result } };
    } catch (error) {
      this.customLoggerService.error('/reg-did', 'Holder DID 생성 실패', {});
      throw new CustomErrorException('Register DID Failed', 500);
    }
  }

  @Post('/create-vc')
  @ApiOperation({
    summary: '사용자 VC 생성',
  })
  async createUserVC(@Body() dto: UserVCDto) {
    try {
      const { issuerPubKey, vc, message } =
        await this.holderAPIService.createUserVC(dto);
      return {
        statusCode: 200,
        data: { issuerPubKey, vc, message },
      };
    } catch (error) {
      this.customLoggerService.error('/create-vc', '사용자 VC 생성 실패', dto);
      throw new CustomErrorException('User VC Create Failed', 500);
    }
  }

  @Post('/v1/send-email')
  @ApiOperation({
    summary: '2차 회원가입 이메일 인증 코드 발송',
  })
  async sendEmailCode(@Body() dto: EmailSendCodeDto) {
    const { email } = dto;
    const emailRegex = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/gm;
    if (!emailRegex.test(email)) {
      throw new CustomErrorException('Invalid Email', 400);
    }
    try {
      const token = await this.holderAPIService.sendEmailCode(dto);
      return { statusCode: 200, data: { token } };
    } catch (error) {
      this.customLoggerService.error('/v1/send-email', '이메일 전송 에러', dto);
      throw new CustomErrorException('Send Email Failed', 500);
    }
  }
}
