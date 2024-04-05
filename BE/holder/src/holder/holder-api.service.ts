import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { UserVCDto } from '../dto/user-vc.dto';
import { EmailSendCodeDto } from '../dto/email-send-code.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class HolderAPIService {
  constructor(
    private httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private jwtService: JwtService,
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
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += Math.round(Math.random() * 9).toString();
    }

    // TODO: 인증코드 저장 과정 필요 (FE로 토큰 발급?)
    await this.mailerService.sendMail({
      to: email,
      subject: 'Hello! Confirmation Code for Sign up',
      template: 'register.ejs',
      context: { code },
      html: `<h1></h1>`,
    });
    const token = this.generateEmailCodeToken(email, code);
    return { statusCode: 200, data: { token } };
  }

  // Issuer 호출) 학생 email - 학번 매칭 여부 검증
  async verifyMajorMatch(email: string, studentNumber: string) {
    const url = this.configService.get<string>('API_VERIFY_MAJOR_MATCH');
    return lastValueFrom(
      this.httpService
        .get(url, { params: { email, studentNumber } })
        .pipe(map((response) => response?.data)),
    );
  }

  generateEmailCodeToken(email: string, code: string) {
    return this.jwtService.sign({ email, code });
  }
}
