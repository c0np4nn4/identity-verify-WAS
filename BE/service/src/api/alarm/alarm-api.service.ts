import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlarmEntity } from '@entity/alarm.entity';

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
}
