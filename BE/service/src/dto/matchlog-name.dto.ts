import { ApiProperty, PartialType } from '@nestjs/swagger';
import { MatchLogSendDto } from './matchlog-send.dto';

export class MatchLogNameDto extends PartialType(MatchLogSendDto) {
  @ApiProperty({ description: 'name', example: 'ㄱㅁㅅ' })
  name?: string;
}
