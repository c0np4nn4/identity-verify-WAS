import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlarmEntity } from '@entity/alarm.entity';

@Injectable()
export class AlarmAPIService {
  constructor(
    @InjectRepository(AlarmEntity)
    private alarmRepository: Repository<AlarmEntity>,
    private readonly configService: ConfigService,
  ) {}

  // VERIFY_PROOF = this.configService.get<string>('API_VERIFY_PROOF');

  /*
    @ Use: Alarm Controller - getAlarmList()
    @ Intend: 알림 리스트 조회
  */
  async getAlarmList(userPk: string) {
    return;
  }

  /*
    @ Use: Alarm Controller - getSingleAlarm()
    @ Intend: 단일 알림 조회
  */
  async getSingleAlarm(alarmPk: number) {
    return;
  }
}
