/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { UserVCDto } from '../dto/user-vc.dto';
import { connectToNEARContract, createVC } from '../utils/utils';
import { NEARContract } from '../types/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as ed25519 from '@stablelib/ed25519';
import { StudentKeyPairEntity } from '../entity/student-key-pair.entity';
const bs58 = require('bs58');
const bcrypt = require('bcryptjs');

@Injectable()
export class IssuerAPIService {
  constructor(
    @InjectRepository(StudentKeyPairEntity)
    private studentKeyPairRepository: Repository<StudentKeyPairEntity>,
    private readonly configService: ConfigService,
  ) {}

  ISSUER_PUB_KEY = this.configService.get<string>('ISSUER_PUB_KEY');
  ISSUER_PRI_KEY = this.configService.get<string>('ISSUER_PRI_KEY');

  /*
    @ Use: Issuer Controller - createUserVC()
    @ Intend: did 규격에 맞게 VC object 생성
  */
  createUserVC(dto: UserVCDto) {
    const { studentMajorCode, holderPubKey } = dto;
    const uuid = uuidv4();
    const vc = createVC(uuid, studentMajorCode, holderPubKey);
    return { uuid, vc };
  }

  /*
    @ Use: Issuer Controller - createUserVC()
    @ Intend: hash한 VC를 Near 네트워크에 적재
  */
  async loadKeyChain(issuerPubKey: string, vc: string) {
    const contract = await connectToNEARContract();

    // { Issuer Pub Key : Hash(VC) } 적재
    const hashVC = await bcrypt.hash(vc, 10);
    await (contract as NEARContract).load_hashed_vc({
      issuer_did: `did:near:${issuerPubKey}`,
      hashed_vc: hashVC,
    });

    // 제대로 적재 되었는지 확인
    const response = await (contract as NEARContract).get_hashed_vcs({
      issuer_did: `did:near:${issuerPubKey}`,
    });

    console.log(`[+] hashed VCs from issuer '${issuerPubKey}': ${response}`);
    return response;
  }

  /*
    @ Use: Issuer Controller - generateProofValue()
    @ Intend: VC에 sign하기 위해 Issuer Pri Key로 sign한 값을 반환
    * Info: Key는 일단 env 파일로 관리
  */
  generateProofValue() {
    // Issuer Key Pair 생성
    // => Public Key: 32자리 base58 / Private Key: 64자리 base58

    // VC sign 목적 proofValue 생성
    // Private Key로 msg를 sign함
    // => Proof Value: 64자리 base58
    const message = `pnu_${uuidv4()}`;
    return {
      proofValue: bs58.encode(
        ed25519.sign(bs58.decode(this.ISSUER_PRI_KEY), Buffer.from(message)),
      ),
      message,
    };
  }

  /*
    @ Use: Issuer Controller - createUserVC()
    @ Intend: Issuer Pub Key를 반환
    ? Issuer Pub Key는 이렇게 안생겼는데
  */
  // TODO: env 파일에서 Issuer Pub Key 가져와서 반환
  getIssuerPubKey() {
    return 'quixotic-debt.testnet';
  }

  /*
    @ Use: Issuer Controller - verifyMatchMajor()
    @ Intend: 학과 본부 DB라 가정, 이메일 - 학번 매칭을 검증
  */
  async verifyMatchMajor(
    email: string,
    studentNumber: string,
  ): Promise<{ result: boolean }> {
    const studentPair = await this.studentKeyPairRepository.findOne({
      where: { email, studentNumber },
    });
    if (!studentPair) {
      return { result: false };
    }
    return { result: true };
  }
}
