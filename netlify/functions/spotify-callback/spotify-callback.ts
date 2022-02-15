import { Handler } from '@netlify/functions';
import { auth, set } from '@upstash/redis';
import { request } from 'undici';

const getTokenURL = (code: string, redirectUri: string) => {
  return `https://accounts.spotify.com/api/token?grant_type=authorization_code&code=${code}&redirect_uri=${encodeURI(
    redirectUri,
  )}`;
};

const errorResponse = (message = 'Something went wrong...Oops!', data: Record<string, any>) => {
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
  } = process.env;
  const { code, state } = event.queryStringParameters;
  const tokenFetchURL = getTokenURL(code, SPOTIFY_REDIRECT_URI);
  console.log('Received a callback', state);
  const headers = {
    'authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString(
      'base64',
    )}`,
    'content-type': 'application/x-www-form-urlencoded',
  };

  let statusCode: number | null = null;
  let bodyParsed: null | Record<string, any> = null;
  try {
    const { statusCode, body } = await request(tokenFetchURL, {
      method: 'POST',
      headers,
    });
    bodyParsed = await body.json();
    console.log('Body', bodyParsed);
    if (statusCode !== 200) {
      return errorResponse('Token request failed', { body: bodyParsed, statusCode });
    }
  } catch (error) {
    return errorResponse('Failed Fetch', { error });
  }

  try {
    auth(REDIS_URL, REDIS_WRITE_TOKEN);
    const { error } = await set(state, bodyParsed['refresh_token']);
    if (error) {
      return errorResponse('Token set failed', { error });
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Success`,
      }),
    };
  } catch (error) {
    return errorResponse('Failed to set token', { error });
  }
};
