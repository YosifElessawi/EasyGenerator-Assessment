import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService, AuthResponse, JwtPayload } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SigninDto } from './dto/signin.dto';
import { UserDocument } from '../users/schemas/user.schema';
import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Types } from 'mongoose';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  // Create a mock user that matches the UserDocument interface
  const mockUserId = new Types.ObjectId();
  const mockUser = {
    _id: mockUserId,
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedpassword',
    save: jest.fn().mockImplementation(function() {
      return Promise.resolve(this);
    })
  } as unknown as UserDocument;

  const mockAuthResponse: AuthResponse = {
    user: {
      _id: mockUserId.toString(),
      email: 'test@example.com',
      name: 'Test User',
    },
    access_token: 'mock-jwt-token',
    token_type: 'Bearer',
    expires_in: '1d',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn().mockImplementation(() => Promise.resolve(mockAuthResponse)),
            generateAuthResponse: jest.fn().mockImplementation(() => Promise.resolve(mockAuthResponse)),
            getProfile: jest.fn().mockImplementation(() => Promise.resolve(mockUser)),
            validateUser: jest.fn().mockImplementation(() => Promise.resolve(mockUser)),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn().mockImplementation(() => Promise.resolve(mockUser)),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('1d'),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(LocalAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signin', () => {
    const signinDto: SigninDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should return auth response on successful login', async () => {
      const req = { user: mockUser };
      const result = await controller.signin(req as any, signinDto);
      
      expect(result).toEqual(mockAuthResponse);
      expect(authService.generateAuthResponse).toHaveBeenCalledWith(mockUser);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const req = { user: null };
      
      await expect(controller.signin(req as any, signinDto)).rejects.toThrow(
        'Authentication failed',
      );
    });
  });

  describe('signup', () => {
    const createUserDto: CreateUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    it('should create a new user and return auth response', async () => {
      const result = await controller.signup(createUserDto);
      
      expect(result).toEqual(mockAuthResponse);
      expect(authService.signup).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw ConflictException when email already exists', async () => {
      const error = new Error('User with this email already exists') as Error & {
        response: { message: string };
      };
      
      error.response = {
        message: 'User with this email already exists',
      };
      
      jest.spyOn(authService, 'signup').mockRejectedValueOnce(error);

      await expect(controller.signup(createUserDto)).rejects.toThrow(
        'User with this email already exists',
      );
    });
  });
});
