import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { HolderAPIService } from './holder-api.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UserVCDto } from '../dto/user-vc.dto';
import { EmailSendCodeDto } from '../dto/email-send-code.dto';
import { CustomErrorException } from '../filter/custom-error.exception';

@Controller('api/holder')
@ApiTags('HOLDER API')
export class HolderAPIController {
  constructor(private readonly holderAPIService: HolderAPIService) {}

  @Post('/create-vc')
  @ApiOperation({
    summary: '사용자 VC 생성',
  })
  async createUserVC(@Body() dto: UserVCDto) {
    try {
      const { issuerPubKey, vc } =
        await this.holderAPIService.createUserVC(dto);
      const { proofValue, message } =
        await this.holderAPIService.getProofValue();
      const rawVC = JSON.parse(vc);
      Object.assign(rawVC, { proofValue });
      return {
        statusCode: 200,
        data: { issuerPubKey, vc: JSON.stringify(rawVC), message },
      };
    } catch (error) {
      throw new CustomErrorException('User VC Create Failed', 500);
    }
  }

  @Post('/v1/send-email')
  @ApiOperation({
    summary: '2차 회원가입 이메일 인증 코드 발송',
  })
  async sendEmailCode(@Body() dto: EmailSendCodeDto) {
    const { email } = dto;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new CustomErrorException('Invalid Email', 400);
    }
    try {
      const token = await this.holderAPIService.sendEmailCode(dto);
      return { statusCode: 200, data: { token } };
    } catch (error) {
      throw new CustomErrorException('Send Email Failed', 500);
    }
  }
}
