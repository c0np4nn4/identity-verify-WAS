/* eslint-disable @typescript-eslint/no-var-requires */
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { REGISTER_EMAIL_TEMPLATE } from '../common/const';
import { UserVCDto } from '../dto/user-vc.dto';
import { EmailSendCodeDto } from '../dto/email-send-code.dto';
import { connectToNEARContract } from 'src/utils/utils';
import { NEARContract } from 'src/types/types';

@Injectable()
export class HolderAPIService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) {}

  CREATE_USER_VC = this.configService.get<string>('API_CREATE_USER_VC');

  /*
    @ Use: Holder Controller - createUserVC()
    @ Intend: VC 생성 요청을 위한 FE - Issuer간의 proxy 
    * API Call: Issuer - createUserVC()
  */
  async createUserVC(
    dto: UserVCDto,
  ): Promise<{ issuerPubKey: string; vc: string; message: string }> {
    return lastValueFrom(
      this.httpService
        .post(this.CREATE_USER_VC, {
          params: { ...dto },
        })
        .pipe(map((response) => response?.data)),
    );
  }

  /*
    @ Use: Holder Controller - sendEmailCode()
    @ Intend: 사용자 이메일로 인증코드를 발송하여 2차 인증
  */
  async sendEmailCode(dto: EmailSendCodeDto): Promise<string> {
    const { email } = dto;
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += Math.round(Math.random() * 9).toString();
    }

    await this.mailerService.sendMail({
      to: email,
      subject: 'Hello! Confirmation Code for Sign up',
      html: REGISTER_EMAIL_TEMPLATE(code),
    });
    const token = this.generateEmailCodeToken(email, code);
    return token;
  }

  /*
    @ Use: Holder Service - sendEmailCode()
    @ Intend: FE에서 직접 이메일 유효 검증을 위한 JWT 토큰 생성
  */
  generateEmailCodeToken(email: string, code: string): string {
    return this.jwtService.sign({ email, code });
  }

  /*
    @ Use: Holder Controller - createUserVC()
    @ Intend: 사용자 계정 생성시 DID 등록
  */
  async loadDID() {
    const contract = await connectToNEARContract();
    await (contract as NEARContract).reg_did_using_account({
      is_issuer: false,
    });
    return true;
  }
}
