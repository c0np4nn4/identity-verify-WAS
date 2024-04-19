import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoatEntity } from '@entity/boat.entity';

@Injectable()
export class BoatAPIService {
  constructor(
    @InjectRepository(BoatEntity)
    private boatRepository: Repository<BoatEntity>,
    private readonly configService: ConfigService,
  ) {}

  // VERIFY_PROOF = this.configService.get<string>('API_VERIFY_PROOF');

  /*
    @ Use: Boat Controller - getBoatList()
    @ Intend: 종이배 리스트 조회
  */
  async getBoatList(userPk: string) {
    return;
  }

  /*
    @ Use: Boat Controller - getFilteredBoatList()
    @ Intend: 조건에 맞게 필터링 된 종이배 리스트 조회
  */
  async getFilteredBoatList(
    userPk: string,
    filter1: string,
    filter2: string,
    filter3: string,
    filter4: string,
    filter5: string,
  ) {
    return;
  }

  /*
    @ Use: Boat Controller - getSingleBoat()
    @ Intend: 단일 종이배 조회
  */
  async getSingleBoat(boatPk: string) {
    return;
  }
}
