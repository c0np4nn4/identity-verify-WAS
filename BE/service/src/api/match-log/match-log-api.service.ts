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
    @ Intend: 
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
    @ Intend: 
  */
  async sendWrongPerson(userPk: string, targetPk: string, status: string) {
    return;
  }

  /*
    @ Use: Match Log Controller - sendRealName()
    @ Intend: 
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
    @ Intend: 
  */
  async sendRejectSign(userPk: string, targetPk: string, status: string) {
    return;
  }

  /*
    @ Use: Match Log Controller - sendCorrectSign()
    @ Intend: 
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
