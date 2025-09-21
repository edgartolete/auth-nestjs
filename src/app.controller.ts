import { Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Param('appCode') appCode: string): string {
    return this.appService.getHello(appCode);
  }
}
