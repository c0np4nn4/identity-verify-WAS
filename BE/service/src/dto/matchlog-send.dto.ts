import { ApiProperty } from '@nestjs/swagger';

export class MatchLogSendDto {
  @ApiProperty({ description: '요청하는 사용자 pk', example: 'a' })
  readonly userPk: string;

  @ApiProperty({ description: '요청받는 사용자 pk', example: 'b' })
  readonly targetPk: string;
}
