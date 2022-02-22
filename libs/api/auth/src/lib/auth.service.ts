import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@flare/api/prisma';

@Injectable()
export class AuthService {
  frontendCallBackUrl = this.config.get('FRONT_END_CALLBACK_URL');

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      rejectOnNotFound: true,
    });
    const isMatching = await bcrypt.compare(password, user.password);
    if (isMatching) {
      return { token: await this.generateAccessToken(user) };
    } else {
      throw new UnauthorizedException();
    }
  }

  async generateAccessToken(user: Partial<User>) {
    const payload = {
      email: user.email,
      sub: user.id,
      username: user.username,
      aud: 'flare-web',
      iss: 'flare',
    };
    return this.jwtService.sign(payload);
  }

  async handleSocialLogin(req: Request, res: Response) {
    console.info(req.user);
    if (!req.user) {
      res.redirect(this.frontendCallBackUrl);
      return;
    }

    let user = await this.prisma.user.findUnique({
      where: { email: req.user.email },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      user = await this.signup(req.user);
    }

    if (!user) {
      throw new InternalServerErrorException('Failed to authenticate');
    }

    const accessToken = await this.generateAccessToken(user);
    res.cookie('token', accessToken, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      signed: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });
    res.redirect(
      `${this.frontendCallBackUrl}?code=SUCCESS&token=${accessToken}`
    );
    return;
  }

  private async signup(userData: Partial<User>) {
    const user: Prisma.UserCreateInput = {
      email: userData.email,
      username: null,
      firstName: userData.firstName,
      lastName: userData?.lastName ?? '',
      image: userData.image,
      onboardingState: { state: 'SIGNED_UP' },
      bio: {
        create: {
          twitter: '',
          description: '',
          github: '',
          facebook: '',
          devto: '',
          hashnode: '',
          linkedin: '',
        },
      },
      preferences: {
        create: {
          kudos: {
            enabled: false,
          },
          header: {
            enabled: true,
            type: 'DEFAULT',
            image: { name: 'default-header.jpeg' },
          },
          blogs: {
            enabled: false,
          },
        },
      },
    };
    try {
      return await this.prisma.user.create({
        data: user,
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
