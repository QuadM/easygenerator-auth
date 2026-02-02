import { IsString, IsNotEmpty, MinLength, MaxLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'johndoe', description: 'User display name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  username: string;

  @ApiProperty({ example: 'strongPassword123!', description: 'User password (min 8 chars)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
