import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { UserVCDto } from '../dto/user-vc.dto';

@Injectable()
export class HolderAPIService {
  constructor(
    private httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  // Issuer 호출
  async createUserVC(dto: UserVCDto) {
    const { studentNumber, holderPubKey } = dto;
    const studentMajorCode = this.getUserMajorCode(studentNumber);
    const url = this.configService.get<string>('API_CREATE_USER_VC');
    return lastValueFrom(
      this.httpService
        .post(url, { params: { studentMajorCode, holderPubKey } })
        .pipe(map((response) => response?.data)),
    );
  }

  // Issuer 호출
  async getProofValue() {
    const url = this.configService.get<string>('API_GET_PROOF_VALUE');
    return lastValueFrom(
      this.httpService.post(url).pipe(map((response) => response?.data)),
    );
  }

  getUserMajorCode(studentNumber: string): number {
    // TODO: 학번 파싱 후 대응되는 학과 코드 반환 (const에 저장)
    return 24;
  }
}
