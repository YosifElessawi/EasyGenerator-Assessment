import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    try {
      const existingUser = await this.userModel.findOne({ email: createUserDto.email });
      
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      // Hash the password before saving
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
      
      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword
      });
      
      return await newUser.save();
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).select('-password').exec();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }


  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    
    if (!result) {
      throw new NotFoundException('User not found');
    }
  }
}

