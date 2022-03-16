import { Handler } from '@netlify/functions';
import { Redis } from '@upstash/redis';
import { createCipheriv, createHash, randomBytes } from 'crypto';
import { request } from 'undici';

function encrypt(text: string) {
  const iv = randomBytes(16);
  const key = Buffer.from(
    createHash('sha256')
      .update(String(process.env.ENCRYPTION_SECRET))
      .digest('base64')
      .substr(0, 32)
  );
  const cipher = createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + '|||' + encrypted.toString('hex');
}

const getTokenURL = (code: string, redirectUri: string) => {
  return `https://accounts.spotify.com/api/token?grant_type=authorization_code&code=${code}&redirect_uri=${encodeURI(
    redirectUri
  )}`;
};

const errorResponse = (
  message = 'Something went wrong...Oops!',
  data: Record<string, any>
) => {
  console.log('Error:', message, JSON.stringify(data));
  return {
    statusCode: 500,
    body: JSON.stringify({
      message,
      ...data,
    }),
  };
};

export const handler: Handler = async (event, context) => {
  const {
    SPOTIFY_REDIRECT_URI,
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
    REDIS_URL,
    REDIS_WRITE_TOKEN,
    FRONT_END_REDIRECT_URI,
  } = process.env;
  const { code, state } = event.queryStringParameters;
  const tokenFetchURL = getTokenURL(code, SPOTIFY_REDIRECT_URI);
  const headers = {
    authorization: `Basic ${Buffer.from(
      `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
    ).toString('base64')}`,
    'content-type': 'application/x-www-form-urlencoded',
  };

  let bodyParsed: null | Record<string, any> = null;
  try {
    const { statusCode, body } = await request(tokenFetchURL, {
      method: 'POST',
      headers,
    });
    bodyParsed = await body.json();
    if (statusCode !== 200) {
      return errorResponse('Token request failed', {
        body: bodyParsed,
        statusCode,
      });
    }
  } catch (error) {
    return errorResponse('Failed Fetch', { error });
  }

  try {
    const redis = new Redis({ url: REDIS_URL, token: REDIS_WRITE_TOKEN });
    const encrypted = encrypt(bodyParsed['refresh_token']);
    await redis.set(state, encrypted);

    return {
      statusCode: 200,
      body: `<script>
              if (window.opener) {
                // send them to the opening window
                window.opener.postMessage({message:'refresh'});
                // close the popup
                window.close();
              }    
      </script>`,
    };
  } catch (error) {
    console.error(error);
    return errorResponse('Failed to set token', { error });
  }
};
