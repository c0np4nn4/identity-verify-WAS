import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Not, Repository } from 'typeorm';
import { BoatEntity } from '../../entity/boat.entity';
import { CreateBoatDto } from 'src/dto/boat-create.dto';

@Injectable()
export class BoatAPIService {
  constructor(
    @InjectRepository(BoatEntity)
    private boatRepository: Repository<BoatEntity>,
  ) {}

  /*
    @ Use: Boat Controller - getBoatList()
    @ Intend: 종이배 리스트 조회
  */
  async getBoatList(userPk: string) {
    return await this.boatRepository.find({
      where: { userPk: Not(userPk), isOccupied: false },
    });
  }

  /*
    @ Use: Boat Controller - getFilteredBoatList()
    @ Intend: 조건에 맞게 필터링 된 종이배 리스트 조회
    * Description: 현재 정해진 특정 라벨의 종류만 filtering 가능하도록 구현한 상태
  */
  async getFilteredBoatList(
    userPk: string,
    filter1?: string,
    filter2?: string,
    filter3?: string,
    filter4?: string,
    filter5?: string,
  ) {
    const query = this.boatRepository.createQueryBuilder('boat');

    query.where('boat.user_pk != :userPk', { userPk });
    query.andWhere('boat.is_occupied = false');

    if (filter1) query.andWhere('boat.label_1 = :filter1', { filter1 });
    if (filter2) query.andWhere('boat.label_2 = :filter2', { filter2 });
    if (filter3) query.andWhere('boat.label_3 = :filter3', { filter3 });
    if (filter4) query.andWhere('boat.label_4 = :filter4', { filter4 });
    if (filter5) query.andWhere('boat.label_5 = :filter5', { filter5 });

    const results = await query.getMany();
    return results;
  }

  /*
    @ Use: Boat Controller - getSingleBoat()
    @ Intend: 단일 종이배 조회
  */
  async getSingleBoat(boatPk: number) {
    return await this.boatRepository.findOne({ where: { pk: boatPk } });
  }

  /*
    @ Use: Boat Controller - createBoat()
    @ Intend: 종이배 생성
  */
  async createBoat(dto: CreateBoatDto) {
    return await this.boatRepository.insert(dto);
  }

  // /*
  //   @ Use: MatchLog Controller - isItMe()
  //   @ Intend: 종이배 선점 상태 변경
  // */
  // async handleBoatOccupiedStatus(boatPk: number, status: boolean) {
  //   return await this.boatRepository.update(boatPk, { isOccupied: status });
  // }

  /*
    @ Use: MatchLog Controller - isItMe()
    @ Intend: 종이배 선점 상태 변경
  */
  async handleMatchBoatOccupiedStatus(
    sendBoatPk: number,
    receiveBoatPk: number,
    status: boolean,
    manager: EntityManager,
  ) {
    await manager.update(BoatEntity, sendBoatPk, { isOccupied: status });
    await manager.update(BoatEntity, receiveBoatPk, { isOccupied: status });
    return;
  }
}
