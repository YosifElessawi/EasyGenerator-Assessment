import { ApiProperty, PartialType } from '@nestjs/swagger';
import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password'] as const)
) {
  @ApiProperty({
    description: 'The name of the user',
    example: 'Updated Name',
    required: false
  })
  name?: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'updated.email@example.com',
    required: false
  })
  email?: string;
}
