import { ApiProperty } from '@nestjs/swagger';

export class ProofDto {
  @ApiProperty({ description: 'Service Name', example: 'One-sided love paper boat' })
  readonly ServiceName: string;

  @ApiProperty({ description: 'Holder pub key', example: 'hpubkey' })
  readonly HolderPubKey: string;

  @ApiProperty({ description: 'Proof (by json)', example: 'proof' })
  readonly proof: string;

  @ApiProperty({ description: 'Issuer pub key (by json)', example: 'ipubkey' })
  readonly IssuerPubKey: string;

  // @ApiProperty({ description: 'user pk', example: 'pk' })
  // readonly pk: string;

  @ApiProperty({ description: 'VKey (by json)', example: 'vkey' })
  readonly vKey: string;
}
