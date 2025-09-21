import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(appCode: string): string {
    return `Hello World!${appCode}`;
  }
}
