import { ApiProperty } from '@nestjs/swagger';

export class UserInfoDto {
  @ApiProperty({ description: '학번' })
  readonly stNum: string;

  @ApiProperty({ description: '비밀번호' })
  readonly stPwd: string;
}
