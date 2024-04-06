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
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
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
      context: { code },
      html: `
        <div style="font-family: 'Arial', sans-serif; color: #333;">
          <h1 style="background-color: #f2f2f2; padding: 10px; text-align: center;">본인 인증 코드 안내</h1>
          <p>안녕하세요. 인증 코드를 알려드립니다.</p>
          <h2><strong>인증 코드:</strong> ${code}</h2>
          <p style="color: #ff0000;">* 주의사항 *</p>
          <ul>
            <li>인증코드는 발송시간으로부터 5분간 유효합니다.</li>
            <li>유효한 인증시간이 지난 경우에는 인증코드를 다시 발급 받아야 합니다.</li>
          </ul>
          <p>이 메일은 발신 전용 메일이므로 회신이 불가능합니다. 자세한 사항은 홈페이지를 참고해주시기 바랍니다.</p>
        </div>`,
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
