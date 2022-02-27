import { Controller, Get, Req, Res } from '@nestjs/common';
import { AuthService } from '@flare/api/auth';
import { Request, Response } from 'express';
import { Public } from '@flare/api/shared';

@Controller('')
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('demo')
  publicLogin(@Req() req: Request, @Res() res: Response) {
    return this.authService.handleDemoLogin(req, res);
  }
}
