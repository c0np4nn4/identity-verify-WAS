/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { UserVCDto } from '../dto/user-vc.dto';
import { connectToNEARContract, createVC } from '../utils/utils';
import { NEARContract } from '../types/types';
<<<<<<< HEAD
import * as ed25519 from '@stablelib/ed25519';
const bs58 = require('bs58');
=======
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as ed25519 from '@stablelib/ed25519';
import { StudentKeyPairEntity } from '../entity/student-key-pair.entity';
const bs58 = require('bs58');
const bcrypt = require('bcryptjs');
>>>>>>> 4b9006879fd1399d99ee374d3863f97aff149b04

@Injectable()
export class IssuerAPIService {
  constructor(
    @InjectRepository(StudentKeyPairEntity)
    private studentKeyPairRepository: Repository<StudentKeyPairEntity>,
    private readonly configService: ConfigService,
  ) {}

  createUserVC(dto: UserVCDto) {
    const { studentMajorCode, holderPubKey } = dto;
    const uuid = uuidv4();
    const vc = createVC(uuid, studentMajorCode, holderPubKey);
    return { uuid, vc };
  }

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
    return;
  }

<<<<<<< HEAD
=======
  // TODO: 학과 본부 DB라고 가정한 student-pair 테이블 구현 필요 (pk, email, student_number)
  async verifyMatchMajor(email: string, studentNumber: string) {
    const studentPair = await this.studentKeyPairRepository.findOne({
      where: { email, studentNumber },
    });
    if (!studentPair) {
      return { result: false };
    }
    return { result: true };
  }

>>>>>>> 4b9006879fd1399d99ee374d3863f97aff149b04
  generateProofValue() {
    //! Key는 일단 env 파일로 관리
    // Issuer Key Pair 생성
    // => Public Key: 32자리 base58 / Private Key: 64자리 base58
    // const { publicKey, secretKey } = ed25519.generateKeyPair();

    // VC sign 목적 proofValue 생성
    // Private Key로 msg를 sign함
    // => Proof Value: 64자리 base58
    const message = `pnu_${uuidv4()}`;
<<<<<<< HEAD
    return bs58.encode(
      ed25519.sign(
        bs58.decode(this.configService.get<string>('ISSUER_PRI_KEY')),
        Buffer.from(message),
      ),
    );
  }

  verifyProofValue(message: string, proofValue: string): boolean {
    // proofValue에 대해 Public Key로 verify
    return ed25519.verify(
      bs58.decode(this.configService.get<string>('ISSUER_PUB_KEY')),
      Buffer.from(message),
      bs58.decode(proofValue),
    );
=======
    return {
      proofValue: bs58.encode(
        ed25519.sign(
          bs58.decode(this.configService.get<string>('ISSUER_PRI_KEY')),
          Buffer.from(message),
        ),
      ),
      message,
    };
>>>>>>> 4b9006879fd1399d99ee374d3863f97aff149b04
  }

  async getIssuerPubKey() {
    // TODO: DB에서 Issuer Pub Key 가져와서 반환
    return 'quixotic-debt.testnet';
  }
}
