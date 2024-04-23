import { ApiProperty, PartialType } from '@nestjs/swagger';
import { MatchLogSendDto } from './matchlog-send.dto';

export class MatchLogLabelDto extends PartialType(MatchLogSendDto) {
  @ApiProperty({ description: 'label1', example: 'a' })
  label1?: string;

  @ApiProperty({ description: 'label2', example: 'b' })
  label2?: string;

  @ApiProperty({ description: 'label3', example: 'c' })
  label3?: string;
}
