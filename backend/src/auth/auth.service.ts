import { ConflictException, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
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
    _id: string;
    email: string;
    name: string;
  };
  access_token: string;
  token_type: string;
  expires_in: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    this.logger.debug(`Validating user: ${email}`);
    try {
      const user = await this.usersService.findByEmailWithPassword(email);
      if (!user) {
        this.logger.warn(`User not found: ${email}`);
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        this.logger.warn(`Invalid password for user: ${email}`);
        return null;
      }

      const { password: _, ...result } = user.toObject();
      this.logger.debug(`User validated successfully: ${email}`);
      return result;
    } catch (error) {
      this.logger.error(`Error validating user ${email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async validateUserById(id: string): Promise<UserDocument | null> {
    this.logger.debug(`Validating user by ID: ${id}`);
    try {
      const user = await this.usersService.findById(id);
      if (!user) {
        this.logger.warn(`User not found by ID: ${id}`);
      }
      return user;
    } catch (error) {
      this.logger.error(`Error validating user by ID ${id}: ${error.message}`, error.stack);
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
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      access_token,
      token_type: 'Bearer',
      expires_in: this.configService.get<string>('JWT_EXPIRES_IN') || '1d',
    };
  }

}
