import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
  @Get('health')
  @ApiOperation({ summary: 'Health check', description: 'Returns system name, operational status, phase, and timestamp.' })
  @ApiResponse({ status: 200, description: 'The API is healthy and running.' })
  health() {
    return {
      name: 'FlyMenu API',
      status: 'ok',
      phase: 'Phase 1',
      timestamp: new Date().toISOString(),
    };
  }
}

