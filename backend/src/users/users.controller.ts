// users/users.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
    Logger,
  } from '@nestjs/common';
  import { Request } from 'express';
  import { UsersService } from './users.service';
  import { CreateUserDto } from './dto/create-user.dto';
  import { UpdateUserDto } from './dto/update-user.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDocument } from './schemas/user.schema';

  interface RequestWithUser extends Request {
    user: UserDocument;
  }
  
  @Controller('users')
  export class UsersController {
    private readonly logger = new Logger(UsersController.name);

    constructor(private readonly usersService: UsersService) {
      this.logger.log('UsersController initialized');
    }
  
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
      const user = await this.usersService.create(createUserDto);
      return user;
    }
  
    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll() {
      const users = await this.usersService.findAll();
      return users;
    }
  
    @Get('profile')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Req() req: RequestWithUser) {
      const user = await this.usersService.findById(req.user.id);
      return user;
    }
  
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id: string) {
      const user = await this.usersService.findById(id);
      return user;
    }
  
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
      const updatedUser = await this.usersService.update(id, updateUserDto);
      return updatedUser;
    }
  
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: string) {
      await this.usersService.remove(id);
      return { message: 'User deleted successfully' };
    }
  }