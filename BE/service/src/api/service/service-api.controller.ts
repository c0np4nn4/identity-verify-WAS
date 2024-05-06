import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ServiceAPIService } from './service-api.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProofDto } from '../../dto/proof.dto';
import { CustomErrorException } from 'src/filter/custom-error.exception';
import { RegisterUserDto } from 'src/dto/user-register.dto';
import { LoginUserDto } from 'src/dto/user-login.dto';
import { TokenGuard } from 'src/common/guard/token.guard';
import { CustomLoggerService } from 'src/module/custom.logger';
import { WHERE } from 'src/common/const';

@ApiTags('SERVICE API')
@Controller('api/service')
export class ServiceAPIController {
  constructor(
    private readonly serviceAPIService: ServiceAPIService,
    private readonly customLoggerService: CustomLoggerService,
  ) {}

  /* 
    ! Web Application Service API
  */

  @Post('/v1/register')
  @ApiOperation({
    summary: '1차 회원가입',
  })
  async registerUser(@Body() dto: RegisterUserDto) {
    try {
      return await this.serviceAPIService.registerUser(dto);
    } catch (error) {
      this.customLoggerService.error(
        WHERE['SERVICE'],
        '/v1/register',
        '1차 회원가입 실패',
        {
          ...dto,
        },
      );
      throw new CustomErrorException('Register Failed', 500);
    }
  }

  @Post('/v1/login')
  @ApiOperation({
    summary: '1차 로그인',
  })
  async loginUser(@Body() dto: LoginUserDto) {
    try {
      return await this.serviceAPIService.loginUser(dto);
    } catch (error) {
      this.customLoggerService.error(
        WHERE['SERVICE'],
        '/v1/login',
        '1차 로그인 실패',
        {
          ...dto,
        },
      );
      throw new CustomErrorException('Login Failed', 500);
    }
  }

  @UseGuards(TokenGuard)
  @Get('/v1/get-user-info')
  @ApiOperation({
    summary: '사용자 정보 추출',
  })
  async getUserInfo(@Req() req: Request) {
    try {
      const token = req.headers['token'];
      return await this.serviceAPIService.getUserInfoByToken(token);
    } catch (error) {
      this.customLoggerService.error(
        WHERE['SERVICE'],
        '/v1/get-user-info',
        '사용자 정보 조회 실패',
        {
          token: req?.headers['token'],
        },
      );
      throw new CustomErrorException('Get User Info Failed', 500);
    }
  }

  /* 
    ! Protocol API
  */

  @Post('verify-proof')
  @ApiOperation({
    summary: '생성된 Proof를 검증하기 위해 Verifier 서버로 프록시',
  })
  async verifyProof(@Body() dto: ProofDto) {
    const result = await this.serviceAPIService.verifyProof(dto);
    return result === true ? { statusCode: 200 } : { statusCode: 400 };
  }
}
