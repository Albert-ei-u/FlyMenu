import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  health() {
    return {
      name: 'FlyMenu API',
      status: 'ok',
      phase: 'Phase 1',
      timestamp: new Date().toISOString(),
    };
  }
}
