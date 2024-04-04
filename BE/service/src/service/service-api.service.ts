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
import { LoginUserDto } from 'src/dto/user-login.dto';
import { compare, compareSync, hashSync } from 'bcryptjs';
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
    const hashedPwd = hashSync(dto.password, 10);
    await this.userRepository.save({ ...dto, pk: uuid, password: hashedPwd });
    return { statusCode: 200, data: { pk: uuid } };
  }

  async loginUser(dto: LoginUserDto) {
    const { id, password } = dto;
    const userRow = await this.userRepository.findOne({ where: { id } });
    console.log(userRow);
    if (!userRow) {
      return { statusCode: 404, data: { message: 'User not exist' } };
    }
    const isPasswordMatch = compareSync(password, userRow.password);
    console.log(isPasswordMatch);
    if (!isPasswordMatch) {
      return { statusCode: 400, data: { message: 'Password is not match' } };
    }
    const payload = { userId: userRow.pk };
    console.log(payload);
    const token = await this.jwtService.signAsync(payload);
    console.log(token);
    return { statusCode: 200, data: { token } };
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
