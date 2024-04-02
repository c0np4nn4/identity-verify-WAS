import { Body, Controller, Get, Post, Query, UseFilters } from '@nestjs/common';
import { HolderAPIService } from './holder-api.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UserVCDto } from '../dto/user-vc.dto';
import { CustomExceptionFilter } from '../filter/exception.filter';
import { EmailSendCodeDto } from '../dto/email-send-code.dto';
import { CustomErrorException } from '../filter/custom-error.exception';

@Controller('api/holder')
@ApiTags('HOLDER API')
@UseFilters(CustomExceptionFilter)
export class HolderAPIController {
  constructor(private readonly holderAPIService: HolderAPIService) {}

  @Post('/create-vc')
  @ApiOperation({
    summary: '사용자 VC 생성',
  })
  async createUserVC(@Body() dto: UserVCDto) {
    const { issuerPubKey, vc } = await this.holderAPIService.createUserVC(dto);
    const { proofValue, message } = await this.holderAPIService.getProofValue();
    const rawVC = JSON.parse(vc);
    Object.assign(rawVC, { proofValue });
    return {
      statusCode: 200,
      data: { issuerPubKey, vc: JSON.stringify(rawVC), message },
    };
  }

  @Post('/v1/send-email')
  @ApiOperation({
    summary: '2차 회원가입 이메일 인증 코드 발송',
  })
  async sendEmailCode(@Body() dto: EmailSendCodeDto) {
    try {
      return await this.holderAPIService.sendEmailCode(dto);
    } catch (error) {
      throw new CustomErrorException('Send Email Failed', 500);
    }
  }

  @Get('/v1/verify-email')
  @ApiOperation({
    summary: '2차 회원가입 이메일 인증 코드 검증 및 학과 매칭 검증',
  })
  @ApiQuery({
    name: 'email',
    description: '인증할 이메일 주소',
  })
  @ApiQuery({
    name: 'code',
    description: '이메일로 받은 인증 코드',
  })
  @ApiQuery({
    name: 'studentNumber',
    description: '학번',
  })
  async verifyEmailCode(
    @Query('email') email: string,
    @Query('code') code: string,
    @Query('studentNumber') studentNumber: string,
  ) {
    const isEmailVerified = await this.holderAPIService.verfiyEmailCode(email, code);
    if (!isEmailVerified.result) {
      return { statusCode: 400, data: { message: isEmailVerified.message } };
    }
    const isMajorVerified = await this.holderAPIService.verifyMajorMatch(email, studentNumber)
    if (!isMajorVerified.result) {
      return { statusCode: 400, data: { message: isMajorVerified.message } };
    }
    return { statusCode: 200 };
  }
}

