import { Body, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomErrorException } from 'src/filter/custom-error.exception';
import { TokenGuard } from 'src/common/guard/token.guard';
import { MatchLogAPIService } from './match-log-api.service';
import { ServiceAPIService } from '../service/service-api.service';
import { AlarmAPIService } from '../alarm/alarm-api.service';
import { BoatAPIService } from '../boat/boat-api.service';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@ApiTags('MATCH LOG API')
@Controller('api/match-log')
export class MatchLogAPIController {
  constructor(
    private readonly matchLogAPIService: MatchLogAPIService,
    private readonly userAPIService: ServiceAPIService,
    private readonly alarmAPIService: AlarmAPIService,
    private readonly boatAPIService: BoatAPIService,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  @UseGuards(TokenGuard)
  @Get('/v1/send/is-it-me')
  @ApiOperation({
    summary: '혹시 나야? 요청',
  })
  async sendIsItMe(
    @Query('userPk') userPk: string,
    @Query('targetPk') targetPk: string,
  ) {
    return await this.entityManager.transaction(async (manager) => {
      try {
        // 유효한 사용자 검사
        const sendUser = await this.userAPIService.getUserData(userPk, manager);
        const targetUser = await this.userAPIService.getUserData(
          targetPk,
          manager,
        );

        if (sendUser.data.user === null || targetUser.data.user === null) {
          return { statusCode: 404, message: 'User Not Found' };
        }

        // 하트 수 검사
        if (sendUser.data.user.heart < 5) {
          return { statusCode: 400, message: 'Not Enough Heart' };
        }

        // 하트 차감
        await this.userAPIService.handleHeartOfUser(userPk, -5, manager);

        // match log 기록
        const { sendMatchLogPk, receiveMatchLogPk } =
          await this.matchLogAPIService.sendIsItMe(userPk, targetPk, manager);

        // 알림 전송
        // (userPk, matchLogPk, text)
        const message = `${targetUser.data.user.nickname}아, 이거 혹시 나야?\n${sendUser.data.user.nickname} 보냄`;
        await this.alarmAPIService.addMatchAlarm(
          userPk,
          targetPk,
          sendMatchLogPk,
          receiveMatchLogPk,
          message,
          manager,
        );

        // boat 선점하여 매칭 중지
        await this.boatAPIService.handleMatchBoatOccupiedStatus(
          sendUser.data.boat.pk,
          targetUser.data.boat.pk,
          true,
          manager,
        );

        return { statusCode: 200, message: 'Request Success' };
      } catch (error) {
        throw new CustomErrorException('Transaction Failed', 400);
      }
    });
  }

  @UseGuards(TokenGuard)
  @Get('/v1/send/my-label')
  @ApiOperation({
    summary: '내 라벨 전송',
  })
  async sendMyLabel(
    @Query('userPk') userPk: string,
    @Query('targetPk') targetPk: string,
    @Query('label1') label1: string,
    @Query('label2') label2: string,
    @Query('label3') label3: string,
  ) {
    return await this.entityManager.transaction(async (manager) => {
      try {
        // 유효한 사용자 검사
        const sendUser = await this.userAPIService.getUserData(userPk, manager);
        const targetUser = await this.userAPIService.getUserData(
          targetPk,
          manager,
        );

        if (sendUser.data.user === null || targetUser.data.user === null) {
          return { statusCode: 404, message: 'User Not Found' };
        }

        // match log 기록
        const { sendMatchLogPk, receiveMatchLogPk } =
          await this.matchLogAPIService.sendMyLabel(
            userPk,
            targetPk,
            label1,
            label2,
            label3,
            manager,
          );

        // 알림 전송
        // (userPk, matchLogPk, text)
        const senderMessage = `${targetUser.data.user.nickname}에게 라벨 전송!`;
        await this.alarmAPIService.addAlarm(
          userPk,
          sendMatchLogPk,
          senderMessage,
          manager,
        );
        const receiverMessage = `${sendUser.data.user.nickname}에게서 라벨이 도착!`;
        await this.alarmAPIService.addAlarm(
          targetPk,
          receiveMatchLogPk,
          receiverMessage,
          manager,
        );

        return { statusCode: 200, message: 'Request Success' };
      } catch (error) {
        throw new CustomErrorException('Request Failed', 400);
      }
    });
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
