import { JWTPayload } from '@flare/api-interfaces';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: (req) => {
        return req.signedCookies.token ?? null;
      },
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: JWTPayload & Record<string, string>) {
    return {
      id: payload.sub,
      email: payload.email,
      username: payload.username,
    };
  }
}
