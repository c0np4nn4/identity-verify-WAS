import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomErrorException } from 'src/filter/custom-error.exception';
import { TokenGuard } from 'src/common/guard/token.guard';
import { MatchLogAPIService } from './match-log-api.service';
import { ServiceAPIService } from '../service/service-api.service';
import { AlarmAPIService } from '../alarm/alarm-api.service';
import { BoatAPIService } from '../boat/boat-api.service';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { MatchLogSendDto } from 'src/dto/matchlog-send.dto';
import { MatchLogLabelDto } from 'src/dto/matchlog-label.dto';
import { MatchLogNameDto } from 'src/dto/matchlog-name.dto';
import { MatchLogAnswerDto } from 'src/dto/matchlog.answer.dto';

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

  // ! Test 용이므로 주의
  @Post('/v1/mock-create')
  @ApiOperation({
    summary: 'a, b라는 사용자에 대해 각각 Boat 1개씩, Alarm 1개씩 생성',
  })
  async createMock() {
    return await this.entityManager.transaction(async (manager) => {
      try {
        // boat 생성
        await this.boatAPIService.createBoat({
          userPk: 'a',
          label1: 'l1',
          label2: 'l2',
          label3: 'l3',
          isOccupied: false,
        });
        await this.boatAPIService.createBoat({
          userPk: 'b',
          label1: 'l1',
          label2: 'l2',
          label3: 'l3',
          isOccupied: false,
        });

        // match log 생성
        await this.matchLogAPIService.sendCorrectSign('a', 'b', 'YES', manager);

        // alarm 전송
        // (userPk, matchLogPk, text)
        const message = `b에게, a가`;
        await this.alarmAPIService.addMatchAlarm(
          'a',
          'b',
          1,
          2,
          message,
          manager,
        );
        return true;
      } catch (error) {
        return false;
      }
    });
  }

  @UseGuards(TokenGuard)
  @Post('/v1/send/is-it-me')
  @ApiOperation({
    summary: '혹시 나야? 요청',
  })
  async sendIsItMe(@Body() dto: MatchLogSendDto) {
    return await this.entityManager.transaction(async (manager) => {
      try {
        const { userPk, targetPk } = dto;
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
        const message = `${targetUser.data.user.nickname}에게, ${sendUser.data.user.nickname}가`;
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
  @Post('/v1/send/my-label')
  @ApiOperation({
    summary: '내 라벨 전송',
  })
  async sendMyLabel(@Body() dto: MatchLogLabelDto) {
    return await this.entityManager.transaction(async (manager) => {
      const { userPk, targetPk, label1, label2, label3 } = dto;
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
        const message = `${targetUser.data.user.nickname}에게, ${sendUser.data.user.nickname}가`;
        await this.alarmAPIService.addMatchAlarm(
          userPk,
          targetPk,
          sendMatchLogPk,
          receiveMatchLogPk,
          message,
          manager,
        );

        return { statusCode: 200, message: 'Request Success' };
      } catch (error) {
        throw new CustomErrorException('Request Failed', 400);
      }
    });
  }

  @UseGuards(TokenGuard)
  @Post('/v1/send/wrong-person')
  @ApiOperation({
    summary: '사람 잘못 봤습니다 요청',
  })
  async sendWrongPerson(@Body() dto: MatchLogSendDto) {
    return await this.entityManager.transaction(async (manager) => {
      try {
        const { userPk, targetPk } = dto;
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
          await this.matchLogAPIService.sendWrongPerson(
            userPk,
            targetPk,
            manager,
          );

        // 알림 전송
        // (userPk, matchLogPk, text)
        const message = `${targetUser.data.user.nickname}에게, ${sendUser.data.user.nickname}가`;
        await this.alarmAPIService.addMatchAlarm(
          userPk,
          targetPk,
          sendMatchLogPk,
          receiveMatchLogPk,
          message,
          manager,
        );

        // boat 선점 해제
        await this.boatAPIService.handleMatchBoatOccupiedStatus(
          sendUser.data.boat.pk,
          targetUser.data.boat.pk,
          false,
          manager,
        );

        return { statusCode: 200, message: 'Request Success' };
      } catch (error) {
        throw new CustomErrorException('Request Failed', 400);
      }
    });
  }

  @UseGuards(TokenGuard)
  @Post('/v1/send/real-name')
  @ApiOperation({
    summary: '진짜 이름 전송 요청',
  })
  async sendRealName(@Body() dto: MatchLogNameDto) {
    return await this.entityManager.transaction(async (manager) => {
      try {
        const { userPk, targetPk, name } = dto;
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
          await this.matchLogAPIService.sendRealName(
            userPk,
            targetPk,
            name,
            manager,
          );

        // 알림 전송
        // (userPk, matchLogPk, text)
        const message = `${targetUser.data.user.nickname}에게, ${sendUser.data.user.nickname}가`;
        await this.alarmAPIService.addMatchAlarm(
          userPk,
          targetPk,
          sendMatchLogPk,
          receiveMatchLogPk,
          message,
          manager,
        );

        return { statusCode: 200, message: 'Request Success' };
      } catch (error) {
        throw new CustomErrorException('Request Failed', 400);
      }
    });
  }

  @UseGuards(TokenGuard)
  @Post('/v1/send/reject-sign')
  @ApiOperation({
    summary: '거절 요청',
  })
  async sendRejectSign(@Body() dto: MatchLogSendDto) {
    return await this.entityManager.transaction(async (manager) => {
      try {
        const { userPk, targetPk } = dto;
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
          await this.matchLogAPIService.sendRejectSign(
            userPk,
            targetPk,
            manager,
          );

        // 알림 전송
        // (userPk, matchLogPk, text)
        const message = `${targetUser.data.user.nickname}에게, ${sendUser.data.user.nickname}가`;
        await this.alarmAPIService.addMatchAlarm(
          userPk,
          targetPk,
          sendMatchLogPk,
          receiveMatchLogPk,
          message,
          manager,
        );

        // 하트 차감
        await this.userAPIService.handleHeartOfUser(targetPk, 5, manager);

        // boat 선점 해제
        await this.boatAPIService.handleMatchBoatOccupiedStatus(
          sendUser.data.boat.pk,
          targetUser.data.boat.pk,
          false,
          manager,
        );

        return { statusCode: 200, message: 'Request Success' };
      } catch (error) {
        throw new CustomErrorException('Request Failed', 400);
      }
    });
  }

  @UseGuards(TokenGuard)
  @Post('/v1/send/correct-sign')
  @ApiOperation({
    summary: '매칭 성공 요청',
  })
  async sendCorrectSign(@Body() dto: MatchLogAnswerDto) {
    return await this.entityManager.transaction(async (manager) => {
      try {
        const { userPk, targetPk, answer } = dto;
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
          await this.matchLogAPIService.sendCorrectSign(
            userPk,
            targetPk,
            answer,
            manager,
          );

        // 알림 전송
        // (userPk, matchLogPk, text)
        const message = `${targetUser.data.user.nickname}에게, ${sendUser.data.user.nickname}가`;
        await this.alarmAPIService.addMatchAlarm(
          userPk,
          targetPk,
          sendMatchLogPk,
          receiveMatchLogPk,
          message,
          manager,
        );

        // boat 선점 해제
        await this.boatAPIService.handleMatchBoatOccupiedStatus(
          sendUser.data.boat.pk,
          targetUser.data.boat.pk,
          false,
          manager,
        );

        return { statusCode: 200, message: 'Request Success' };
      } catch (error) {
        throw new CustomErrorException('Request Failed', 400);
      }
    });
  }
}
