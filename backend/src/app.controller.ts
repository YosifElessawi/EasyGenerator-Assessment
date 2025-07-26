import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

class HealthCheckResponse {
  /**
   * The status message
   * @example 'Service is healthy'
   */
  status: string;
  
  /**
   * Current server timestamp
   * @example '2025-07-27T00:00:00.000Z'
   */
  timestamp: string;
}

@ApiTags('Health Check')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Health check endpoint',
    description: 'Check if the API service is up and running.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Service is healthy',
    type: HealthCheckResponse
  })
  getHealth(): HealthCheckResponse {
    return {
      status: 'Service is healthy',
      timestamp: new Date().toISOString(),
    };
  }
}
