import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { describe, beforeEach, it, expect, jest } from '@jest/globals';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  describe('getHealth', () => {
    it('should return health status with timestamp', () => {
      // Mock the current date for consistent testing
      const mockDate = new Date('2025-07-27T00:00:00.000Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date);
      
      const result = appController.getHealth();
      
      expect(result).toEqual({
        status: 'Service is healthy',
        timestamp: '2025-07-27T00:00:00.000Z',
      });
      
      // Clean up the mock
      jest.restoreAllMocks();
    });
  });
});
