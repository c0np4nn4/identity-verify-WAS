import { ApiProperty, PartialType } from '@nestjs/swagger';
import { MatchLogSendDto } from './matchlog-send.dto';

export class MatchLogAnswerDto extends PartialType(MatchLogSendDto) {
  @ApiProperty({ description: 'answer', example: 'YES' })
  answer?: string;
}
