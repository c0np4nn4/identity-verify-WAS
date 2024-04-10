import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ description: 'id', example: 'test' })
  readonly id: string;

  @ApiProperty({ description: 'password', example: 'pwd' })
  readonly password: string;
}
