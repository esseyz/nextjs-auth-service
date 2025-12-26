import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('health')
  checkHealth() {
    return { 
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '2.0.0',
    };
  }
}
