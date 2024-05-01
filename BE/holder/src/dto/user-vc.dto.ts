import { ApiProperty } from '@nestjs/swagger';

export class UserVCDto {
  @ApiProperty({ description: 'Holder pub key', example: 'hpubkey' })
  readonly holderPubKey: string;
}
