import { ApiProperty } from '@nestjs/swagger';

export class UserVCDto {
  @ApiProperty({ description: '학과 코드' })
  readonly studentMajorCode: number;

  @ApiProperty({ description: 'Holder pub key' })
  readonly holderPubKey: string;
}
