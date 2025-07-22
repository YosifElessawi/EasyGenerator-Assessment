import { Controller, Post, Body, UseGuards, Get, Req, UnauthorizedException } from '@nestjs/common';
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
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Req() req: RequestWithUser, @Body() signinDto: SigninDto) {
    if (!req.user) {
      throw new UnauthorizedException('Authentication failed');
    }
    return this.authService.generateAuthResponse(req.user);
  }

  @Post('signup')
  async signup(@Body() signupDto: CreateUserDto) {
    return this.authService.signup(signupDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    return this.authService.getProfile(req.user._id.toString());
  }
}
