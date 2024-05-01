import { ApiProperty } from '@nestjs/swagger';

export class ProofDto {
  @ApiProperty({ description: 'Holder pub key', example: 'hpubkey' })
  readonly HolderPubKey: string;

  @ApiProperty({ description: 'Proof', example: 'proof' })
  readonly proof: string;

  @ApiProperty({ description: 'Issuer pub key', example: 'ipubkey' })
  readonly IssuerPubKey: string;

  // TODO: might be deprecated
  @ApiProperty({ description: 'Major code', example: '12' })
  readonly majorCode: string;

  @ApiProperty({ description: 'Message', example: 'message' })
  readonly message: string;

  @ApiProperty({
    description: 'Params',
    type: 'object',
    example: { data: 'something' },
  })
  params: object;

  @ApiProperty({ description: 'VKey(Uint8Array -> String)', example: 'vkey' })
  vkey: string;

  @ApiProperty({
    description: 'Strategy(Uint8Array -> String)',
    example: 'strategy',
  })
  strategy: string;
}
