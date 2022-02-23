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
        /**
         * Get both the http and non http tokens from cookies
         * and match them.
         *
         * For logged-out user, the `token-sync` cookie will not be present.
         */
        const token = req.signedCookies['token'];
        const tokenSync = req.signedCookies['token-sync'];
        if (token && tokenSync && token === tokenSync) {
          return token;
        } else {
          return null;
        }
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
