import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ description: 'nickname', example: 'test_name' })
  readonly nickname: string;

  @ApiProperty({ description: 'id', example: 'test' })
  readonly id: string;

  @ApiProperty({ description: 'password', example: 'pwd' })
  readonly password: string;
}
