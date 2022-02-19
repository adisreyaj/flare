import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from '@flare/api/shared';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request) {
    return req;
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    console.info('Logging in via Google');
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.handleSocialLogin(req, res);
  }
  /*
  @Public()
  @Get('twitter')
  @UseGuards(AuthGuard('twitter'))
  async twitterAuth() {
    console.info('Logging in via Google');
  }

  @Public()
  @Get('twitter/callback')
  @UseGuards(AuthGuard('twitter'))
  twitterAuthRedirect(@Req() req: Request, @Res() res: Response) {
    return this.authService.handleSocialLogin(req, res);
  }*/

  @Public()
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    console.info('Logging in via Github');
  }

  @Public()
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  githubAuthRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.handleSocialLogin(req, res);
  }
}
