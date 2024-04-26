import { ApiProperty } from '@nestjs/swagger';

export class CreateBoatDto {
  @ApiProperty({ description: 'userPk', example: 'test_pk' })
  userPk: string;

  @ApiProperty({
    description: 'labels',
    example: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
  })
  labels: string[];

  @ApiProperty({
    description: 'secrete labels',
    example: ['s1', 's2'],
  })
  secreteLabels: string[];

  // @ApiProperty({ description: 'isOccupied', example: 'false' })
  // isOccupied: boolean;
}
