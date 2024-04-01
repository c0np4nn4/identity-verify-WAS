import { Body, Controller, Get, Post, Query, UseFilters } from '@nestjs/common';
import { ServiceAPIService } from './service-api.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProofDto } from '../dto/proof.dto';
import { CustomExceptionFilter } from '../filter/exception.filter';
import { CustomErrorException } from 'src/filter/custom-error.exception';
import { RegisterUserDto } from 'src/dto/user-register.dto';
import { EmailSendCodeDto } from 'src/dto/email-send-code.dto';
import { LoginUserDto } from 'src/dto/user-login.dto';

@Controller('api/service')
@ApiTags('SERVICE API')
@UseFilters(CustomExceptionFilter)
export class ServiceAPIController {
  constructor(private readonly serviceAPIService: ServiceAPIService) {}

  /* 
    Web Application Service API
  */

  @Post('/v1/register')
  @ApiOperation({
    summary: '1차 회원가입',
  })
  async registerUser(@Body() dto: RegisterUserDto) {
    try {
      return await this.serviceAPIService.registerUser(dto);
    } catch (error) {
      throw new CustomErrorException('Register Failed', 500);
    }
  }

  @Post('/v1/login')
  @ApiOperation({
    summary: '1차 로그인',
  })
  async LoginUser(@Body() dto: LoginUserDto) {
    try {
      return await this.serviceAPIService.loginUser(dto);
    } catch (error) {
      throw new CustomErrorException('Login Failed', 500);
    }
  }

  @Post('/v1/send-email')
  @ApiOperation({
    summary: '2차 회원가입 이메일 인증 코드 발송',
  })
  async sendEmailCode(@Body() dto: EmailSendCodeDto) {
    try {
      return await this.serviceAPIService.sendEmailCode(dto);
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
  async verifyEmailCode(
    @Query('email') email: string,
    @Query('code') code: string,
    @Query('studentNumber') studentNumber: string,
  ) {
    const isEmailVerified = await this.serviceAPIService.verfiyEmailCode(email, code);
    if (!isEmailVerified.result) {
      return { statusCode: 400, data: { message: isEmailVerified.message } };
    }
    const isMajorVerified = await this.serviceAPIService.verifyMajorMatch(email, studentNumber)
    if (!isMajorVerified.result) {
      return { statusCode: 400, data: { message: isMajorVerified.message } };
    }
    return { statusCode: 200 };
  }



  /* 
    Protocol API
  */

  @Post('verify-proof')
  @ApiOperation({
    summary: '생성된 Proof를 검증하기 위해 Verifier 서버로 프록시',
  })
  async verifyProof(@Body() dto: ProofDto): Promise<boolean> {
    return await this.serviceAPIService.verifyProof(dto);
  }

  //! Init API
  @Post('init-mock')
  @ApiOperation({
    summary: 'INIT 주의) student 테이블의 데이터 mocking',
  })
  async initMock() {
    // try {
    //   return await this.serviceAPIService.initMock();
    // } catch (error) {
    //   throw new CustomErrorException('Init Mock Failed', 500);
    // }
    return;
  }
}
