import { ApiProperty } from '@nestjs/swagger';

export class UserVCDto {
  @ApiProperty({ description: '학생 전공 코드', example: '12' })
  readonly studentMajorCode: string;

  @ApiProperty({ description: 'Holder pub key', example: 'hpubkey' })
  readonly holderPubKey: string;
}
