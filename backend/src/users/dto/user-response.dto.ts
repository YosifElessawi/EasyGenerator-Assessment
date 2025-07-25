import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class UserResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString(), { toClassOnly: true })
  _id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
