import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';

import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    this.logger.log('UsersService initialized');
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    this.logger.log(`Attempting to create user with email: ${createUserDto.email}`);
    try {
      const existingUser = await this.userModel.findOne({ email: createUserDto.email });
      
      if (existingUser) {
        this.logger.warn(`User creation failed - email already exists: ${createUserDto.email}`);
        throw new ConflictException('User with this email already exists');
      }

      // Hash the password before saving
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
      
      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword
      });
      
      const savedUser = await newUser.save();
      this.logger.log(`User created successfully with ID: ${savedUser._id}`);
      
      // Convert to DTO and return
      return plainToClass(UserResponseDto, savedUser.toObject(), {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    this.logger.debug('Fetching all users');
    try {
      const users = await this.userModel.find().select('-password').lean().exec();
      this.logger.debug(`Found ${users.length} users`);
      // Convert each user to DTO
      return users.map(user => 
        plainToClass(UserResponseDto, user, {
          excludeExtraneousValues: true,
        })
      );
    } catch (error) {
      this.logger.error('Failed to fetch users', error.stack);
      throw error;
    }
  }
  
  async findById(id: string): Promise<UserResponseDto> {
    this.logger.debug(`Looking up user by ID: ${id}`);
    try {
      const user = await this.userModel.findById(id).select('-password').lean().exec();
      
      if (!user) {
        this.logger.warn(`User not found with ID: ${id}`);
        throw new NotFoundException('User not found');
      }
      
      return plainToClass(UserResponseDto, user, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error(`Error finding user with ID: ${id}`, error.stack);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    this.logger.debug(`Looking up user by email: ${email}`);
    try {
      const user = await this.userModel.findOne({ email }).exec();
      if (!user) {
        this.logger.debug(`No user found with email: ${email}`);
      }
      return user;
    } catch (error) {
      this.logger.error(`Error finding user by email: ${email}`, error.stack);
      throw error;
    }
  }

  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    this.logger.debug(`Looking up user by email with password: ${email}`);
    try {
      const user = await this.userModel.findOne({ email }).select('+password').exec();
      if (!user) {
        this.logger.debug(`No user found with email: ${email}`);
      }
      return user;
    } catch (error) {
      this.logger.error(`Error finding user by email with password: ${email}`, error.stack);
      throw error;
    }
  }


  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    this.logger.log(`Updating user with ID: ${id}`);
    try {
      const user = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .select('-password')
        .lean()
        .exec();
      
      if (!user) {
        this.logger.warn(`Update failed - user not found with ID: ${id}`);
        throw new NotFoundException('User not found');
      }
      
      this.logger.log(`Successfully updated user with ID: ${id}`);
      return plainToClass(UserResponseDto, user, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error(`Error updating user with ID: ${id}`, error.stack);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Attempting to delete user with ID: ${id}`);
    try {
      const result = await this.userModel.findByIdAndDelete(id).exec();
      
      if (!result) {
        this.logger.warn(`Delete failed - user not found with ID: ${id}`);
        throw new NotFoundException('User not found');
      }
      
      this.logger.log(`Successfully deleted user with ID: ${id}`);
    } catch (error) {
      this.logger.error(`Error deleting user with ID: ${id}`, error.stack);
      throw error;
    }
  }
}

