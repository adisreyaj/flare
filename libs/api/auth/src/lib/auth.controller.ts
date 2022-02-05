import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request) {
    return req;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    console.info('Logging in via Google');
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    return this.authService.handleSocialLogin(req, res);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    console.info('Logging in via Github');
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  githubAuthRedirect(@Req() req: Request, @Res() res: Response) {
    return this.authService.handleSocialLogin(req, res);
  }
}
