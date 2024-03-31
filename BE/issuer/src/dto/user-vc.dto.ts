import { ApiProperty } from '@nestjs/swagger';

export class UserVCDto {
  @ApiProperty({ description: '학생 전공 코드' })
  readonly studentMajorCode: string;

  @ApiProperty({ description: 'Holder pub key' })
  readonly holderPubKey: string;
}
