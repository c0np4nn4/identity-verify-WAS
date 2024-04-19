import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchLogEntity } from '@entity/match-log.entity';

@Injectable()
export class MatchLogAPIService {
  constructor(
    @InjectRepository(MatchLogEntity)
    private matchLogRepository: Repository<MatchLogEntity>,
    private readonly configService: ConfigService,
  ) {}

  // VERIFY_PROOF = this.configService.get<string>('API_VERIFY_PROOF');

  /*
    @ Use: Match Log Controller - sendIsItMe()
    @ Intend: 혹시 나야? 요청
  */
  async sendIsItMe(userPk: string, targetPk: string, status: string) {
    return;
  }

  /*
    @ Use: Match Log Controller - sendMyLabel()
    @ Intend: 내 라벨 전송
  */
  async sendMyLabel(
    userPk: string,
    targetPk: string,
    status: string,
    label1: string,
    label2: string,
    label3: string,
  ) {
    return;
  }

  /*
    @ Use: Match Log Controller - sendWrongPerson()
    @ Intend: 사람 잘못 봤습니다 요청 (종료)
  */
  async sendWrongPerson(userPk: string, targetPk: string, status: string) {
    return;
  }

  /*
    @ Use: Match Log Controller - sendRealName()
    @ Intend: 진짜 이름 전송 요청
  */
  async sendRealName(
    userPk: string,
    targetPk: string,
    status: string,
    name: string,
  ) {
    return;
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
