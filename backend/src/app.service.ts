import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Checks the health status of the application
   * @returns A health check status object
   */
  checkHealth(): { status: string; timestamp: string } {
    return {
      status: 'Service is healthy',
      timestamp: new Date().toISOString(),
    };
  }
}
