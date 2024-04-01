import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { ProofDto } from '../dto/proof.dto';
import { lastValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entity/user.entity';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { RegisterUserDto } from 'src/dto/user-register.dto';
import { EmailCodeEntity } from 'src/entity/email-code.entity';
import { EmailSendCodeDto } from 'src/dto/email-send-code.dto';
import { CustomErrorException } from 'src/filter/custom-error.exception';
import { LoginUserDto } from 'src/dto/user-login.dto';

@Injectable()
export class ServiceAPIService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(EmailCodeEntity)
    private emailCodeRepository: Repository<EmailCodeEntity>,
    private httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /* 
    Web Application Service API
  */

  async registerUser(dto: RegisterUserDto) {
    const isIdDuplicate = await this.userRepository.findOne({
      where: { id: dto.id },
    });
    // 같은 id가 있는 경우
    if (isIdDuplicate) {
      return { statusCode: 400, data: { message: 'Id Duplicate' } };
    }
    const isNicknameDuplicate = await this.userRepository.findOne({
      where: { nickname: dto.nickname },
    });
    // 같은 nickname이 있는 경우
    if (isNicknameDuplicate) {
      return { statusCode: 400, data: { message: 'Nickname Duplicate' } };
    }
    const uuid = uuidv4();
    await this.userRepository.save({ ...dto, pk: uuid });
    return { statusCode: 200, data: { pk: uuid } };
  }

  async sendEmailCode(dto: EmailSendCodeDto) {
    const { email } = dto;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { statusCode: 400, data: { message: 'Invalid Email' } };
    }
    const code = Math.floor(Math.random() * 900000) + 100000;

    // TODO: Email 전송 라이브러리 사용 필요

    await this.emailCodeRepository.save({
      email: dto.email,
      code: code.toString(),
    });
    return { statusCode: 200 };
  }

  async verfiyEmailCode(email: string, code: string) {
    const emailRow = await this.emailCodeRepository.findOne({
      where: { email: email },
    });
    if (!emailRow) {
      return { result: false, message: 'Email Not Exist' }
    }
    const isCodeMatch = emailRow.code === code;
    if (!isCodeMatch) {
      return { result: false, message: 'Code is not match' }
    }
    return { result: true };
  }

  async loginUser(dto: LoginUserDto) {
    const { id, password } = dto;
    const userRow = await this.userRepository.findOne({ where: { id } });
    if (!userRow) {
      return { statusCode: 404, data: { message: 'User not exist' } };
    }
    const isPasswordMatch = userRow.password === password;
    if (!isPasswordMatch) {
      return { statusCode: 400, data: { message: 'Password is not match' } };
    }
    return { statusCode: 200 };
  }

  // Issuer에게 학생 email - 학번 매칭 여부 검증
  async verifyMajorMatch(email: string, studentNumber: string) {
    // TODO: test.env, launch.env에 추가
    const url = this.configService.get<string>('API_VERIFY_MAJOR_MATCH');
    return lastValueFrom(
      this.httpService
        .get(url, { params: { email, studentNumber } })
        .pipe(map((response) => response?.data)),
    );
  }

  /* 
    Protocol API
  */

  // Verfier API 호출
  async verifyProof(dto: ProofDto): Promise<boolean> {
    const url = this.configService.get<string>('API_VERIFY_PROOF');
    return lastValueFrom(
      this.httpService
        .post(url, { params: { ...dto } })
        .pipe(map((response) => response.data)),
    );
  }

  // config 폴더의 mock data를 DB에 삽입
  async initMock() {
    // const filePath = path.join(process.cwd(), './src/config/student.data.txt');
    // const fileContent = await fs.readFile(filePath, 'utf8');
    // const lines = fileContent.split('\n');
    // lines.map(async (line) => {
    //   const [number, password, major_code] = line.split(' ');
    //   await this.userRepository.save({
    //     number,
    //     password,
    //     major_code,
    //   });
    // });
    return;
  }
}
