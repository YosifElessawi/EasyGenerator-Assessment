import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Types } from 'mongoose';
import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { UserDocument } from './schemas/user.schema';

describe('UsersController', () => {
  let controller: UsersController;
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

  const mockRequest = {
    user: {
      id: mockUserId.toString(),
      email: 'test@example.com',
    },
  };

  beforeEach(async () => {
    // Create a partial mock of UsersService
    const mockUsersService: Partial<Record<keyof UsersService, jest.Mock>> = {
      create: jest.fn().mockImplementation(() => Promise.resolve(mockUser)),
      findAll: jest.fn().mockImplementation(() => Promise.resolve([mockUser])),
      findById: jest.fn().mockImplementation(() => Promise.resolve(mockUser)),
      update: jest.fn().mockImplementation(() => Promise.resolve(mockUser)),
      remove: jest.fn().mockImplementation(() => Promise.resolve(mockUser)),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockImplementation(() => Promise.resolve(true)),
      })
      .compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    it('should create a new user', async () => {
      const result = await controller.create(createUserDto);
      expect(result).toEqual(mockUser);
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockUser]);
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  describe('getProfile', () => {
    it('should return the profile of the authenticated user', async () => {
      const result = await controller.getProfile(mockRequest as any);
      expect(result).toEqual(mockUser);
      expect(usersService.findById).toHaveBeenCalledWith(mockUserId.toString());
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const result = await controller.findOne(mockUserId.toString());
      expect(result).toEqual(mockUser);
      expect(usersService.findById).toHaveBeenCalledWith(mockUserId.toString());
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      name: 'Updated User',
    };

    it('should update a user', async () => {
      const result = await controller.update(mockUserId.toString(), updateUserDto);
      expect(result).toEqual(mockUser);
      expect(usersService.update).toHaveBeenCalledWith(
        mockUserId.toString(),
        updateUserDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const result = await controller.remove(mockUserId.toString());
      expect(result).toEqual({ message: 'User deleted successfully' });
      expect(usersService.remove).toHaveBeenCalledWith(mockUserId.toString());
    });
  });
});
