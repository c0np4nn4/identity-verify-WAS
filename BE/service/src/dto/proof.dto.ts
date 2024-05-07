import { ApiProperty } from '@nestjs/swagger';

export class ProofDto {
  @ApiProperty({
    description: 'Service Name',
    example: 'kataomoi-boat',
  })
  readonly ServiceName: string;

  @ApiProperty({
    description: 'Holder pub key',
    example: 'honorable-muscle.testnet',
  })
  readonly HolderPubKey: string;

  @ApiProperty({ description: 'proof', example: '-' })
  readonly proof: string;

  @ApiProperty({ description: 'publicSignals', example: '-' })
  readonly publicSignals: string;
}
