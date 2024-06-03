import { ApiProperty } from '@nestjs/swagger';

export class ProofDto {
  @ApiProperty({
    description: 'Service Name',
    example: 'kataomoi-boat',
  })
  readonly ServiceName: string;

  @ApiProperty({
    description: 'Issuer pub key',
    example: 'wakeful-cave.testnet',
  })
  readonly IssuerPubKey: string;

  @ApiProperty({ description: 'proof', example: '-' })
  readonly proof: string;

  @ApiProperty({ description: 'userPk', example: '-' })
  readonly userPk: string;
}
