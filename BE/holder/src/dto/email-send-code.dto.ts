import { ApiProperty } from '@nestjs/swagger';

export class EmailSendCodeDto {
  @ApiProperty({ description: 'email' })
  readonly email: string;
}
