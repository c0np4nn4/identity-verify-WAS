import { Body, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomErrorException } from 'src/filter/custom-error.exception';
import { TokenGuard } from 'src/common/guard/token.guard';
import { MatchLogAPIService } from './match-log-api.service';

@ApiTags('MATCH LOG API')
@Controller('api/match-log')
export class MatchLogAPIController {
  constructor(private readonly matchLogAPIService: MatchLogAPIService) {}

  @UseGuards(TokenGuard)
  @Get('/v1/send/is-it-me')
  @ApiOperation({
    summary: '혹시 나야? 요청',
  })
  async sendIsItMe(
    @Query('userPk') userPk: string,
    @Query('targetPk') targetPk: string,
    @Query('status') status: string,
  ) {
    try {
      return await this.matchLogAPIService.sendIsItMe(userPk, targetPk, status);
    } catch (error) {
      throw new CustomErrorException('Request Failed', 400);
    }
  }

  @UseGuards(TokenGuard)
  @Get('/v1/send/my-label')
  @ApiOperation({
    summary: '내 라벨 전송',
  })
  async sendMyLabel(
    @Query('userPk') userPk: string,
    @Query('targetPk') targetPk: string,
    @Query('status') status: string,
    @Query('label1') label1: string,
    @Query('label2') label2: string,
    @Query('label3') label3: string,
  ) {
    try {
      return await this.matchLogAPIService.sendMyLabel(
        userPk,
        targetPk,
        status,
        label1,
        label2,
        label3,
      );
    } catch (error) {
      throw new CustomErrorException('Request Failed', 400);
    }
  }

  @UseGuards(TokenGuard)
  @Get('/v1/send/wrong-person')
  @ApiOperation({
    summary: '사람 잘못 봤습니다 요청',
  })
  async sendWrongPerson(
    @Query('userPk') userPk: string,
    @Query('targetPk') targetPk: string,
    @Query('status') status: string,
  ) {
    try {
      return await this.matchLogAPIService.sendWrongPerson(
        userPk,
        targetPk,
        status,
      );
    } catch (error) {
      throw new CustomErrorException('Request Failed', 400);
    }
  }

  @UseGuards(TokenGuard)
  @Get('/v1/send/real-name')
  @ApiOperation({
    summary: '진짜 이름 전송 요청',
  })
  async sendRealName(
    @Query('userPk') userPk: string,
    @Query('targetPk') targetPk: string,
    @Query('status') status: string,
    @Query('name') name: string,
  ) {
    try {
      return await this.matchLogAPIService.sendRealName(
        userPk,
        targetPk,
        status,
        name,
      );
    } catch (error) {
      throw new CustomErrorException('Request Failed', 400);
    }
  }

  @UseGuards(TokenGuard)
  @Get('/v1/send/reject-sign')
  @ApiOperation({
    summary: '거절 요청',
  })
  async sendRejectSign(
    @Query('userPk') userPk: string,
    @Query('targetPk') targetPk: string,
    @Query('status') status: string,
  ) {
    try {
      return await this.matchLogAPIService.sendRejectSign(
        userPk,
        targetPk,
        status,
      );
    } catch (error) {
      throw new CustomErrorException('Request Failed', 400);
    }
  }

  @UseGuards(TokenGuard)
  @Get('/v1/send/correct-sign')
  @ApiOperation({
    summary: '매칭 성공 요청',
  })
  async sendCorrectSign(
    @Query('userPk') userPk: string,
    @Query('targetPk') targetPk: string,
    @Query('status') status: string,
    @Query('answer') answer: string,
  ) {
    try {
      return await this.matchLogAPIService.sendCorrectSign(
        userPk,
        targetPk,
        status,
        answer,
      );
    } catch (error) {
      throw new CustomErrorException('Request Failed', 400);
    }
  }
}
