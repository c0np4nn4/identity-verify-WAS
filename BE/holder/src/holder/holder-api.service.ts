import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { UserVCDto } from '../dto/user-vc.dto';
import { EmailSendCodeDto } from '../dto/email-send-code.dto';

@Injectable()
export class HolderAPIService {
  constructor(
    private httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  // Issuer 호출
  async createUserVC(dto: UserVCDto) {
    const { studentMajorCode, holderPubKey } = dto;
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

  
  async sendEmailCode(dto: EmailSendCodeDto) {
    const { email } = dto;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { statusCode: 400, data: { message: 'Invalid Email' } };
    }
    const code = Math.floor(Math.random() * 900000) + 100000;

    // TODO: Email 전송 라이브러리 사용 필요
    // TODO: 이메일 인증 코드 관리 외부 API로 대체

    // await this.emailCodeRepository.save({
    //   email: dto.email,
    //   code: code.toString(),
    // });
    return { statusCode: 200 };
  }

  // TODO: 이메일 인증 코드 관리 외부 API로 대체
  async verfiyEmailCode(email: string, code: string) {
    // const emailRow = await this.emailCodeRepository.findOne({
    //   where: { email: email },
    // });
    // if (!emailRow) {
    //   return { result: false, message: 'Email Not Exist' }
    // }
    // const isCodeMatch = emailRow.code === code;
    // if (!isCodeMatch) {
    //   return { result: false, message: 'Code is not match' }
    // }
    return { result: true, message: "" };
  }



  // Issuer 호출) 학생 email - 학번 매칭 여부 검증
  async verifyMajorMatch(email: string, studentNumber: string) {
    // TODO: launch.env에 추가
    // /api/issuer/verify-match
    const url = this.configService.get<string>('API_VERIFY_MAJOR_MATCH');
    return lastValueFrom(
      this.httpService
        .get(url, { params: { email, studentNumber } })
        .pipe(map((response) => response?.data)),
    );
  }
}
