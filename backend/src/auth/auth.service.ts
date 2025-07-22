import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserDocument } from '../users/schemas/user.schema';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  access_token: string;
  token_type: string;
  expires_in: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async validateUserById(id: string): Promise<UserDocument | null> {
    try {
      return await this.usersService.findById(id);
    } catch (error) {
      return null;
    }
  }

  async signup(signupDto: CreateUserDto): Promise<AuthResponse>  {
    try {
      const user = await this.usersService.create(signupDto);
      return this.generateAuthResponse(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  generateAuthResponse(user: UserDocument): AuthResponse {
    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
    };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '1d',
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      access_token,
      token_type: 'Bearer',
      expires_in: this.configService.get<string>('JWT_EXPIRES_IN') || '1d',
    };
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
