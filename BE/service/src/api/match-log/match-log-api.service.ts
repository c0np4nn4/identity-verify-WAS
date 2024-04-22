import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { MatchLogEntity } from '@entity/match-log.entity';
import { MATCH_STATUS } from 'src/common/const';

@Injectable()
export class MatchLogAPIService {
  constructor(
    @InjectRepository(MatchLogEntity)
    private matchLogRepository: Repository<MatchLogEntity>,
  ) {}

  /*
    @ Use: Match Log Controller - sendIsItMe()
    @ Intend: 혹시 나야? 요청
  */
  async sendIsItMe(userPk: string, targetPk: string, manager: EntityManager) {
    const sendMatchLog = await manager.save(MatchLogEntity, {
      userPk,
      targetPk,
      status: MATCH_STATUS['IS_IT_ME_SEND'],
    });
    const receiveMatchLog = await manager.save(MatchLogEntity, {
      userPk: targetPk,
      targetPk: userPk,
      status: MATCH_STATUS['IS_IT_ME_RECEIVE'],
    });
    return {
      sendMatchLogPk: sendMatchLog.pk,
      receiveMatchLogPk: receiveMatchLog.pk,
    };
  }

  /*
    @ Use: Match Log Controller - sendMyLabel()
    @ Intend: 내 라벨 전송
  */
  async sendMyLabel(
    userPk: string,
    targetPk: string,
    label1: string,
    label2: string,
    label3: string,
    manager: EntityManager,
  ) {
    const sendMatchLog = await manager.save(MatchLogEntity, {
      userPk,
      targetPk,
      status: MATCH_STATUS['POST_LABEL_SEND'],
      label1,
      label2,
      label3,
    });
    const receiveMatchLog = await manager.save(MatchLogEntity, {
      userPk: targetPk,
      targetPk: userPk,
      status: MATCH_STATUS['POST_LABEL_RECEIVE'],
      label1,
      label2,
      label3,
    });
    return {
      sendMatchLogPk: sendMatchLog.pk,
      receiveMatchLogPk: receiveMatchLog.pk,
    };
  }

  /*
    @ Use: Match Log Controller - sendWrongPerson()
    @ Intend: 사람 잘못 봤습니다 요청 (종료)
  */
  async sendWrongPerson(
    userPk: string,
    targetPk: string,
    manager: EntityManager,
  ) {
    const sendMatchLog = await manager.save(MatchLogEntity, {
      userPk,
      targetPk,
      status: MATCH_STATUS['WRONG_SEND'],
    });
    const receiveMatchLog = await manager.save(MatchLogEntity, {
      userPk: targetPk,
      targetPk: userPk,
      status: MATCH_STATUS['WRONG_RECEIVE'],
    });
    return {
      sendMatchLogPk: sendMatchLog.pk,
      receiveMatchLogPk: receiveMatchLog.pk,
    };
  }

  /*
    @ Use: Match Log Controller - sendRealName()
    @ Intend: 진짜 이름 전송 요청
  */
  async sendRealName(
    userPk: string,
    targetPk: string,
    name: string,
    manager: EntityManager,
  ) {
    const sendMatchLog = await manager.save(MatchLogEntity, {
      userPk,
      targetPk,
      status: MATCH_STATUS['NAME_SEND'],
    });
    const receiveMatchLog = await manager.save(MatchLogEntity, {
      userPk: targetPk,
      targetPk: userPk,
      status: MATCH_STATUS['NAME_RECEIVE'],
    });
    return {
      sendMatchLogPk: sendMatchLog.pk,
      receiveMatchLogPk: receiveMatchLog.pk,
    };
  }

  /*
    @ Use: Match Log Controller - sendRejectSign()
    @ Intend: 거절 요청 (종료)
  */
  async sendRejectSign(userPk: string, targetPk: string, status: string) {
    return;
  }

  /*
    @ Use: Match Log Controller - sendCorrectSign()
    @ Intend: 매칭 성공 요청 (종료)
  */
  async sendCorrectSign(
    userPk: string,
    targetPk: string,
    status: string,
    answer: string,
  ) {
    return;
  }
}
