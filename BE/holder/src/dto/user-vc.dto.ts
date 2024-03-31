import { ApiProperty } from '@nestjs/swagger';

export class UserVCDto {
  @ApiProperty({ description: '학번' })
  readonly studentNumber: string;

  @ApiProperty({ description: 'Holder pub key' })
  readonly holderPubKey: string;
}
