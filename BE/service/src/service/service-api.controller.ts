import { Body, Controller, Get, Post, Query, UseFilters } from '@nestjs/common';
import { ServiceAPIService } from './service-api.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProofDto } from '../dto/proof.dto';
import { CustomExceptionFilter } from '../filter/exception.filter';
import { CustomErrorException } from 'src/filter/custom-error.exception';
import { RegisterUserDto } from 'src/dto/user-register.dto';
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

  /* 
    Protocol API
  */

  @Post('verify-proof')
  @ApiOperation({
    summary: '생성된 Proof를 검증하기 위해 Verifier 서버로 프록시',
  })
  async verifyProof(@Body() dto: ProofDto) {
    const result = await this.serviceAPIService.verifyProof(dto);
    return result === true ? { statusCode: 200 } : { statusCode: 400 };
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
