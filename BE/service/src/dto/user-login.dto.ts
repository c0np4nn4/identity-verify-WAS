import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ description: 'id' })
  readonly id: string;

  @ApiProperty({ description: 'password' })
  readonly password: string;
}
