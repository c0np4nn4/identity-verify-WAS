import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { ProofDto } from '../dto/proof.dto';
import { lastValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { RegisterUserDto } from 'src/dto/user-register.dto';
import { LoginUserDto } from 'src/dto/user-login.dto';
import { compareSync, hashSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ServiceAPIService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  VERIFY_PROOF = this.configService.get<string>('API_VERIFY_PROOF');

  /* 
    ! Web Application Service API
  */

  /*
    @ Use: Service Controller - registerUser()
    @ Intend: 1차 회원가입
  */
  async registerUser(dto: RegisterUserDto) {
    // 중복 id 검사
    const isIdDuplicate = await this.userRepository.findOne({
      where: { id: dto.id },
    });
    if (isIdDuplicate) {
      return { statusCode: 400, data: { message: 'Id Duplicate' } };
    }

    // 중복 nickname 검사
    const isNicknameDuplicate = await this.userRepository.findOne({
      where: { nickname: dto.nickname },
    });
    if (isNicknameDuplicate) {
      return { statusCode: 400, data: { message: 'Nickname Duplicate' } };
    }

    const uuid = uuidv4();
    const hashedPwd = hashSync(dto.password, 10);
    await this.userRepository.save({ ...dto, pk: uuid, password: hashedPwd });
    return { statusCode: 200, data: { pk: uuid } };
  }

  /*
    @ Use: Service Controller - loginUser()
    @ Intend: 1차 로그인
  */
  async loginUser(dto: LoginUserDto) {
    const { id, password } = dto;

    // 미등록 id
    const userRow = await this.userRepository.findOne({ where: { id } });
    if (!userRow) {
      return { statusCode: 404, data: { message: 'User not exist' } };
    }

    // password 불일치
    const isPasswordMatch = compareSync(password, userRow.password);
    if (!isPasswordMatch) {
      return { statusCode: 400, data: { message: 'Password is not match' } };
    }

    const payload = { userId: userRow.pk };
    const token = await this.jwtService.signAsync(payload);
    const { nickname } = userRow;
    return { statusCode: 200, data: { token, nickname } };
  }

  /*
    @ Use: Token Guard
    @ Intend: 토큰으로 사용자 정보 추출
  */
  async getUserInfoByToken(token: string) {
    const decodedToken = await this.jwtService.decode(token);
    const pk = decodedToken?.pk;

    const userInfo = await this.userRepository.findOne({
      where: { pk },
    });
    if (!userInfo) {
      return { result: false };
    }

    return { result: true, userInfo };
  }

  /* 
    ! Protocol API
  */

  /*
    @ Use: Service Controller - verifyProof()
    @ Intend: 2차 인증의 ZKP proof 검증을 Verifier에게 요청
    * API Call: Verifier
  */
  async verifyProof(dto: ProofDto): Promise<boolean> {
    return lastValueFrom(
      this.httpService
        .post(this.VERIFY_PROOF, { params: { ...dto } })
        .pipe(map((response) => response.data)),
    );
  }
}
