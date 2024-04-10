import { ApiProperty } from '@nestjs/swagger';

export class UserVCDto {
  @ApiProperty({ description: '학과 코드', example: 12 })
  readonly studentMajorCode: number;

  @ApiProperty({ description: 'Holder pub key', example: 'hpubkey' })
  readonly holderPubKey: string;
}
