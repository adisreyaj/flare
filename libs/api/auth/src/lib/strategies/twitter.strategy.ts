import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-twitter';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
  constructor(private config: ConfigService) {
    super({
      consumerKey: config.get('TWITTER_API_KEY'),
      consumerSecret: config.get('TWITTER_API_SECRET'),
      callbackURL: config.get('TWITTER_CALLBACK_URI'),
      userProfileURL:
        'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
      passReqToCallback: true,
    });
  }

  async validate(
    accessToken: string,
    tokenSecret: string,
    profile: any,
    done: (err, user) => void
  ): Promise<any> {
    console.log({ profile });
    // const { name, emails, photos } = profile;
    // const user = {
    //   email: emails[0].value,
    //   firstName: name.givenName,
    //   lastName: name.familyName,
    //   image: photos[0].value,
    // };
    done(null, { foo: 'bar' });
  }
}
