import { ApiProperty } from '@nestjs/swagger';

export class ProofDto {
  @ApiProperty({ description: 'Holder pub key' })
  readonly HolderPubKey: string;

  @ApiProperty({ description: 'Proof' })
  readonly proof: string;

  @ApiProperty({ description: 'Issuer pub key' })
  readonly IssuerPubKey: string;

  @ApiProperty({ description: 'Major code' })
  readonly majorCode: string;

  @ApiProperty({ description: 'Message' })
  readonly message: string;

  @ApiProperty({ description: 'Params', type: 'object' })
  params: object;

  @ApiProperty({ description: 'VKey(Uint8Array -> String)' })
  vkey: string;

  @ApiProperty({
    description: 'Strategy(Uint8Array -> String)',
  })
  strategy: string;
}
