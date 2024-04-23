import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBoatDto } from './boat-create.dto';

export class ModifyBoatDto extends PartialType(CreateBoatDto) {
  @ApiProperty({ description: 'pk', example: 1 })
  pk?: number;
}
