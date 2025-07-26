import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    MaxLength,
    Matches,
  } from 'class-validator';
  
  export class CreateUserDto {
    @ApiProperty({
      description: 'User email address',
      example: 'user@example.com',
      required: true,
    })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;
  
    @ApiProperty({
      description: 'User password',
      example: 'Sec@Pass@123!',
      minLength: 8,
      maxLength: 50,
      required: true,
    })
    @IsString({ message: 'Password must be a string' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(50, { message: 'Password must not exceed 50 characters' })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/, {
      message:
        'Password must contain at least one letter, one number, and one special character',
    })
    @IsNotEmpty({ message: 'Password is required' })
    password: string;
  
    @ApiProperty({
      description: 'User name',
      example: 'John Doe',
      minLength: 2,
      maxLength: 100,
      required: true,
    })
    @IsString({ message: 'Name must be a string' })
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    @MaxLength(100, { message: 'Name must not exceed 100 characters' })
    @IsNotEmpty({ message: 'Name is required' })
    name: string;
  }