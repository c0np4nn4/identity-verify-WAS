import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ description: 'nickname' })
  readonly nickname: string;

  @ApiProperty({ description: 'id' })
  readonly id: string;

  @ApiProperty({ description: 'password' })
  readonly password: string;
}
