import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AlarmEntity } from '../../entity/alarm.entity';

@Injectable()
export class AlarmAPIService {
  constructor(
    @InjectRepository(AlarmEntity)
    private alarmRepository: Repository<AlarmEntity>,
  ) {}

  /*
    @ Use: Alarm Controller - getAlarmList()
    @ Intend: 알림 리스트 조회
  */
  async getAlarmList(userPk: string) {
    return await this.alarmRepository.find({ where: { userPk } });
  }

  /*
    @ Use: Alarm Controller - getSingleAlarm()
    @ Intend: 단일 알림 조회
  */
  async getSingleAlarm(alarmPk: number) {
    return await this.alarmRepository.findOne({ where: { pk: alarmPk } });
  }

  // /*
  //   @ Use: MatchLog Controller - sendIsItMe()
  //   @ Intend: 알림 전송
  // */
  // async addAlarm(
  //   userPk: string,
  //   matchLogPk: number,
  //   text: string,
  //   manager: EntityManager,
  // ) {
  //   return await manager.insert(AlarmEntity, {
  //     userPk,
  //     matchLogPk,
  //     text,
  //   });
  // }

  /*
    @ Use: MatchLog Controller - sendIsItMe()
    @ Intend: match 알림 전송
  */
  async addMatchAlarm(
    sendUserPk: string,
    receiveUserPk: string,
    sendMatchLogPk: number,
    receiveMatchLogPk: number,
    text: string,
    manager: EntityManager,
  ) {
    await manager.insert(AlarmEntity, {
      userPk: sendUserPk,
      matchLogPk: sendMatchLogPk,
      text,
    });
    await manager.insert(AlarmEntity, {
      userPk: receiveUserPk,
      matchLogPk: receiveMatchLogPk,
      text,
    });
  }
}
