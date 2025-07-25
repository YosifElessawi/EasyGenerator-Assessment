import { Controller, Post, Body, UseGuards, Get, Req, UnauthorizedException, Logger, HttpCode, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SigninDto } from './dto/signin.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserDocument } from '../users/schemas/user.schema';
import { UserResponseDto } from '../users/dto/user-response.dto';


interface RequestWithUser extends Request {
  user: UserResponseDto;
}

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Req() req: RequestWithUser, @Body() signinDto: SigninDto) {
    this.logger.debug(`Signin attempt for email: ${signinDto.email}`);
    if (!req.user) {
      this.logger.warn('Authentication failed: User not found');
      throw new UnauthorizedException('Authentication failed');
    }
    
    this.logger.log(`User ${req.user._id} signed in successfully`);
    return await this.authService.generateAuthResponse(req.user);
  }

  @Post('signup')
  async signup(@Body() signupDto: CreateUserDto) {
    this.logger.debug(`Signup attempt for email: ${signupDto.email}`);
    return this.authService.signup(signupDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: RequestWithUser) {
    const userId = req.user._id;
    this.logger.log(`User ${userId} is logging out`);
    this.logger.log(`User ${userId} logged out successfully`);
    return {
      message: 'Logged out successfully',
    };
  }
}
