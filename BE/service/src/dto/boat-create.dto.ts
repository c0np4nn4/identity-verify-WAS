import { ApiProperty } from '@nestjs/swagger';

export class CreateBoatDto {
  @ApiProperty({ description: 'userPk', example: 'test_pk' })
  userPk: string;

  @ApiProperty({ description: 'label1', example: 'a' })
  label1?: string;

  @ApiProperty({ description: 'label2', example: 'b' })
  label2?: string;

  @ApiProperty({ description: 'label3', example: 'c' })
  label3?: string;

  @ApiProperty({ description: 'label4', example: 'd' })
  label4?: string;

  @ApiProperty({ description: 'label5', example: 'e' })
  label5?: string;

  @ApiProperty({ description: 'label6', example: 'f' })
  label6?: string;

  @ApiProperty({ description: 'label7', example: 'g' })
  label7?: string;

  @ApiProperty({ description: 'label8', example: 'h' })
  label8?: string;

  @ApiProperty({ description: 'label9', example: 'i' })
  label9?: string;

  @ApiProperty({ description: 'label10', example: 'j' })
  label10?: string;

  @ApiProperty({ description: 'secrete1', example: 's1' })
  secrete1?: string;

  @ApiProperty({ description: 'secrete2', example: 's2' })
  secrete2?: string;

  // @ApiProperty({ description: 'isOccupied', example: 'false' })
  // isOccupied: boolean;
}
