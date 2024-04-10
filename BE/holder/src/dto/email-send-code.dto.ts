import { ApiProperty } from '@nestjs/swagger';

export class EmailSendCodeDto {
  @ApiProperty({ description: 'email', example: 'test@test.com' })
  readonly email: string;
}
