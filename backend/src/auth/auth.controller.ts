import { Controller, Post, Body, UseGuards, Get, Req, UnauthorizedException, Logger, HttpCode, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SigninDto } from './dto/signin.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserDocument } from '../users/schemas/user.schema';


interface RequestWithUser extends Request {
  user: UserDocument;
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
      this.logger.warn(`Failed signin attempt for email: ${signinDto.email}`);
      throw new UnauthorizedException('Authentication failed');
    }
    
    this.logger.log(`User ${req.user._id} signed in successfully`);
    return this.authService.generateAuthResponse(req.user);
  }

  @Post('signup')
  async signup(@Body() signupDto: CreateUserDto) {
    this.logger.debug(`Signup attempt for email: ${signupDto.email}`);
    try {
      const user = await this.authService.signup(signupDto);
      this.logger.log(`User ${user.user._id} registered successfully`);
      return user;
    } catch (error) {
      this.logger.error(`Signup failed for email ${signupDto.email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: RequestWithUser) {
    const userId = req.user._id.toString();
    this.logger.debug(`Profile request for user: ${userId}`);
    
    try {
      const profile = await this.authService.getProfile(userId);
      this.logger.verbose(`Profile retrieved for user: ${userId}`);
      return profile;
    } catch (error) {
      this.logger.error(`Failed to get profile for user ${userId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: RequestWithUser) {
    const userId = req.user._id;
    this.logger.log(`User ${userId} is logging out`);
  
    const response = {
      message: 'Logged out successfully',
    };
    
    this.logger.log(`User ${userId} logged out successfully`);
    return response;
  }
}
