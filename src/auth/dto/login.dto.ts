import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'The login username of the user.',
    example: 'johndoe',
  })
  @IsString()
  login: string;

  @ApiProperty({
    description: 'The password for the user account.',
    example: 'password123',
  })
  @IsString()
  password: string;
}
